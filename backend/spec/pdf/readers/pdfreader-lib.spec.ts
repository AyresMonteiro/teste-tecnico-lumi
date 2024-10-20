import fs from 'node:fs'
import path from 'node:path'

import tap from 'tap';

import { PdfReaderLib } from '../../../src/pdf/readers/pdfreader-lib';
import { mocksDir } from '../../utils/dirnames';

tap.test(`Class - PdfReaderLib - success case`, t => {
    t.plan(3);

    const filepath = path.resolve(mocksDir(), "pdf", "invoices", "success_invoice.pdf");

    const buffer = fs.readFileSync(filepath);

    const instance = new PdfReaderLib();

    instance.read(buffer).then(data => {
        t.equal(typeof data, "string");
        t.strictNotSame(data?.length || 0, 0);
        t.pass("Data read successfully");
    }).catch(e => {
        t.fail();
    })
})

tap.test(`Class - PdfReaderLib - fail case`, t => {
    t.plan(1);

    const buffer = Buffer.from("abc");

    const instance = new PdfReaderLib();

    instance.read(buffer).then(() => {
        t.fail();
    }).catch(_e => {
        t.pass("Failed as expected");
    })
})
