
const
  uuidv4 = require('uuid/v4'),
  jwtfed = require('jwtfed'),
  highlight = require('cli-highlight').highlight,
  isUrl = require('is-url')


const demoMetadata = { client_id: 'https://serviceprovider.andreas.labs.uninett.no/application1007', client_secret: 'bar', redirect_uris: ['http://lvh.me/cb'] }
const trustroot = [
    {
        "sub": "https://edugain.andreas.labs.uninett.no/openid",
        "subTypes": ["openidProvider", "openidClient"],
        "metadata": {
          "openidClient": {
            "special": true
          }
        },
        "jwks": [
          {
            "kty": "RSA",
            "use": "sig",
            "alg": "RS256",
            "n": "qnd5_krrHKzuJzb5_YEt4sP-YOGSbfVL_g06h1Q-q0nzTsO8MwtWVQx1nuR1cV-ruNwF2sFFGRNejVNKOxL8n5tGuYgJBRJBB5KcbnvRqSEMpObJxQzQuQrzxXFqMlmVRaaCINL5qFWTmdJz79cPleBBPr9DsD9O-nDSGV-R0LT3YWH0SrY5cEDVasUhWnFRY5eOTMRtxUB2m8FXBaZVAlIr5-Gy-SaTmybKQJ74iVpG16Hbw4t0tw14ReEO0aAsDq24cU7bHOueWnxZPfOltueZnIEKe3_eAmh-fieLvkkZSKqXRWKg_tZDbnjUqWH2lVvC2ReEOrns971V0Hjcbw",
            "e": "AQAB",
            "key_ops": [
              "verify"
            ],
            "ext": true,
            "kid": "edugain"
          }
        ]
    }
]

class JWTFedAdapter {

  constructor(name) {
    this.name = name
    this.jwtfed = new jwtfed.ESFetcher()
    this.clientCache = {}
  }

  async find(id) {
    if (this.clientCache.hasOwnProperty(id)) {
      console.log("Returning cache of  " + id)
      return this.clientCache[id]
    }
    console.log("Finding an client " + id)
    if (!isUrl(id)) {
      console.error("Client_id is not an url and was not cached")
      // throw new Error("Could not find client")
      return null
    }
    console.log("Finding an client " + id + " using JWT Federation")
    return this.jwtfed.fetchChained(id)
      .then((list) => {
        console.log("Resulting list of entity statements from JWT Federation")
        console.log(JSON.stringify(list, undefined, 2), {language: "json"})

        const tc = new jwtfed.TrustChain(trustroot)
        list.forEach((es) => {
          tc.add(es)
        })
        tc.dump()
        let paths = tc.findPaths()
        if (paths.length === 0) {throw new Error("No trust paths found")}

        console.log()
        console.log(highlight("Discovered trusted paths ", {language: "markdown"}))
        console.log(highlight(JSON.stringify(paths, undefined, 2), {language: "json"}))
        console.log()

        let metadata = tc.validate(paths[0], 'openidClient')
        console.log(highlight("--------- ", {language: "markdown"}))
        console.log(highlight("Resolved metadata for " + metadata.identifier, {language: "markdown"}))
        console.log(highlight("Type " + metadata.entityType, {language: "markdown"}))

        console.log(highlight("Trusted JWKS:", {language: "markdown"}))
        console.log(highlight(JSON.stringify(metadata.jwks, undefined, 2), {language: "json"}))

        metadata.metadata['client_secret'] = uuidv4()

        let metadataobject = metadata.getMetadata()

        // metadataobject.jwks = {
        //   keys: metadata.jwks.jwks
        // }
        // delete metadataobject.jwks


        // metadataobject = demoMetadata;

        console.log(highlight("Metadata:", {language: "markdown"}))
        console.log(highlight(JSON.stringify(metadataobject, undefined, 2), {language: "json"}))

        return metadataobject

      })
      .catch((err) => {
        console.error("===== ERROR =====")
        console.error(err)
      })

  }

  async upsert(id, payload, expiresIn) {
    console.log("ID", id, " payload ", payload, " expiresin ", expiresIn)
    this.clientCache[id] = payload
    return payload
  }

  async findByUserCode(userCode) {
    console.log("findByUserCode()")
  }

  async destroy(id) {
    console.log("destroy()")
    delete this.clientCache[0]
  }

  async consume(id) {
    console.log("consume()")
  }

  key(id) {
    return `${this.name}:${id}`;
  }

}

module.exports = JWTFedAdapter
