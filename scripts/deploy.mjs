// Builds the site, uploads it to S3, and clears the CloudFront cache.
//
//   npm run deploy               build + upload + invalidate
//   npm run deploy -- --dry-run  build + show what would change, touch nothing
//
// Requires the AWS CLI, configured with credentials that can write to the bucket
// and create CloudFront invalidations (see README).

import { execSync } from 'node:child_process'

const BUCKET = 'colinneary.com'
const DISTRIBUTION_ID = 'E2TBX22JE1WK98'

const dryRun = process.argv.includes('--dry-run')
const dryFlag = dryRun ? ' --dryrun' : ''

function run(command) {
  console.log(`\n> ${command}`)
  execSync(command, { stdio: 'inherit' })
}

function check(command, message) {
  try {
    execSync(command, { stdio: 'ignore' })
  } catch {
    console.error(message)
    process.exit(1)
  }
}

check('aws --version', 'AWS CLI not found. Install it, then run `aws configure`.')
check('aws sts get-caller-identity', 'AWS credentials missing or invalid. Run `aws configure`.')

try {
  if (execSync('git status --porcelain').toString().trim()) {
    console.warn('Warning: you have uncommitted changes. They will be deployed anyway.')
  }
} catch {
  // Not a git checkout; nothing to warn about
}

run('npm run build')

// Vite fingerprints everything in assets/ (e.g. index-CcFLP90P.js), so browsers can cache it forever.
run(`aws s3 sync dist/assets s3://${BUCKET}/assets --cache-control "public,max-age=31536000,immutable"${dryFlag}`)

// Everything else (index.html, favicon, game builds) must be re-checked on every visit so updates show up.
// --delete removes files from the bucket that are no longer in dist/.
run(`aws s3 sync dist s3://${BUCKET} --exclude "assets/*" --cache-control "no-cache" --delete${dryFlag}`)

// Remove old fingerprinted assets last, after the new index.html points at the new ones.
run(`aws s3 sync dist/assets s3://${BUCKET}/assets --delete${dryFlag}`)

if (dryRun) {
  console.log('\nDry run complete. Nothing was uploaded, deleted, or invalidated.')
} else {
  run(`aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"`)
  console.log('\nDeployed. CloudFront usually finishes invalidating within a minute or two.')
}
