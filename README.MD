# Starter kit

## Doccker

```bash
docker build -t starter-kit --build-arg DATABASE_URL='libsql://fullstack-app-starterkit-allanweber.turso.io' --build-arg DATABASE_AUTH_TOKEN='eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjM2MzYzMDgsImlkIjoiNjUzYzkyYTctNjhmYS00ZjUwLWE2YTctNWIzMDczNmQ3ZGFiIn0.AYVoYDb-e2FPzb2SY69Q2LotPW-jlOq_Os8nF-F1qy0xLp4LrtxZCOS8m2KofWWXheqYXFLrQ6SqboWZDIYCCg' .
```

```bash
docker run -e DATABASE_URL='libsql://fullstack-app-starterkit-allanweber.turso.io' -e DATABASE_AUTH_TOKEN='eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MjM2MzYzMDgsImlkIjoiNjUzYzkyYTctNjhmYS00ZjUwLWE2YTctNWIzMDczNmQ3ZGFiIn0.AYVoYDb-e2FPzb2SY69Q2LotPW-jlOq_Os8nF-F1qy0xLp4LrtxZCOS8m2KofWWXheqYXFLrQ6SqboWZDIYCCg' -p 3001:3001 starter-kit
```

## SSH into container name

```bash
docker exec -it c4838cb95eec /bin/bash
```
