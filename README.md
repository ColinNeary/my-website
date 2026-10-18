# colinneary.com

My personal website and portfolio, built with React, TypeScript, and Vite.

## Hosting

- Static site in the S3 bucket `colinneary.com`, served through CloudFront (`E2TBX22JE1WK98`)
- Domain managed in Cloudflare
- The home page counter uses two AWS Lambda function URLs (read and increment) backed by DynamoDB, in `us-east-2`. The Lambda code lives in the AWS console.

## Development

Requires Node 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

## Adding content

- **Weeklies:** add a new entry to the top of `src/data/weeklies.ts`
- **Projects:** add an entry to `src/data/projects.ts` (each gets a card and its own page at `/portfolio/<slug>`). For a game, put the web build in `public/games/<slug>/` and set `buildUrl`. Export Godot builds with Thread Support off so they run without extra headers.
- **Hover clip (optional):** a muted 3 to 5 second loop that plays over a project's thumbnail while its card is hovered. Save it as `public/previews/<slug>.mp4` (or `.webm`) and set `preview: '/previews/<slug>.mp4'` on the project. It isn't downloaded until someone first hovers the card, and it never plays for visitors who ask their system to reduce motion. To record a clip, use Xbox Game Bar (Win+G) on Windows or Shift+Ctrl+Alt+R on Ubuntu, then shrink it with [ffmpeg](https://ffmpeg.org/) (the card is 4:3, so 640x480 is plenty):

  ```bash
  ffmpeg -i raw.mp4 -t 5 -an -vf "scale=640:480:force_original_aspect_ratio=increase,crop=640:480,fps=24" -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart public/previews/<slug>.mp4
  ```

## Deploying

```bash
npm run deploy -- --dry-run   # build and show what would change
npm run deploy                # build, upload to S3, and invalidate CloudFront
```

### One-time setup on a new computer

1. Install the AWS CLI: `winget install Amazon.AWSCLI`
2. Run `aws configure` with an access key for an IAM user that has this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::colinneary.com"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::colinneary.com/*"
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::*:distribution/E2TBX22JE1WK98"
    }
  ]
}
```
