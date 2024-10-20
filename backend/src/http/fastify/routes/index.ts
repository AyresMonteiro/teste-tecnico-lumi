import { AbstractRoute } from "./abstract-route";
import { homeRoute } from "./home";
import { invoiceSubmitRoute } from "./invoice-submit";

export const defaultRoutes: AbstractRoute<any, any>[] = [
    homeRoute,
    invoiceSubmitRoute,
]
