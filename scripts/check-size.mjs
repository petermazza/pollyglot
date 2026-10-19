// Bundle-size budget — builds the app and fails if any shipped JS/CSS asset
// exceeds the raw or gzip caps. Keeps the page fast on real connections.
import { execSync } from 'node:child_process'
import { gzipSync } from 'node:zlib'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Baseline (2026-10-18): one 674 kB raw / 251 kB gzip JS chunk — React +
// the language catalog in a single entry. Budgets sit ~20% above baseline to
// catch real growth without demanding a code-split nobody asked for.
const RAW_LIMIT = 800 * 1024 // per asset
const GZIP_LIMIT = 300 * 1024 // per asset
const TOTAL_GZIP_LIMIT = 320 * 1024 // whole bundle

console.log('Building production bundle…')
execSync('npm run build', { stdio: 'inherit' })

const dist = join(import.meta.dirname, '..', 'dist', 'assets')
let totalGzip = 0
let failed = false

for (const file of readdirSync(dist)) {
  const body = readFileSync(join(dist, file))
  const raw = body.length
  const gzip = gzipSync(body).length
  totalGzip += gzip
  const status = raw <= RAW_LIMIT && gzip <= GZIP_LIMIT ? 'OK' : 'OVER'
  if (status === 'OVER') failed = true
  console.log(
    `${status}: ${file} — ${(raw / 1024).toFixed(0)} kB raw / ${(gzip / 1024).toFixed(0)} kB gzip`,
  )
}

console.log(`Total gzip: ${(totalGzip / 1024).toFixed(0)} kB (limit ${TOTAL_GZIP_LIMIT / 1024} kB)`)
if (totalGzip > TOTAL_GZIP_LIMIT) failed = true

if (failed) {
  console.error('Bundle-size budget exceeded.')
  process.exit(1)
}
console.log('OK: bundle within size budget.')
