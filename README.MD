# Starter kit

## Postgres docker

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=starter_kit -p 5432:5432 -d postgres
```

## Prisma

### Create and apply migrations

```bash
npx prisma migrate dev --name init
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Only create migrations

```bash
npx prisma migrate dev --create-only
```

### Seed database

```bash
npx prisma db seed
```

## Docker

```bash
docker build -t starter-kit .
```

## Run docker container

```bash
docker run -e DATABASE_URL='' -p 3001:3001 starter-kit
```

## SSH into container name

```bash
docker exec -it <container> bash
```

## JWT

```bash
#Generate a secret key
openssl rand -base64 32
```
