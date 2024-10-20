import Fastify, { FastifyInstance } from 'fastify';
import FastifyMultipartPlugin from '@fastify/multipart'
import FastifyCorsPlugin from '@fastify/cors'

import { AbstractRoute } from "./routes/abstract-route";

export class FastifyApp {
    public fastify: FastifyInstance;

    constructor(private readonly routes: AbstractRoute<any, any>[]) {
        this.fastify = Fastify({
            logger: true
        })

        this.applyMiddlewares();

        this.mountRoutes();
    }


    applyMiddlewares() {
        this.fastify.register(FastifyMultipartPlugin, { attachFieldsToBody: 'keyValues' })
        this.fastify.register(FastifyCorsPlugin, { })
    }

    mountRoutes() {
        const context = this.fastify;

        const mountMethods: Record<AbstractRoute<any, any>["method"], Function> = {
            "DELETE": context.delete.bind(context),
            "GET": context.get.bind(context),
            "OPTIONS": context.options.bind(context),
            "PATCH": context.patch.bind(context),
            "POST": context.post.bind(context),
        };

        this.routes.forEach((route) => {
            const mountMethod = mountMethods[route.method];

            if (!mountMethod) throw new Error("Didn't find mount method for: " + route.method);

            mountMethod(route.path, route.validationSchema, route.handler);
        })
    }

    /* c8 ignore start */
    listen(port: number) {
        this.fastify.listen({ port }).catch(e => {
            this.fastify.log.error(e)
            process.exit(1);
        })
    }
    /* c8 ignore stop */
}
