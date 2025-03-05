# Control - An oAuth2 Server

This is a custom oAuth2 server. Follow the instructions below to run it.

## Option 1: Using Docker (Recommended)

```bash
docker build --tag control .
```

```bash
docker run --env COOKIE_SECRET=abcdefghijklmnopqrstuvwxyz0123456789 --env SESSION_SECRET=abcdefghijklmnopqrstuvwxyz0123456789 --env JWT_SECRET=abcdefghijklmnopqrstuvwxyz0123456789 --publish 2875:2875 --name control control
```

Then open the [entrypoint](./tasks/entrypoint.http) file and visit the URL.

> When you're done, run the following command:
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

## Option 2: Using local Node.js runtime

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
