
const jose = require('node-jose')


const req = {
    "grant_type": "authorization_code",
    "code": "N2E4NTlhMjEtYjY4MS00ZGNkLTkwMGEtZjI4MTE1N2M0NjgwkeL3xfnQdZz1WjqFyqb2rtgV-YP18lBgZg6lCueDq5wK4G7iDjdY7R7yUejwKgeJqJ9MRDuLxSXG_N0BdyzRhw",
    "redirect_uri": "https://jwt-client.andreas.labs.uninett.no/callback",
    "state": "b3098455-5f05-4e51-9af8-fa6251388a5e",
    "client_assertion": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleTEifQ.eyJpYXQiOjE1MzQyNDA5NzQsImV4cCI6MTUzNDI0MTAzNCwianRpIjoiMjJjM2RjNTgtYmU2Ni00NTNjLTk0YTgtYmUwNDAwNzIwZDVmIiwiaXNzIjoiaHR0cHM6Ly9qd3QtY2xpZW50LmFuZHJlYXMubGFicy51bmluZXR0Lm5vL3lheSIsInN1YiI6Imh0dHBzOi8vand0LWNsaWVudC5hbmRyZWFzLmxhYnMudW5pbmV0dC5uby95YXkiLCJhdWQiOiJodHRwczovLzIzNy5odHRwanMubmV0LyJ9.oKoKFZhYvYlyLNpVO3bSdDTgzHU6d0CynGEqggfdnvO4JM45B2zC0PS6nILj-Tyn8TFU8LxBct5c1k5ipyCSStNZHfnapqe7jZR2QtTM-08Xh_xRca4dwKa3Txcz0rKB9fssH8xymXxSUMs_7w29RLV8qAzwjENVJa6WdFi_MZkAYQwEYcnmiOOGWHcyqvsMfnvjbQkIs1x6sJ5Pox914WoqlFoZbzcqT5jzkm1mLmX6lIL0wlesC1F4hyLitYcgNzjdti-QhWR0EWqEC5womuCGshjvTin2CaHwNP7lkls_j_IftSwo0VJnEUp_STOzy3U5DydC-TFHCt5agswxvw",
    "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
}

const jwksWebfinger = [
  {
    "kid": "key1",
    "use": "sig",
    "kty": "RSA",
    "alg": "RS256",
    "n": "pnXBOusEANuug6ewezb9J_XbxbSGEISyA75wBGkerPNg6WTXmmxJ-DV1U4sCuRqhSdo3Uncmw6-01bZKCtAyRHT_TOZN2TMfNPRsfLkOstVofyfxg5oIWViLX9IDG_iZVdq6_T6yOuufOIvqpaeBMwSKuDXHNa_DU0aUu_3kOAc5_2hD4Dq-XXtum-oix2EPkNSbFfPqFIp5n4gS1XrzGzuNQiDw82k-H6mWN0wlVWfqLxJA9DZikAX7x9feipn36wxDH-XUlzDDUi3nfnC8GSkT-CYII3oZPsIgMV527iQGVsehIV9KqTF2FnaP83cqV9YgvMfhs1wrx4L3Z-3B8Q",
    "e": "AQAB",
    "key_ops": [
      "verify"
    ],
    "ext": true

  }
]


const jwksConfigured = [
  {
    "kid": "key1",
    "kty": "RSA",
    "use": "sig",
    "alg": "RS256",
    "n": "0mdnlTk1wrnyTriAChIdmVwjauxHKg3W9Sbw8IasDyD3HkaUpAnFo4mxWpi3eiSu41FkauDOywGSJIc7TtD_boNJonvdhDft0E2UD0ok_yJn0aVHPSW5LHCZrpQ18yEbEYjoPpdCJd6iOY6itc1iT519T0kFzjxDD7hbydc_fs8Mf-6ielgs3ifjVlxKOdzQJxK1OuDW99sC2pCJnB9cF94j6Qt3XlrYrwvwUGmZ8MykbX7RcM8RFtaNnHaD11WNVlfwi3wEyCsCzZ0hmVYIusJcnA9J5-X9Xtlop9K2buW1NURNz5bo6XcdDAEV8tMc9S023sVzHY1TacXoKOTsWw",
    "e": "AQAB",
    "key_ops": [
      "verify"
    ],
    "ext": true
  }
]





let jwttxt = req.client_assertion
console.log("JWT")
console.log(jwttxt);

(async () => {

  let keystore = await jose.JWK.asKeyStore(jwksWebfinger)

  console.log("KEUSTORE")
  console.log(keystore.toJSON())

  let result = await jose.JWS.createVerify(keystore).verify(jwttxt)

  console.log(" ---- result")
  console.log(result)
})();
