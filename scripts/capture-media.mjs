#!/usr/bin/env node
// Records the live site for the README and portfolios: a hero still of the home page and a loop that scrolls
// the episodes, spins the theme picker to Catppuccin Mocha, browses in it, then switches back to Topdeck.
// Usage: npm run media:capture -- [--url https://topdeck.soleone.xyz]
// Needs agent-browser (with its browser installed) and FFmpeg on the PATH. Recording and encoding come from showcase.
import { record } from '@soleone/showcase/capture'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { url: { type: 'string', default: 'https://topdeck.soleone.xyz' } } })
const hero = path.resolve('docs/media/hero.png')
const out = 'docs/media/demo.webp'
await mkdir(path.dirname(hero), { recursive: true })

const smoothScroll = (top) => `(window.scrollTo({ top: ${top}, behavior: 'smooth' }), true)`
const atHome = `!!document.querySelector('audio') && location.pathname === '/'`

const { durationMs, grid } = await record({
  url: values.url,
  out,
  viewport: { width: 960, height: 720 },
  width: 960,
  attempts: 3,
  start: async (page) => {
    await page.waitFor(atHome)
    await page.sleep(1500)
    await page.run('screenshot', hero)
  },
  async drive (page) {
    const pickTheme = async (key, steps) => {
      // A selector, since showcase's page.click misses buttons whose snapshot line carries [expanded=false].
      await page.run('click', 'button[aria-label="Choose a theme"]')
      await page.sleep(1200)
      for (let i = 0; i < steps; i++) {
        await page.run('press', key)
        await page.sleep(650)
      }
      await page.sleep(500)
      await page.run('press', 'Enter')
      await page.sleep(1800)
    }
    await page.sleep(1000)
    await page.eval(smoothScroll(600))
    await page.sleep(1600)
    await page.eval(smoothScroll(0))
    await page.sleep(1200)
    await pickTheme('ArrowRight', 2)
    await page.eval(smoothScroll(600))
    await page.sleep(1600)
    await page.eval(smoothScroll(0))
    await page.sleep(1200)
    await pickTheme('ArrowLeft', 2)
    await page.sleep(600)
  },
  async verify (page) {
    if (!(await page.eval(`${atHome} && scrollY === 0 && document.documentElement.dataset.theme === 'topdeck'`))) return 'did not end on the home page in the Topdeck theme'
  }
})

console.log(`Wrote ${hero} and ${out} (${(durationMs / 1000).toFixed(1)} s). Frame sheet: ${grid}`)
