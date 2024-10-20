import fs from 'node:fs'
import path from 'node:path'

import tap, { Test } from 'tap';

import { SomeCompanyInterpreter } from '../../../src/invoice/interpreters/some-company-interpreter';
import { PdfReaderLib } from '../../../src/pdf/readers/pdfreader-lib';
import { mocksDir } from '../../utils/dirnames';

const baseTest = (
    filename: string,
    totalAsserts: number,
    handler: (t: Test) => (data: Record<string, string | number | Object>) => void,
    failHandler: (t: Test) => (e: unknown) => void
) => (t: Test) => {
    t.plan(totalAsserts);

    const instance = new SomeCompanyInterpreter();

    const pdfReader = new PdfReaderLib();

    const filepath = path.resolve(mocksDir(), "pdf", "invoices", filename);

    const buffer = fs.readFileSync(filepath);

    pdfReader.read(buffer)
        .then(instance.extract.bind(instance))
        .then(handler(t))
        .catch(failHandler(t));
}

tap.test(`Class - SomeCompanyIdentifier - success case`, baseTest(
    "success_invoice.pdf",
    2,
    (t) => (data) => {
        t.strictSame(typeof data, "object");
        t.pass("Successfully extracted data");
    },
    (t) => (_e: unknown) => t.fail())
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice number`, baseTest(
    "fail_invoice_number.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice number/gi.test((e as Error).message), true);
        t.pass("Invoice number not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice series`, baseTest(
    "fail_invoice_series.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice series/gi.test((e as Error).message), true);
        t.pass("Invoice series not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice billing date`, baseTest(
    "fail_invoice_billing_date.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice billing date/gi.test((e as Error).message), true);
        t.pass("Invoice billing date not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice value`, baseTest(
    "fail_invoice_value.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice value/gi.test((e as Error).message), true);
        t.pass("Invoice value not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice customer number`, baseTest(
    "fail_invoice_customer_number.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice customer number/gi.test((e as Error).message), true);
        t.pass("Invoice customer number not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice supply installation number`, baseTest(
    "fail_invoice_supply_installation_number.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice supply installation number/gi.test((e as Error).message), true);
        t.pass("Invoice supply installation number not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice reference month`, baseTest(
    "fail_invoice_reference_month.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice reference month/gi.test((e as Error).message), true);
        t.pass("Invoice reference month not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice due date`, baseTest(
    "fail_invoice_due_date.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice due date/gi.test((e as Error).message), true);
        t.pass("Invoice due date not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice energy consumption`, baseTest(
    "fail_invoice_energy_consumption_history.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/past energy consumption/gi.test((e as Error).message), true);
        t.pass("Invoice's past energy consumption not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: invoice items`, baseTest(
    "fail_invoice_items.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice items/gi.test((e as Error).message), true);
        t.pass("Invoice items were not found!")
    })
)

tap.test(`Class - SomeCompanyIdentifier - fail: automatic debt code`, baseTest(
    "fail_invoice_automatic_debt_code.pdf",
    2,
    (t) => (_data) => t.fail(),
    (t) => (e: unknown) => {
        t.strictSame(/invoice automatic debt code/gi.test((e as Error).message), true);
        t.pass("Invoice automatic debt code not found!")
    })
)
