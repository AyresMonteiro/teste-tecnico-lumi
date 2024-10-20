import fs from 'node:fs'
import path from 'node:path'

import tap, { Test } from 'tap';

import { PdfReaderLib } from '../../../src/pdf/readers/pdfreader-lib';
import { mocksDir } from '../../utils/dirnames';
import { SomeCompanyIdentifier } from '../../../src/invoice/identifiers/some-company-identifier';
import { InterpreterProxy } from '../../../src/invoice/interpreters/interpreter-proxy';
import { createDefaultInterpreterProxy } from '../../../src/invoice/interpreters';
import { IInvoiceIdentifier, SupportedInvoice } from '../../../src/invoice/identifier';

const baseTest = (
    instance: InterpreterProxy<Object>,
    totalAsserts: number,
    handler: (t: Test) => (data: Record<string, string | number | Object>) => void,
    failHandler: (t: Test) => (e: unknown) => void
) => (t: Test) => {
    t.plan(totalAsserts);

    const pdfReader = new PdfReaderLib();

    const filepath = path.resolve(mocksDir(), "pdf", "invoices", "success_invoice.pdf");

    const buffer = fs.readFileSync(filepath);

    pdfReader.read(buffer)
        .then(instance.extract.bind(instance))
        .then(handler(t))
        .catch(failHandler(t));
}

tap.test(`Class - SomeCompanyIdentifier - success case`, baseTest(
    createDefaultInterpreterProxy(),
    2,
    (t) => (data) => {
        t.strictSame(typeof data, "object");
        t.pass("Successfully extracted data");
    },
    (t) => (_e: unknown) => t.fail())
)

tap.test(`Class - SomeCompanyIdentifier - fail: no identifier`, baseTest(
    new InterpreterProxy([], {} as any),
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/no identifier/gi.test((e as Error).message), true);
        t.pass("No identifier registered!")
    })
)

class IdentifierMock implements IInvoiceIdentifier {
    constructor(private readonly value: string | null = null) { }

    async identify(_content: string): Promise<SupportedInvoice | null> {
        return this.value as SupportedInvoice | null;
    }
}

tap.test(`Class - SomeCompanyIdentifier - fail: couldn't identify content`, baseTest(
    new InterpreterProxy([new IdentifierMock()], {} as any),
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/couldn't identify/gi.test((e as Error).message), true);
        t.pass("couldn't identify content!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: no interpreter`, baseTest(
    new InterpreterProxy([
        new SomeCompanyIdentifier(),
        new IdentifierMock("trash_value")
    ], {} as any),
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/no interpreter/gi.test((e as Error).message), true);
        t.pass("No interpreter registered!")
    })
)
