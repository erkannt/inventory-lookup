# Inventory QR Code Scanner

A hacked together app that lets people from [Deutsche Model United Nations e.V.](https://dmun.de) scan QR codes on their inventory and see associated information from a Google Sheet they maintain manually.

## Required env vars

```
SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
```

## Development

You need to have a `.env` file with the required env vars in the top level of the repo.

- `make dev` bring up dev server that watches for code changes
- `make check-and-fix` run code linter and formatter
- `make prod` bring up prod image locally
- `make release` publishes an image to [my registry](https://hub.docker.com/r/rknt/dmun-inventar-scanner) on docker.com
