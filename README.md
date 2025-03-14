# Control - An oAuth2 Server

This is a custom oAuth2 server. Follow the instructions below to run it.

## Option 1: Using Docker (Recommended)

First, make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed on your system. Then run the following commands one-by-one:

```bash
docker build --tag control .
```

```bash
docker run --env COOKIE_SECRET=abcdefghijklmnopqrstuvwxyz0123456789 --env SESSION_SECRET=abcdefghijklmnopqrstuvwxyz0123456789 --env JWT_SECRET=abcdefghijklmnopqrstuvwxyz0123456789 --publish 2875:2875 --name control control
```

Then send HTTP request to the `/authorize` endpoint as shown [here](./tasks/1.authorize.http). Then use the other numbered endpoints.

> When you're done, run the following commands:
>
> ```bash
> docker stop control
> ```
>
> ```bash
> docker rm control
> ```
>
> ```bash
> docker rmi control
> ```
>
> Optionally, you may run `docker system prune` to remove all the build cache objects and other resources.

## Option 2: Using local Node.js runtime

If you have [Node.js](https://nodejs.org/en/download) installed on your system, run the following commands one-by-one:

```bash
npm i
```

```bash
npm run build
```

```bash
npm run knex migrate:latest
```

```bash
npm run knex seed:run
```

```bash
npm start
```

Then follow the same procedure described in the 1st option.
