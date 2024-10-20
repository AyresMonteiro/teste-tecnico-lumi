import tap from 'tap';

import { SomeCompanyIdentifier } from '../../../src/invoice/identifiers/some-company-identifier';

tap.test(`Class - SomeCompanyIdentifier`, t => {
    t.plan(2);

    const instance = new SomeCompanyIdentifier();

    instance.identify("").then((identified) => {
        t.strictSame(identified, "Some-Company-Duplicate");
        t.pass("Always return the identified value");
    })
})
