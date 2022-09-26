const next = require('next');
const Hapi = require('@hapi/hapi');
const urlModule = require('url');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const server = new Hapi.Server({
  port,
});

const nextHandlerWrapper = (app) => {
  const handler = app.getRequestHandler();
  return async ({ raw, url, query }, h) => {
    url.query = query;

    await handler(raw.req, raw.res, urlModule.parse(raw.req.url, true));
    return h.close;
  };
};

async function main() {
  await app.prepare();

  server.decorate(
    'handler',
    'next',
    (route, routeOptions) => async (request, h) => {
      const { raw, query, params } = request;

      const html = await app.renderToHTML(
        raw.req,
        raw.res,
        routeOptions.page,
        { ...query, ...params },
        {}
      );

      if (raw.res.finished || raw.res.headersSent) {
        return h.close;
      }

      return h.response(html).code(raw.res.statusCode);
    }
  );
  
  server.route({
    method: 'GET',
    path: '/_next/{p*}' /* next specific routes */,
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: '*',
    path: '/{p*}' /* catch all route */,
    handler: nextHandlerWrapper(app),
  });

  server.route({
    method: 'GET',
    path: '/',
    options: {
      handler: {
        next: {
          page: '/',
        },
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/test/{id}',
    options: {
      handler: {
        next: {
          page: '/test/[id]',
        },
      },
    },
  });

  try {
    await server.start();
    console.log(`> Ready on http://localhost:${port}`);
  } catch (error) {
    console.log('Error starting server');
    console.log(error);
  }
}

main();
