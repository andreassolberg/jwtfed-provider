
const
  JWTFedAdapter = require('./lib/JWTFedAdapter'),
  JWTWebFinger = require('./lib/JWTWebFinger'),
  morgan = require('koa-morgan'),
  nconf = require('nconf'),
  jose = require('node-jose')

const Provider = require('oidc-provider')
const Router = require('koa-router')
const assert = require('assert')

nconf.argv()
  .env({
    "separator": '__',
    "lowerCase": true
  })
  .file({ file: 'etc/config.json' })
  .required(['iss', 'secure_key']);
assert.equal(nconf.get('secure_key').split(',').length, 2, 'Environment variable SECURE_KEY format invalid')

const healthcheck = new Router();
healthcheck.get('/', async (ctx, next) => {
  ctx.body = 'OK!'
})

const webfinger = new JWTWebFinger(nconf.get('iss'), nconf.get('metadata'), nconf.get('authorityHints'), nconf.get('kid'), nconf.get('jwks'))
const oidc = new Provider(nconf.get('iss'), {});

(async () => {
  const keystorejson = nconf.get('privateJwks')
  const keystore = await jose.JWK.asKeyStore(keystorejson)
  await oidc.initialize({ adapter: JWTFedAdapter, keystore })
  // oidc.callback => express/nodejs style application callback (req, res)
  // oidc.app => koa2.x application

  // Needed in order for provider to understand that https is used when running behind a proxy
  // Which is the case for this deployment in Google Cloud
  oidc.app.proxy = true

  oidc.use(morgan('combined'))
  oidc.use(healthcheck.routes())
  oidc.use(webfinger.routes())

  oidc.listen(3000)
  oidc.keys = nconf.get('secure_key').split(',')
  console.log('oidc-provider issuer is ' + nconf.get('iss'))
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration')
})().catch((err) => {
  console.error(err)
  process.exitCode = 1
});
