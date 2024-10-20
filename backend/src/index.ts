import { FastifyApp } from "./http/fastify";
import { defaultRoutes } from "./http/fastify/routes";

const fastifyApp = new FastifyApp(defaultRoutes)

fastifyApp.listen(5000);
