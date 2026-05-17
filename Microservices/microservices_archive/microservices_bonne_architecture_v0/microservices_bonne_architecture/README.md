# Microservices refactorisés

Cette archive contient une version réorganisée de l'application avec :

- middleware JWT isolé dans `shared/middlewares/isAuthenticated.js`
- configuration JWT centralisée dans `shared/config/jwtConfig.js`
- génération de token mutualisée dans `shared/utils/generateToken.js`
- protection réactivée sur les routes sensibles de `produit-service` et `commande-service`

## Structure

```text
microservices/
  shared/
    config/
      jwtConfig.js
    middlewares/
      isAuthenticated.js
    utils/
      generateToken.js
  auth-service/
  produit-service/
  commande-service/
```

```

## Exemple `.env`

Chaque service peut avoir un `.env` similaire :

```env
JWT_SECRET=dev_secret_change_me
JWT_EXPIRES_IN=1h
AUTH_DB_URI=mongodb://127.0.0.1:27017/auth-service
PRODUIT_DB_URI=mongodb://127.0.0.1:27017/produit-service
COMMANDE_DB_URI=mongodb://127.0.0.1:27017/commande-service
PORT=4000
```
