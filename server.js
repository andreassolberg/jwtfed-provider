
const
  JWTFedAdapter = require('./lib/JWTFedAdapter'),
  JWTWebFinger = require('./lib/JWTWebFinger'),
  morgan = require('morgan'),
  nconf = require('nconf')


const Provider = require('oidc-provider')
const Router = require('koa-router')
const assert = require('assert')
const configuration = {
  // ... see available options /docs/configuration.md
}


nconf.argv()
  .env({
    "separator": '__',
    "lowerCase": true
  })
  .file({ file: 'etc/config.json' })



const healthcheck = new Router();
healthcheck.get('/', async (ctx, next) => {
  ctx.body = 'OK!'
})

const webfinger = new JWTWebFinger(nconf.get('iss'), nconf.get('metadata'), nconf.get('authorityHints'), nconf.get('kid'), nconf.get('jwks'))


assert(process.env.ISSUER, 'Environment variable ISSUER missing')
assert(process.env.SECURE_KEY, 'Environment variable SECURE_KEY missing')
assert.equal(process.env.SECURE_KEY.split(',').length, 2, 'Environment variable SECURE_KEY format invalid')

const oidc = new Provider(process.env.ISSUER, configuration);

(async () => {
  await oidc.initialize({ adapter: JWTFedAdapter })
  // oidc.callback => express/nodejs style application callback (req, res)
  // oidc.app => koa2.x application
  oidc.use(healthcheck.routes())
  oidc.use(webfinger.routes())
  oidc.listen(3000)
  oidc.keys = process.env.SECURE_KEY.split(',')
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration')
})().catch((err) => {
  console.error(err)
  process.exitCode = 1
});


// http://localhost:3000/auth?client_id=foo&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback&scope=openid&state=af0ifjsldkj&nonce=n-0S6_WzA2Mj&response_type=code
// http://localhost:3000/auth?client_id=foo&response_type=code&scope=openid
// http://localhost:3000/auth?client_id=https%3A%2F%2Fserviceprovider.andreas.labs.uninett.no%2Fapplication1007&response_type=code&scope=openid
