/**
 * @type SupportedInvoice
 * 
 * This type is used to describe the invoice content types supported by the
 * application.
 *
 * "Some-Company-Duplicate": Indicates a invoice of "Some Company" (not a real
 * company) that has no value as Residency Verification Document.
 */
export type SupportedInvoice = "Some-Company-Duplicate"

export interface IInvoiceIdentifier {
    /**
     * This method should analyze content and return his type in order to be
     * properly interpreted later.
     * @param content 
     */
    identify(content: string): Promise<SupportedInvoice | null>
}
