export interface Invoice {
    invoiceNumber: string;
    invoiceSeries: string;
    invoiceBillingDate: string;
    invoiceValue: string;
    invoiceCustomerNumber: string;
    invoiceSupplyInstallationNumber: string;
    invoiceReferenceMonth: string;
    invoicePaymentDueDate: string;
    energyConsumptionByMonths: {
        [month: string]: {
            total: number;
            average: number;
            period: number;
        };
    };
    invoiceItems: {
        baseEnergyConsumption: number;
        generatedEnergyConsumption: number;
        energyLoan: number;
        totalEnergyConsumption: number;
        baseEnergyValue: number;
        generatedEnergyValue: number;
        publicLightsTax: number;
        energyLoanDeduction: number;
        totalEnergyValue: number;
    };
    invoiceAutomaticDebtCode: string;
}
