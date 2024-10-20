import { IInvoiceInterpreter } from "../interpreter";

export class SomeCompanyInterpreter implements IInvoiceInterpreter<Object> {
    async extract(content: string): Promise<Record<string, string | number | Object>> {
        const invoiceNumber = this.extractInvoiceNumber(content);
        const invoiceSeries = this.extractInvoiceSeries(content);
        const invoiceBillingDate = this.extractInvoiceBillingDate(content);
        const invoiceItems = this.extractInvoiceItems(content);
        const invoiceValue = this.extractInvoiceValue(content);
        const invoiceCustomerNumber = this.extractInvoiceCustomerNumber(content);
        const invoiceSupplyInstallationNumber = this.extractInvoiceSupplyInstallationNumber(content);
        const invoiceReferenceMonth = this.extractInvoiceReferenceMonth(content);
        const invoicePaymentDueDate = this.extractInvoicePaymentDueDate(content);
        const invoiceAutomaticDebtCode = this.extractInvoiceAutomaticDebtCode(content);

        const energyConsumptionByMonths = this.extractEnergyConsumptionByMonths(content);

        return {
            invoiceNumber,
            invoiceSeries,
            invoiceBillingDate,
            invoiceValue,
            invoiceCustomerNumber,
            invoiceSupplyInstallationNumber,
            invoiceReferenceMonth,
            invoicePaymentDueDate,
            energyConsumptionByMonths,
            invoiceItems,
            invoiceAutomaticDebtCode,
        }
    }

    extractInvoiceNumber(content: string): string {
        const match = Array.from(content.matchAll(/NOTA FISCAL Nº (\d+)/g))

        if (!match || !match.length) throw new Error("Invoice number not found!");

        return match[0][1];
    }

    extractInvoiceSeries(content: string): string {
        const match = Array.from(content.matchAll(/SÉRIE (\d+)/g))

        if (!match || !match.length) throw new Error("Invoice series not found!");

        return match[0][1];
    }

    extractInvoiceBillingDate(content: string): string {
        const match = Array.from(content.matchAll(/Data de emissão: (\d{2}\/\d{2}\/\d{4})/g))

        if (!match || !match.length) throw new Error("Invoice billing date not found!");

        return match[0][1];
    }

    extractInvoiceValue(content: string): string {
        const match = Array.from(content.matchAll(/TOTAL\s+([\d\.]+,\d+)/g))

        if (!match || !match.length) throw new Error("Invoice value not found!");

        return match[0][1];
    }

    extractInvoiceCustomerNumber(content: string): string {
        const match = Array.from(content.matchAll(/Nº DO CLIENTE\s+Nº DA \s*INSTALAÇÃO\s+(\d+)/g))

        if (!match || !match.length) throw new Error("Invoice customer number not found!");

        return match[0][1];
    }

    extractInvoiceSupplyInstallationNumber(content: string): string {
        const match = Array.from(content.matchAll(/Nº DO CLIENTE\s+Nº DA \s*INSTALAÇÃO\s+\d+\s+(\d+)/g))

        if (!match || !match.length) throw new Error("Invoice supply installation number not found!");

        return match[0][1];
    }

    extractInvoiceReferenceMonth(content: string): string {
        const match = Array.from(content.matchAll(/Referente\s*a\s+Vencimento\s+Valor\s*a\s*pagar\s*\(R\$\)\s+([A-Z]{3}\/\d{4})/g))

        if (!match || !match.length) throw new Error("Invoice reference month not found!");

        return match[0][1];
    }

    extractInvoicePaymentDueDate(content: string): string {
        const match = Array.from(content.matchAll(/Referente\s*a\s+Vencimento\s+Valor\s*a\s*pagar\s*\(R\$\)\s+[A-Z]{3}\/\d{4}\s+(\d{2}\/\d{2}\/\d{4})/g))

        if (!match || !match.length) throw new Error("Invoice due date number not found!");

        return match[0][1];
    }

    extractEnergyConsumptionByMonths(content: string): Object {
        const baseRegex = /MÊS\/ANO\s+Cons. kWh\s+Média kWh\/Dia\s+Dias((\s*[A-Z]{3}\/\d{2}\s+[\d\.]+\s+[\d\.]+\,\d{2}\s+[\d\.]+)+)/g

        const match = Array.from(content.matchAll(baseRegex))

        if (!match || !match.length) throw new Error("Past energy consumption data not found!");

        const innerRgex = /(\s*[A-Z]{3}\/\d{2}\s+[\d\.]+\s+[\d\.]+\,\d{2}\s+[\d\.]+)/g

        const months = Array.from(match[0][1].matchAll(innerRgex))

        const results = months.map(monthMatch => {
            return monthMatch[0].trim().split("\n").map(piece => piece.trim());
        }).reduce((prev, [key, total, average, period]) => {
            return {
                ...prev,
                [key]: {
                    total: Number(total),
                    average: Number(average.replace(/\./g, "").replace(",", ".")),
                    period: Number(period)
                }
            }
        }, {})

        return results;
    }

    extractInvoiceItems(content: string) {
        let baseRegex = /Itens da Fatura\s+Unid\.\s+Quant\.\s+Preço Unit\s+Valor\s+ \(R\$\)\s+ PIS\/COFINS\s+Base Calc\.\s+Aliq\.\s+ICMS\s+Tarifa Unit\.\s+ICMS\s+ICMS\s+(\s*([a-zA-Z\u00E0-\u00FC\u00AA\u00AE\/\.] ?)+\s+([a-zA-Z\u00E0-\u00FC\u00AA\u00AE\/\.] ?)*(\s+[\d\.]+)?(\s+[\d\.]+\,\d+)?\s+-?[\d\.]+\,\d+(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?)+/g

        const match = Array.from(content.matchAll(baseRegex));

        if (!match || !match.length) throw new Error("Invoice items were not found!");

        const innerRegex = /\s*([a-zA-Z\u00E0-\u00FC\u00AA\u00AE\/\.] ?)+\s+([a-zA-Z\u00E0-\u00FC\u00AA\u00AE\/\.] ?)*(\s+[\d\.]+)?(\s+[\d\.]+\,\d+)?\s+-?[\d\.]+\,\d+(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?(\s+[\d\.]+\,\d+)?/g;

        const results = Array.from(match[0][0].matchAll(innerRegex))
            .map(result => result[0])
            .map(row => row.split("\n").map(column => column.trim()).filter(v => !!v))
            .map(([name, ...values]) => ({ name, values }))
            .reduce((prev, { name, values }) => ({
                ...prev,
                [name.toUpperCase()]: values
            }), {}) as Record<string, string[]>

        const baseEnergyConsumptionKey = "Energia Elétrica".toUpperCase()
        const generatedEnergyConsumptionKey = "Energia SCEE s/ ICMS".toUpperCase()
        const energyLoanKey = "Energia compensada GD I".toUpperCase()
        const publicLightsTaxKey = "Contrib Ilum Publica Municipal".toUpperCase()

        const baseEnergyConsumption = Number(results[baseEnergyConsumptionKey][1])
        const generatedEnergyConsumption = Number(results[generatedEnergyConsumptionKey][1])
        const energyLoan = Number(results[energyLoanKey][1])

        const baseEnergyValue = Number(results[baseEnergyConsumptionKey][3].replace(/\./g, "").replace(/\,/g, "."))
        const generatedEnergyValue = Number(results[generatedEnergyConsumptionKey][3].replace(/\./g, "").replace(/\,/g, "."))
        const publicLightsTax = Number(results[publicLightsTaxKey][0].replace(/\./g, "").replace(/\,/g, "."))
        const energyLoanDeduction = Number(results[energyLoanKey][3].replace(/\./g, "").replace(/\,/g, "."))

        return {
            baseEnergyConsumption,
            generatedEnergyConsumption,
            energyLoan,
            totalEnergyConsumption: baseEnergyConsumption + generatedEnergyConsumption,
            baseEnergyValue,
            generatedEnergyValue,
            publicLightsTax,
            energyLoanDeduction,
            totalEnergyValue: baseEnergyValue + generatedEnergyValue + publicLightsTax
        }
    }

    extractInvoiceAutomaticDebtCode(content: string): string {
        const match = Array.from(content.matchAll(/Código de Débito Automático\s+Instalação\s+Vencimento\s+Total a pagar\s+(\d+)/g))

        if (!match || !match.length) throw new Error("Invoice automatic debt code not found!");

        return match[0][1];
    }
}
