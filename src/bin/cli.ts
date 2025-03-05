#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const fastify = require("fastify")();
// const fastifyStatic = require("@fastify/static");
const next = require("next");

const PORT = process.env.PORT || 3000;
const packageLockJsonPath = path.join(process.cwd(), "package-lock.json");

const app = next({ dev: false });
const handle = app.getRequestHandler();

async function startServer() {
  const { default: getPort } = await import("get-port");

  const port = await getPort({ port: PORT });

  await app.prepare();

  //   fastify.register(fastifyStatic, {
  //     root: path.join(__dirname, "..", "public", "static"),
  //     prefix: "/static/",
  //   });

  fastify.route({
    method: "GET",
    url: "/package-lock.json",
    handler: async (req, reply) => {
      reply.sendFile(packageLockJsonPath);
    },
  });

  fastify.all("/*", (req, reply) => {
    reply.hijack();

    handle(req.raw, reply.raw)
      .then(() => {
        reply.raw.end();
      })
      .catch((err) => {
        fastify.log.error(err);
        reply.raw.writeHead(500);
        reply.raw.end("Internal Server Error");
      });
  });

  await fastify.listen({ port });

  const { default: open } = await import("open");

  fastify.log.info(`Server listening on http://localhost:${port}`);

  await open(`http://localhost:${port}`);
}

startServer();
