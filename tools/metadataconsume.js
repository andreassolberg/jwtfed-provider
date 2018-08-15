
const
  JWTFedAdapter = require('./lib/JWTFedAdapter'),
  jose = require('node-jose')

const clientid = 'https://jwt-client.andreas.labs.uninett.no/yay'


const ja = new JWTFedAdapter('jwtfedapater');




(async () => {


  let cm = await ja.find(clientid)
  // let keystore = await jose.JWK.asKeyStore(jwksWebfinger)

  console.log("Client metadata")
  console.log(cm)
  //
  // let result = await jose.JWS.createVerify(keystore).verify(jwttxt)
  //
  // console.log(" ---- result")
  // console.log(result)
})();
