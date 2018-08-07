
const JWTFedAdapter = require('./JWTFedAdapter')
const Provider = require('oidc-provider');
const assert = require('assert')
const configuration = {
  // ... see available options /docs/configuration.md
}

assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing, run `heroku addons:create securekey`')
assert.equal(process.env.SECURE_KEY.split(',').length, 2, 'process.env.SECURE_KEY format invalid')

const oidc = new Provider('http://localhost:3000', configuration)

(async () => {
  await oidc.initialize({ adapter: JWTFedAdapter })
  // oidc.callback => express/nodejs style application callback (req, res)
  // oidc.app => koa2.x application
  oidc.listen(3000);
  oidc.keys = process.env.SECURE_KEY.split(',')
  console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration')
})().catch((err) => {
  console.error(err)
  process.exitCode = 1
});


// http://localhost:3000/auth?client_id=foo&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback&scope=openid&state=af0ifjsldkj&nonce=n-0S6_WzA2Mj&response_type=code
// http://localhost:3000/auth?client_id=foo&response_type=code&scope=openid
