
const
  Router = require('koa-router'),
  jwtfed = require('jwtfed'),
  URL = require('url').URL

const ESREL = 'http://oauth.net/specs/federation/1.0/entity'

class JWTWebFinger {

  constructor(iss, metadata, authorityHints, kid, jwks) {
    this.iss = iss
    this.metadata = metadata
    this.authorityHints = authorityHints
    this.kid = kid
    this.jwks = new jwtfed.JWKS(jwks)
    this.signer = new jwtfed.EntityStatementSigner(this.jwks)

    this.router = new Router()
    this.router.get('/.well-known/webfinger', async (ctx, next) => this.webFinger(ctx, next) )
    this.router.get('/jwtfed/entitystatement', async (ctx, next) => this.jwtfed(ctx, next) )
    this.router.get('/jwtfed/jwks', async (ctx, next) => this.jwksHosted(ctx, next) )
  }

  routes() {
    return this.router.routes()
  }

  async jwksHosted(ctx, next) {
    ctx.body = [this.jwks.getJWT('verify', this.kid)]
  }

  async webFinger(ctx, next) {
    let esurl = (new URL('/jwtfed/entitystatement', this.iss)).toString()
    if (ctx.query && ctx.query.resource && ctx.query.resource === this.iss) {
      ctx.body = {
        subject: this.iss,
        links: [
          {
            rel: ESREL,
            href: esurl
          }
        ]
      }
    }
  }

  async jwtfed(ctx, next) {
    let jwksUrl = (new URL('/jwtfed/jwks', this.iss)).toString()
    this.metadata.jwks_uri = jwksUrl
    let es = new jwtfed.EntityStatement()
    es.add({
      "subTypes": ["openidProvider"],
      "authorityHints": this.authorityHints,
      "metadata": {
        "openidProvider": this.metadata
      },
      iss: this.iss,
      sub: this.iss,
      jwks: [this.jwks.getJWT('verify', this.kid)]
    })
    ctx.body = this.signer.sign(es, this.kid)
  }

}

module.exports = JWTWebFinger
