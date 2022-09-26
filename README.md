# Custom server using Hapi example

Example to reproduce bug in Next >= 12.1.0 and `useFileSystemPublicRoutes` is disabled (See #40759), it will run on http://localhost:3000

```
npm install 
```

## How to reproduce it

It works in dev mode, Next is able to reach the dynamic path trough the index link

```
npm run dev
```

But when you run it in production mode, Next response with 404 the dynamic path

```
npm run build
npm start
```
