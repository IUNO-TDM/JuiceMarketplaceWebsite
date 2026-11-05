/**
 * Configuration of the JuiceMarketplaceWebsite.
 * All values can be overridden by environment variables.
 */

const env = process.env;

function parseUrl(urlString) {
    const u = new URL(urlString);
    return {
        PROTOCOL: u.protocol.replace(':', ''),
        HOST: u.hostname,
        PORT: u.port || (u.protocol === 'https:' ? 443 : 80)
    };
}

function stripTrailingSlash(url) {
    return url.replace(/\/+$/, '');
}

const publicScheme = env.PUBLIC_SCHEME || 'http';
const publicHost = env.PUBLIC_HOST || 'localhost';

const self = {};

self.LOG_LEVEL = env.LOG_LEVEL || 'debug';

self.CORE_URL = stripTrailingSlash(env.CORE_URL || 'http://localhost:3002');
self.HOST_SETTINGS = {
    MARKETPLACE_CORE: parseUrl(self.CORE_URL)
};

// Address of this website as seen by the browser (used as OIDC redirect URI base)
self.PUBLIC_WEBSITE_URL = stripTrailingSlash(env.PUBLIC_WEBSITE_URL || (publicScheme + '://' + publicHost + ':3004'));

// Keycloak, realm 'iuno'. The public URL is used for browser redirects, the internal URL for server-to-server calls.
self.KEYCLOAK_REALM = env.KEYCLOAK_REALM || 'iuno';
self.KEYCLOAK_PUBLIC_URL = stripTrailingSlash(env.KEYCLOAK_PUBLIC_URL || (publicScheme + '://' + publicHost + ':8080'));
self.KEYCLOAK_INTERNAL_URL = stripTrailingSlash(env.KEYCLOAK_INTERNAL_URL || 'http://localhost:8080');

self.OAUTH_CREDENTIALS = {
    CLIENT_ID: env.WEBSITE_CLIENT_ID || 'marketplace-website',
    CLIENT_SECRET: env.WEBSITE_CLIENT_SECRET || '',
    CALLBACK_URL: self.PUBLIC_WEBSITE_URL + '/auth/callback'
};

self.TECHNOLOGY_UUID = env.TECHNOLOGY_UUID || 'da17a8fc-a5b3-40a4-b6a5-276667db027a';

self.RECIPE_LIMIT_PER_USER = parseInt(env.RECIPE_LIMIT_PER_USER, 10) || 20;

// Without a configured secret a random one is used; sessions are then lost on restart
self.SESSION_SECRET = env.WEBSITE_SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');

module.exports = self;
