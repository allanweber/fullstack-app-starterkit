# Starter kit

## Doccker

```bash
docker build -t starter-kit .
```

```bash
docker run -e DATABASE_URL='' -e DATABASE_AUTH_TOKEN='' -p 3001:3001 starter-kit
```

## SSH into container name

```bash
docker exec -it c4838cb95eec /bin/bash
```
