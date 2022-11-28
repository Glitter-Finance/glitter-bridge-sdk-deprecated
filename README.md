# glitter-bridge-sdk


-----------------------------------------------------------------------------
# 2| Dockerize

Start Docker (HOST):
```
docker-compose run --rm glitter sh
```

Setup Docker (DOCKER)  
*Password is github access token for approved vault accounts*
```
source scripts/local/docker/launch.sh
```

-----------------------------------------------------------------------------

npx ts-node tests/bridgeTestVaultWallets

//Clean package
docker-compose down -v

//Git commit
npx cz
