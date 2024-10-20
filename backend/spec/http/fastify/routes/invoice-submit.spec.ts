import fs from 'node:fs';
import path from 'node:path';

import tap from 'tap';
import formAutoContent from 'form-auto-content'

import { FastifyApp } from "../../../../src/http/fastify";
import { invoiceSubmitRoute } from "../../../../src/http/fastify/routes/invoice-submit";
import { mocksDir } from '../../../utils/dirnames';

tap.test(`${invoiceSubmitRoute.method} ${invoiceSubmitRoute.path}`, t => {
    t.plan(3);

    const fastifyApp = new FastifyApp([invoiceSubmitRoute])

    t.teardown(() => fastifyApp.fastify.close())

    const filepath = path.resolve(mocksDir(), "pdf", "invoices", "success_invoice.pdf");

    const form = formAutoContent({
        invoice_file: fs.createReadStream(filepath)
    })

    fastifyApp.fastify.inject({
        method: invoiceSubmitRoute.method,
        url: invoiceSubmitRoute.path,
        ...form
    }, (err, response) => {
        t.error(err);
        t.strictSame(response?.statusCode, 200);

        const responseJson = response?.body.toString() ?? ""
        const responseData = JSON.parse(responseJson)

        if (responseData?.data?.invoiceNumber) t.pass("Parse completed");
    })
})
