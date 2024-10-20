import { FastifyReply, FastifyRequest } from "fastify"
import { AbstractRoute } from "./abstract-route"
import { PdfReaderLib } from "../../../pdf/readers/pdfreader-lib"
import { createDefaultInterpreterProxy } from "../../../invoice/interpreters"

const invoiceSubmitPath = "/invoice/submit"

const invoiceFileValidationSchema = {
    schema: {
        consumes: ['multipart/form-data'],
        body: {
            type: 'object',
            required: ['invoice_file'],
            properties: {
                invoice_file: {
                    type: 'object',
                },
            },
            additionalProperties: false,
        }
    }
}

type TInvoiceSubmitError = {
    success: boolean;
    message: string;
}

type TInvoiceSubmitSuccess = {
    success: boolean;
    data: Object;
}

type TInvoiceSubmitResponse = TInvoiceSubmitSuccess | TInvoiceSubmitError;

const invoiceSubmitHandler = async (request: FastifyRequest, reply: FastifyReply): Promise<TInvoiceSubmitResponse> => {
    type BodyType = { invoice_file: Buffer };

    const body = request.body as BodyType;

    const buffer = body.invoice_file;

    const pdfReader = new PdfReaderLib();

    const content = await pdfReader.read(buffer);

    const interpreterProxy = createDefaultInterpreterProxy();

    const data = await interpreterProxy.extract(content);

    return { success: true, data };
}

export const invoiceSubmitRoute: AbstractRoute<TInvoiceSubmitResponse, typeof invoiceFileValidationSchema> = {
    path: invoiceSubmitPath,
    method: "POST",
    validationSchema: invoiceFileValidationSchema,
    handler: invoiceSubmitHandler,
}
