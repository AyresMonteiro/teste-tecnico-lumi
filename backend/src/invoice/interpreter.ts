export interface IInvoiceInterpreter<T extends Object> {
    /**
     * This method should analyze content and figure out what does is meaning
     * data then return it.
     */
    extract(content: string): Promise<Record<string, string | number | T>>;
}
