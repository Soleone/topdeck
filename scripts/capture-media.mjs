#!/usr/bin/env node
// Records the live site for the README and portfolios: a hero still of the home page and a loop that scrolls
// the episodes, opens the feedback form and types a message (never submitted), then returns home.
// Usage: npm run media:capture -- [--url https://topdeck-soleone.vercel.app]
// Needs agent-browser (with its browser installed) and FFmpeg on the PATH. Recording and encoding come from showcase.
import { record } from '@soleone/showcase/capture'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { url: { type: 'string', default: 'https://topdeck-soleone.vercel.app' } } })
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
    await page.sleep(1200)
    await page.eval(smoothScroll(700))
    await page.sleep(1800)
    await page.eval(smoothScroll(1400))
    await page.sleep(1800)
    await page.eval(smoothScroll(0))
    await page.sleep(1500)
    await page.click('Send feedback')
    await page.waitFor(`!!document.querySelector('textarea[name=content]')`)
    await page.sleep(800)
    await page.run('click', 'textarea[name=content]')
    await page.run('keyboard', 'type', 'Loved the deck tech segment, more of those please!')
    await page.sleep(600)
    await page.run('click', 'input[name=author]')
    await page.run('keyboard', 'type', 'Sam')
    await page.sleep(1500)
    await page.run('click', 'h1 a')
    await page.waitFor(atHome)
    await page.sleep(1500)
  },
  async verify (page) {
    if (!(await page.eval(`${atHome} && scrollY === 0`))) return 'did not end back on the home page'
  }
})

console.log(`Wrote ${hero} and ${out} (${(durationMs / 1000).toFixed(1)} s). Frame sheet: ${grid}`)
