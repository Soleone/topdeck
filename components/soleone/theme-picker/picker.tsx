"use client"

// oxlint-disable-next-line no-restricted-imports -- the 3D stage needs the raw Backdrop and Popup, which components/ui/dialog styles
import { Dialog } from "@base-ui/react/dialog"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { Palette, X } from "lucide-react"
import {
  memo,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  type WheelEvent,
} from "react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import { isInteractiveTarget, revealTheme, useTheme, type ThemeOption } from "@/components/soleone/theme"
import { ThemePreviewCard, type ThemeTagline } from "./preview-card"
import { Sheen } from "@/components/soleone/material/sheen"

// The ring. Cards stand on a cylinder seen from outside: the front card faces the viewer and its
// neighbours turn away as they curve back. Spacing is the arc between card centers at the front;
// it is narrower than a card, so neighbours overlap. Each card carries its own perspective and is
// stacked by distance, because cards sharing one 3D space would cut through each other.
const CARD_W = 236
const CARD_H = 252
const SPACING = 168
const MAX_SIDE_ANGLE = 80 // degrees; cards further round than this are hidden
const FRONT_LIFT = 0.07 // extra scale for the front card
const PERSPECTIVE = 1100 // px
const TILT = 10 // degrees the front card leans toward the pointer at its edge
const RING_SLOTS = 24 // the fewest cards the ring is sized for
const KEY_PRESS_MS = 140 // how long Enter holds the Select button down

const spring = (stiffness: number, damping: number) => ({ type: "spring" as const, stiffness, damping })
const turnSpring = spring(260, 30)
// The picker pops open from the middle of the screen and overshoots a touch, like the flip card's
// arrow. It fades in faster than it grows, so the growth shows.
const appearSpring = spring(380, 26)

// A fling coasts on with exponential friction and lands on a card. The time constant matches the
// throw (distance = velocity * power), so the ring leaves the finger at the speed it was moving.
const FLING_TIME = 0.45 // seconds
const MAX_FLING = 60 // cards per second
const VELOCITY_WINDOW = 100 // ms of pointer history a release measures its speed over
const CATCH_SPEED = 2 // cards per second; a tap on a ring spinning faster only stops it

// Narrow screens see the same ring, scaled to fit about three cards across.
const fitToWindow = () => Math.min(1, window.innerWidth / (CARD_W * 2.6))

// Matches the label or the mode, so typing "light" lists the light themes.
const matches = (theme: ThemeOption, query: string) =>
  `${theme.label} ${theme.mode}`.toLowerCase().includes(query.trim().toLowerCase())

// How many cards show on each side of the front before they have turned too far away.
const sideCards = (count: number) => MAX_SIDE_ANGLE / (360 / Math.max(count, RING_SLOTS))
// The ring only loops when the card wrapping round from one end to the other does it out of sight.
// Fewer cards (a filtered ring) lie in a row that ends at the first and last match, all visible.
const loops = (count: number) => (count - 1) / 2 >= sideCards(count)

const wrap = (value: number, count: number) => ((value % count) + count) % count
const clamp = (value: number, count: number) => Math.min(count - 1, Math.max(0, value))
// Signed distance from the front; on a loop the short way round, -count/2..count/2.
const offset = (index: number, position: number, count: number) => {
  const raw = index - position
  return loops(count) ? raw - count * Math.round(raw / count) : raw
}
// The card a position rests on: any whole position on a loop, the nearest end of a row.
const settle = (value: number, count: number) => (loops(count) ? Math.round(value) : clamp(Math.round(value), count))
const frontAt = (value: number, count: number) => wrap(settle(value, count), count)
// Past either end of a row the ring gives a little and pulls back, instead of stopping dead.
const RUBBER = 0.3
const stretch = (value: number, count: number) => {
  if (loops(count)) return value
  const edge = clamp(value, count)
  return edge + (value - edge) * RUBBER
}

/** `tagline` is the sample line every card shows; it defaults to the portfolio's. */
export function ThemePicker({ tagline }: { tagline?: ThemeTagline } = {}) {
  const { theme, themes: all, setTheme } = useTheme()
  // A hidden theme joins the ring only while it is the one in use.
  const themes = all.filter((candidate) => !candidate.hidden || candidate.name === theme)
  const reduced = useReducedMotion() ?? false
  const [open, setOpen] = useState(false)
  const [front, setFront] = useState(0)
  const [fit, setFit] = useState(1)
  // Set on a confirmed choice: the picker vanishes at once, so the reveal shows only the page. The ring
  // cards are not drawn at all, since each sets its own visibility and would show through a hidden parent.
  const [revealing, setRevealing] = useState(false)
  // The front card's Select button sinks while a pointer holds it, and Enter presses it visibly
  // before the choice goes through. CSS :active would miss touches, which it often skips.
  const [keyPressed, setKeyPressed] = useState(false)
  const [held, setHeld] = useState(false)
  // Mounting the ring is the slow part of opening, so it mounts hidden once the page is idle and stays.
  const [warm, setWarm] = useState(false)
  // The picker's size as it pops open.
  const appear = useMotionValue(1)

  // Continuous ring position in cards; the front card is the one it settles on.
  const position = useMotionValue(0)
  const target = useRef(0)
  const stage = useRef<HTMLDivElement>(null)

  // Typing filters the ring; the typed text takes the place of the theme name above it.
  const [query, setQuery] = useState("")
  const shown = themes.filter((candidate) => matches(candidate, query))
  const count = shown.length
  const frontTheme = shown[front]

  useMotionValueEvent(position, "change", (value) => count && setFront(frontAt(value, count)))

  // Whether the ring is coasting from a throw, which a tap may catch; a turn to a card is never caught.
  const flinging = useRef(false)

  const turnTo = (next: number) => {
    flinging.current = false
    target.current = settle(next, count)
    animate(position, target.current, reduced ? { duration: 0 } : turnSpring)
  }
  const turnBy = (cards: number) => turnTo(Math.round(target.current) + cards)

  const fling = (velocity: number) => {
    const speed = Math.max(-MAX_FLING, Math.min(MAX_FLING, velocity))
    if (reduced) return turnTo(position.get())
    flinging.current = true
    target.current = settle(position.get() + speed * FLING_TIME, count)
    animate(position, target.current, {
      type: "inertia",
      velocity: speed,
      power: FLING_TIME,
      timeConstant: FLING_TIME * 1000,
      modifyTarget: (ideal) => settle(ideal, count),
      restDelta: 0.001,
    })
  }

  // T opens the picker from anywhere, like D flips dark and light, unless the visitor is typing.
  const openFromKey = useEffectEvent((event: globalThis.KeyboardEvent) => {
    if (open || event.defaultPrevented || event.repeat) return
    if (event.metaKey || event.ctrlKey || event.altKey || event.key.toLowerCase() !== "t") return
    if (isInteractiveTarget(event.target)) return
    event.preventDefault()
    onOpenChange(true)
  })
  useEffect(() => {
    window.addEventListener("keydown", openFromKey)
    return () => window.removeEventListener("keydown", openFromKey)
  }, [])

  useEffect(() => {
    if (typeof requestIdleCallback === "undefined") {
      const timer = window.setTimeout(() => setWarm(true), 1000)
      return () => clearTimeout(timer)
    }
    const idle = requestIdleCallback(() => setWarm(true), { timeout: 3000 })
    return () => cancelIdleCallback(idle)
  }, [])

  useEffect(() => {
    if (!open) return
    const measure = () => setFit(fitToWindow())
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [open])

  const onOpenChange = (next: boolean, details?: Dialog.Root.ChangeEventDetails) => {
    // Esc while filtering clears the filter instead of leaving.
    if (!next && details?.reason === "escape-key" && query) return filter("")
    if (next) {
      // Opens on the current theme, ready to turn straight away.
      setQuery("")
      setRevealing(false)
      setFit(fitToWindow())
      const start = Math.max(
        0,
        themes.findIndex((candidate) => candidate.name === theme),
      )
      position.jump(start)
      setFront(start)
      target.current = start
      if (!reduced) {
        appear.jump(0.4)
        animate(appear, 1, appearSpring)
      }
    }
    setOpen(next)
  }

  // The page keeps its theme while the visitor browses; only a confirmed choice changes it.
  const commit = (chosen: ThemeOption | undefined) => {
    if (!chosen || chosen.name === theme) return setOpen(false)
    const card = document.getElementById(`theme-card-${chosen.name}`)?.getBoundingClientRect()
    const origin = card && { x: card.left + card.width / 2, y: card.top + card.height / 2 }
    revealTheme(
      () => {
        setTheme(chosen.name)
        setRevealing(true)
        setOpen(false)
      },
      origin,
      reduced,
    )
  }

  // A new filter keeps the front theme if it still matches, otherwise the first match comes forward.
  const filter = (next: string) => {
    const nextShown = themes.filter((candidate) => matches(candidate, next))
    const kept = frontTheme ? nextShown.indexOf(frontTheme) : -1
    const start = Math.max(0, kept)
    position.stop()
    position.jump(start)
    target.current = start
    setFront(start)
    setQuery(next)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const typing = event.key.length === 1 && (event.key !== " " || query !== "")
    if (typing && !(event.key === " " && event.target !== stage.current)) {
      event.preventDefault()
      return filter(query + event.key)
    }
    if (event.key === "Backspace" && query) {
      event.preventDefault()
      return filter(query.slice(0, -1))
    }
    if (!count) return
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (step) {
      event.preventDefault()
      turnBy(step)
    } else if ((event.key === "Enter" || event.key === " ") && event.target === stage.current) {
      // Only from the ring itself: Enter on Close means that button.
      event.preventDefault()
      if (event.repeat || keyPressed) return
      if (reduced) return commit(frontTheme)
      setKeyPressed(true)
      window.setTimeout(() => {
        setKeyPressed(false)
        commit(frontTheme)
      }, KEY_PRESS_MS)
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      const here = Math.round(target.current)
      const first = loops(count) ? here - wrap(here, count) : 0
      turnTo(event.key === "Home" ? first : loops(count) ? first - 1 : count - 1)
    }
  }

  // A mouse wheel turns one card per notch. A trackpad moves the ring with the fingers, momentum
  // included since the OS keeps scrolling, and the ring settles on a card once the scrolling stops.
  const wheel = useRef({ last: 0, settle: 0 })
  const onWheel = (event: WheelEvent) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    const notch = event.deltaMode !== 0 || (Number.isInteger(delta) && Math.abs(delta) >= 50)
    if (notch) {
      if (event.timeStamp - wheel.current.last < 60) return
      wheel.current.last = event.timeStamp
      turnBy(Math.sign(delta))
      return
    }
    position.stop()
    position.set(stretch(position.get() + delta / (SPACING * fit), count))
    clearTimeout(wheel.current.settle)
    wheel.current.settle = window.setTimeout(() => turnTo(position.get()), 120)
  }

  // Dragging anywhere moves the ring 1:1 under the pointer; letting go flings it on with the speed
  // of the last moment of the drag. A tap on a coasting throw only stops it. A tap during a turn
  // to a card leaves the turn going, so a click on the card coming forward counts at once.
  // A touch has no hover, so on a touchscreen the gesture's first direction decides: sideways turns
  // the ring, up or down on the front card tilts it under the finger for the rest of the touch.
  const drag = useRef({
    x: 0,
    y: 0,
    start: 0,
    moved: false,
    caught: false,
    // A touch waits to see its direction ("pending"); a mouse always drags the ring.
    gesture: "ring" as "pending" | "ring" | "tilt" | "none",
    samples: [] as { t: number; x: number }[],
  })
  const frontAim = useRef<FrontAim | null>(null)
  const [dragging, setDragging] = useState(false)
  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return
    const touch = event.pointerType === "touch"
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-theme-index]")
    const onFront = card !== null && Math.round(offset(Number(card.dataset.themeIndex), target.current, count)) === 0
    if (onFront && (event.target as HTMLElement).closest("[data-select]")) {
      setHeld(true)
      const letGo = () => {
        setHeld(false)
        window.removeEventListener("pointerup", letGo)
        window.removeEventListener("pointercancel", letGo)
      }
      window.addEventListener("pointerup", letGo)
      window.addEventListener("pointercancel", letGo)
    }
    // Clicks still count on a ring too small to turn; there is just nothing to drag, only to tilt.
    drag.current.moved = drag.current.caught = false
    drag.current.gesture = "ring"
    if (count < 2 && !(touch && onFront)) return
    const caught = flinging.current && Math.abs(position.getVelocity()) > CATCH_SPEED
    if (caught) position.stop()
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      start: position.get(),
      moved: false,
      caught,
      gesture: touch ? "pending" : "ring",
      samples: [{ t: event.timeStamp, x: event.clientX }],
    }
    const move = (moveEvent: globalThis.PointerEvent) => {
      const { current } = drag
      const dx = moveEvent.clientX - current.x
      if (current.gesture === "pending") {
        const dy = moveEvent.clientY - current.y
        if (Math.hypot(dx, dy) < 6) return
        // Up or down tilts the front card if it started on it, and does nothing anywhere else.
        if (Math.abs(dy) > Math.abs(dx)) current.gesture = onFront && !reduced ? "tilt" : "none"
        else current.gesture = count < 2 ? "none" : "ring"
        // A drag that started on the button is no longer pressing it.
        setHeld(false)
      }
      if (current.gesture === "tilt") return frontAim.current?.aim(moveEvent.clientX, moveEvent.clientY)
      if (current.gesture !== "ring") return
      current.samples.push({ t: moveEvent.timeStamp, x: moveEvent.clientX })
      while (current.samples.length > 2 && moveEvent.timeStamp - current.samples[0].t > VELOCITY_WINDOW)
        current.samples.shift()
      if (!current.moved && Math.abs(dx) < 4) return
      if (!current.moved) {
        // The drag takes over from wherever a turn has got to, without a jump.
        setHeld(false)
        position.stop()
        current.start = position.get() + dx / (SPACING * fit)
        setDragging(true)
      }
      current.moved = true
      position.set(stretch(current.start - dx / (SPACING * fit), count))
    }
    const up = (upEvent: globalThis.PointerEvent) => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
      setDragging(false)
      if (drag.current.gesture === "tilt") frontAim.current?.release()
      const { samples } = drag.current
      const first = samples[0]
      const last = samples[samples.length - 1]
      // Holding still before letting go throws nothing.
      const held = upEvent.timeStamp - last.t > 50
      const pxPerSecond = held || last.t === first.t ? 0 : ((last.x - first.x) / (last.t - first.t)) * 1000
      if (drag.current.moved) fling(-pxPerSecond / (SPACING * fit))
      // A caught throw stopped wherever it was; settle on the nearest card.
      else if (drag.current.caught) turnTo(position.get())
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", up)
  }

  // A plain click on the front card picks it; on any other card it turns that card to the front.
  // "Front" is where the ring is heading, so the card a turn is bringing forward already counts.
  // The empty space around the ring leaves.
  const onClick = (event: MouseEvent) => {
    const { moved, caught, gesture } = drag.current
    if (moved || caught || gesture === "tilt" || gesture === "none") return
    const element = event.target as HTMLElement
    if (element.closest("button")) return
    const card = element.closest<HTMLElement>("[data-theme-index]")
    if (!card) return onOpenChange(false)
    const index = Number(card.dataset.themeIndex)
    const distance = Math.round(offset(index, target.current, count))
    if (distance === 0) commit(shown[index])
    else turnBy(distance)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      // A chosen theme's reveal hid the cards; they come back, still hidden, for the next open.
      onOpenChangeComplete={(isOpen) => !isOpen && setRevealing(false)}
    >
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Choose a theme"
            aria-keyshortcuts="t"
            title="Theme (T)"
            // No focus ring, ever: focus comes back here each time the picker closes, and a ring
            // flashing around the icon reads as a glitch. Keyboard focus still shows as a hover fill.
            // oxlint-disable-next-line shadcn/no-restyle
            className="relative outline-none focus-visible:border-transparent focus-visible:bg-muted focus-visible:ring-0"
          >
            <Palette />
            <span className="absolute right-1.5 bottom-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        }
      />
      <Dialog.Portal keepMounted={warm}>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-background/55 duration-200 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            revealing && "invisible",
          )}
        />
        <Dialog.Popup
          initialFocus={stage}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onWheel={onWheel}
          onClick={onClick}
          className={cn(
            "fixed inset-0 z-50 flex touch-none flex-col items-center justify-center overflow-hidden text-foreground outline-none select-none duration-200 data-open:duration-75 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            revealing && "invisible",
          )}
        >
          <Dialog.Close
            render={
              <Button variant="ghost" size="icon" aria-label="Close" className="absolute top-4 right-4">
                <X />
              </Button>
            }
          />

          <motion.div
            className="flex w-full flex-col items-center"
            style={{ scale: appear }}
          >
            <div className="text-center">
              <Dialog.Title className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Theme
              </Dialog.Title>
              <div aria-live="polite" className="mt-1 h-9 overflow-hidden">
                {query ? (
                  <div className="text-3xl font-semibold tracking-tight whitespace-pre">
                    {query}
                    <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-pulse bg-primary" />
                  </div>
                ) : (
                  <motion.div
                    key={frontTheme?.name}
                    initial={reduced ? false : { y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={spring(420, 32)}
                    className="text-3xl font-semibold tracking-tight"
                  >
                    {frontTheme?.label}
                  </motion.div>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                {count === 0
                  ? "No theme matches"
                  : query
                    ? `${frontTheme?.label} · ${front + 1} of ${count}`
                    : `${String(front + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`}
                {frontTheme?.name === theme && " · current"}
              </div>
            </div>

            {/* The stage takes focus so the arrow keys turn the ring as soon as it opens. */}
            <div
              ref={stage}
              tabIndex={0}
              role="listbox"
              aria-label="Themes"
              aria-activedescendant={frontTheme ? `theme-card-${frontTheme.name}` : undefined}
              className="relative my-6 w-full outline-none"
              style={{ height: (CARD_H + 80) * fit }}
            >
              <div className="absolute top-1/2 left-1/2" style={{ transform: `scale(${fit})` }}>
                {!revealing &&
                  shown.map((candidate, index) => (
                    <RingCard
                      key={candidate.name}
                      theme={candidate}
                      index={index}
                      count={count}
                      position={position}
                      isFront={index === front}
                      tilt={index === front && !dragging && !reduced}
                      aimRef={frontAim}
                      pressed={index === front && (keyPressed || held)}
                      taglineText={tagline?.text}
                      taglineHighlight={tagline?.highlight}
                    />
                  ))}
              </div>
            </div>

            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <span>Drag or</span>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              <span className="mr-2">to browse</span>
              <Kbd>Enter</Kbd>
              <span className="mr-2">select</span>
              <span className="mr-2">type to filter</span>
              <Kbd>Esc</Kbd>
              <span>{query ? "clear" : "close"}</span>
            </div>
          </motion.div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Memoized: a fast spin changes the front card many times a second, and only two cards care.
type FrontAim = { aim: (x: number, y: number) => void; release: () => void }
// A share of the card (0..1, past its edges too) as a tilt from -1 to 1.
const unit = (share: number) => Math.min(1, Math.max(-1, share * 2 - 1))

const RingCard = memo(function RingCard({
  theme,
  index,
  count,
  position,
  isFront,
  tilt,
  aimRef,
  pressed,
  taglineText,
  taglineHighlight,
}: {
  theme: ThemeOption
  index: number
  count: number
  position: MotionValue<number>
  isFront: boolean
  tilt: boolean
  aimRef: RefObject<FrontAim | null> // where the front card takes a touch tilt from the ring's gestures
  pressed: boolean
  // Strings rather than an object, so a tagline passed inline does not defeat the memo.
  taglineText?: string
  taglineHighlight?: string
}) {
  // A filtered ring keeps the full ring's spacing, so a few matches sit side by side, not spread round.
  const slots = Math.max(count, RING_SLOTS)
  const step = (2 * Math.PI) / slots
  const radius = (SPACING * slots) / (2 * Math.PI)
  const side = sideCards(count)

  // Everything about the card's place on the ring follows from its distance to the front.
  const distance = useTransform(position, (value) => offset(index, value, count))
  const transform = useTransform(distance, (d) => {
    const angle = d * step
    const lift = 1 + FRONT_LIFT * Math.max(0, 1 - Math.abs(d))
    return `translate(-50%, -50%) perspective(${PERSPECTIVE}px) translate3d(${radius * Math.sin(angle)}px, 0, ${radius * (Math.cos(angle) - 1)}px) rotateY(${(angle * 180) / Math.PI}deg) scale(${lift})`
  })
  // The last visible card on each side fades as it turns away, so the ring has no hard edge.
  const opacity = useTransform(distance, (d) => Math.min(1, Math.max(0, side + 0.5 - Math.abs(d))))
  const visibility = useTransform(opacity, (o) => (o <= 0 ? "hidden" : "visible"))
  const zIndex = useTransform(distance, (d) => 100 - Math.round(Math.abs(d) * 4))
  const shade = useTransform(distance, (d) => Math.min(0.45, Math.abs(d) * 0.09))

  // The front card tilts toward the pointer and catches the light, like the project cards.
  const tx = useSpring(0, { stiffness: 320, damping: 26 })
  const ty = useSpring(0, { stiffness: 320, damping: 26 })
  const shine = useSpring(0, { stiffness: 200, damping: 30 })
  const rotateX = useTransform(ty, (v) => -v * TILT)
  const rotateY = useTransform(tx, (v) => v * TILT)
  // Sheen's units: a glare shift as a share of its double-size layer, and a
  // rim angle that lights the edge away from the pointer. A side card is lit on the edge that faces
  // the middle of the ring, where the light is.
  const glareX = useTransform(tx, (v) => `${v * 25}%`)
  const glareY = useTransform(ty, (v) => `${v * 25}%`)
  const rimAngle = useTransform(
    [tx, ty, distance],
    ([x, y, d]: number[]) => (Math.atan2(y, x + d) * 180) / Math.PI + 90,
  )
  const rimOpacity = useTransform(shine, [0, 1], [0.25, 1])

  // The shadow falls behind the card and slides against the tilt, like a light above the viewer.
  const shadowX = useTransform(rotateY, (deg) => -deg * 1.6)
  const shadowY = useTransform(rotateX, (deg) => 18 + deg * 0.8)
  const shadowOpacity = useTransform(distance, (d) => Math.max(0.12, 0.5 - Math.abs(d) * 0.07))

  useEffect(() => {
    if (tilt) return
    tx.set(0)
    ty.set(0)
    shine.set(0)
  }, [tilt, tx, ty, shine])

  // Aim on the untilted slot, not the card: a tilting card swings its far corner out from under the
  // pointer, which would read as leaving, flatten it, re-enter and jitter.
  const slot = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!tilt) return
    const handle: FrontAim = {
      aim(x, y) {
        const rect = slot.current?.getBoundingClientRect()
        if (!rect) return
        tx.set(unit((x - rect.left) / rect.width))
        ty.set(unit((y - rect.top) / rect.height))
        shine.set(1)
      },
      release() {
        tx.set(0)
        ty.set(0)
        shine.set(0)
      },
    }
    aimRef.current = handle
    return () => {
      if (aimRef.current === handle) aimRef.current = null
    }
  }, [tilt, aimRef, tx, ty, shine])

  // A touch tilts through the ring's gestures (aimRef) instead, once it is clear it is not a swipe.
  const hover = (event: PointerEvent<HTMLDivElement>) => {
    if (tilt && event.pointerType !== "touch") aimRef.current?.aim(event.clientX, event.clientY)
  }

  return (
    <motion.div
      data-theme-index={index}
      className="absolute top-0 left-0 cursor-pointer transform-3d"
      style={{
        width: CARD_W,
        height: CARD_H,
        transform,
        opacity,
        visibility,
        zIndex,
      }}
      ref={slot}
      onPointerMove={hover}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return // a touch tilt ends with the gesture
        tx.set(0)
        ty.set(0)
        shine.set(0)
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] top-[12%] bottom-0 rounded-4xl bg-black blur-2xl"
        style={{ x: shadowX, y: shadowY, z: -40, opacity: shadowOpacity }}
      />
      <motion.div
        id={`theme-card-${theme.name}`}
        role="option"
        aria-selected={isFront}
        aria-label={theme.label}
        className="relative size-full transform-3d"
        style={{ rotateX, rotateY }}
      >
        <ThemePreviewCard
          theme={theme}
          tagline={taglineText && taglineHighlight ? { text: taglineText, highlight: taglineHighlight } : undefined}
          depth={1}
          selectable={isFront}
          pressed={pressed}
          className="size-full"
        >
          <motion.div aria-hidden className="absolute inset-0 rounded-3xl bg-black" style={{ opacity: shade }} />
          <Sheen
            glareX={glareX}
            glareY={glareY}
            rimAngle={rimAngle}
            shine={shine}
            rimOpacity={rimOpacity}
            glare={0.55}
            rim={0.7}
            rimWidth={0.5}
          />
        </ThemePreviewCard>
      </motion.div>
    </motion.div>
  )
})
