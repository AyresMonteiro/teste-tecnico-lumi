import { FastifyApp } from './http/fastify'
import { defaultRoutes } from './http/fastify/routes'

const fastifyApp = new FastifyApp(defaultRoutes);

export default async function handler(req: any, res: any) {
    await fastifyApp.fastify.ready();

    fastifyApp.fastify.server.emit('request', req, res);
}
