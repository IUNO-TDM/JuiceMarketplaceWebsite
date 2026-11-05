# JuiceMarketplaceWebsite

Website for creating and browsing drink recipes on the local marketplace. Login via Keycloak (OpenID Connect, realm `iuno`, client `marketplace-website`).

## Configuration (environment variables)

| Variable | Default | Purpose |
|----------|---------|---------|
| `PUBLIC_WEBSITE_URL` | `$PUBLIC_SCHEME://$PUBLIC_HOST:3004` | URL of the website as seen by the browser; the OIDC redirect URI is `<PUBLIC_WEBSITE_URL>/auth/callback` |
| `PUBLIC_HOST`, `PUBLIC_SCHEME` | `localhost`, `http` | used to derive the defaults above |
| `CORE_URL` | `http://localhost:3002` | MarketplaceCore |
| `KEYCLOAK_PUBLIC_URL` | `$PUBLIC_SCHEME://$PUBLIC_HOST:8080` | Keycloak URL for browser redirects |
| `KEYCLOAK_INTERNAL_URL` | `http://localhost:8080` | Keycloak URL for server-to-server calls |
| `KEYCLOAK_REALM` | `iuno` | realm |
| `WEBSITE_CLIENT_ID`, `WEBSITE_CLIENT_SECRET` | `marketplace-website`, – | Keycloak client (confidential, service account with role `Public` enabled) |
| `WEBSITE_SESSION_SECRET` | random | session signing |
| `RECIPE_LIMIT_PER_USER` | `20` | maximum recipes per user |

Build: `docker build -t marketplace-website .` (Node 10; Angular 5). Port 3004.
