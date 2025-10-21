# ZumProtect — Safe Script Manager (GitHub-connected)

This project is a Next.js-based script manager styled like an executor UI (dark + purple theme).
It stores scripts as files under `scripts/` in your GitHub repo by using the GitHub REST API.
**This project is intended for legal, legitimate use only.** Do not use it to host cheating/exploit tools.

## Setup (quick)

1. Create a GitHub fine-grained token and grant `Contents: Read & Write` for your private repo.
2. Add these environment variables in Vercel (Project → Settings → Environment Variables):
   - `GITHUB_TOKEN` - your token
   - `GITHUB_REPO` - `UwURaww/test`
   - `ADMIN_PASSWORD` - `protogen12`

3. Push this project to your repo and deploy to Vercel.

## Notes
- Protected scripts render a ZumProtect shield page to visitors; executors can fetch raw content from `/api/raw/[id]`.
- For production, consider using a more robust auth flow and rotating tokens regularly.
