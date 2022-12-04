# Problems Problems Everywhere

Since the whole project is based on websockets and those aren't supported by any serverless platform, this can't be deployed for free. However, this project's core can still become serverless as a webhook.
---
This may be acheived by - 
- deploying the core (check and return) to vercel cron job and making it's architecture more webhook like
- making the handler (main fn) a web hook listener app which can then be deployed serverlessly
- unfortunately interaction with whatsapp will have to go, unless websocket support comes to any serverless platoform
- Telegram however, with it's http based interactions would be perfect for the handler
---
So in summary, the new architecture would -
- check for events (updates) on vercel cron and serve as a webhook
- the handler would get notified on new data and can then do whatever it pleases
---
For Contributors - The new architecture is basically a new project tbh, but leaps and bounds in efficiency.
if you wanna contribute towards this, some articles I recommed - 
- https://www.serverless.com/examples/aws-node-github-webhook-listener
- https://vercel.com/guides/how-to-setup-cron-jobs-on-vercel
- https://vercel.com/docs/concepts/limits/overview (keep in mind some ethics too, it's a free service afterall)
---
Thanks for taking the time to check the project out!