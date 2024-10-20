import { IInvoiceIdentifier, SupportedInvoice } from "../identifier";
import { IInvoiceInterpreter } from "../interpreter";

export class InterpreterProxy<T extends Object> implements IInvoiceInterpreter<T> {
    constructor(
        private readonly identifiers: IInvoiceIdentifier[],
        private readonly interpreters: Record<SupportedInvoice, IInvoiceInterpreter<T>>
    ) { }

    async extract(content: string): Promise<Record<string, string | number | T>> {
        if (!this.identifiers.length) throw new Error("No identifier registered!");

        const identifiedTypes: SupportedInvoice[] = (await Promise.all(this.identifiers.map(idr => idr.identify(content)))).filter(v => v !== null)

        const invoiceType = identifiedTypes.reduce((prev, curr) => {
            if (prev !== null) {
                return prev;
            }

            return curr;
        }, null as SupportedInvoice | null)

        if (!invoiceType) throw new Error("Couldn't identify invoice type");

        const interpreter = this.interpreters[invoiceType]

        if (!interpreter) throw new Error(`No interpreter registered for "${invoiceType}" invoice type!`)

        return interpreter.extract(content);
    }
}
