import tap from 'tap';

import { FastifyApp } from '../../../src/http/fastify';
import { defaultRoutes } from '../../../src/http/fastify/routes';

tap.test(`Class FastifyApp - Should mount app`, t => {
    t.plan(1);

    new FastifyApp(defaultRoutes);

    t.pass("Mounted");
})

tap.test(`Class FastifyApp - Should not mount unsupported route`, t => {
    t.plan(1);

    const shouldThrow = async () => {
        new FastifyApp([{
            handler: async (_req, _reply) => { },
            method: "UNSUPPORTED" as any,
            path: "/inexistent",
            validationSchema: {}
        }]);
    }

    shouldThrow().then(() => t.fail()).catch(() => t.pass("Error thrown"))
})
