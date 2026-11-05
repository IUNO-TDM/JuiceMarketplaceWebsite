# Angular 5 / Angular CLI 1.7 build chain requires an old Node.js; node:9 is EOL and its pm2 install fails, so node:10 is used.
FROM node:10

WORKDIR /usr/src/app

COPY JuiceMarketplaceWebsite-app/package.json JuiceMarketplaceWebsite-app/package-lock.json ./
RUN npm install

COPY JuiceMarketplaceWebsite-app ./

# Builds the Angular app for all languages (dist/de, dist/en); the server only needs the production dependencies afterwards
RUN npm run build-i18n && npm prune --production

ENV NODE_ENV=production
ENV PORT=3004

# Runtime configuration (see JuiceMarketplaceWebsite-app/config/config_defaults.js):
# PUBLIC_HOST, PUBLIC_SCHEME, PUBLIC_WEBSITE_URL, CORE_URL, KEYCLOAK_PUBLIC_URL, KEYCLOAK_INTERNAL_URL,
# KEYCLOAK_REALM, WEBSITE_CLIENT_ID, WEBSITE_CLIENT_SECRET, WEBSITE_SESSION_SECRET, RECIPE_LIMIT_PER_USER

EXPOSE 3004

USER node
CMD ["node", "bin/www"]
