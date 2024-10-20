import { AbstractRoute } from "./abstract-route";
import { invoiceSubmitRoute } from "./invoice-submit";

export const defaultRoutes: AbstractRoute<any, any>[] = [
    invoiceSubmitRoute,
]
