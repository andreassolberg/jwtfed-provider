# JWT Federation OpenID Connect provider


Proof of concept demo of OpenID Connect Federation provider.


```
DEBUG=oidc-provider:* ISSUER="https://jwt-idp.andreas.labs.uninett.no/"  SECURE_KEY=10487076-0d97-44a6,8999-2818cb5038aa npm start
```



## Update kubernets cnofig

```
kubectl delete deployment jwtserver-provider
kubectl delete service jwtserver-provider
kubectl apply -f deployment.yaml
```

```
kubectl delete deployment jwtserver-provider
kubectl apply -f deployment.yaml
```

## Local build process

To test the docker build:

```
docker build -t jwtfedprovider .
```
