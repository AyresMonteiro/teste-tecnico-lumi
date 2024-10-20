import { IInvoiceIdentifier, SupportedInvoice } from "../identifier";

export class SomeCompanyIdentifier implements IInvoiceIdentifier {
    async identify(_content: string): Promise<SupportedInvoice | null> {
        // If you want to specify which company you are scrapping data,
        // put you indetifier logic here.

        return "Some-Company-Duplicate"
    }
}
