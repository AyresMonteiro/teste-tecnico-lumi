import { FastifyReply, FastifyRequest } from "fastify"
import { AbstractRoute } from "./abstract-route"

const homePath = "/"

const homeHandler = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return { success: true };
}

export const homeRoute: AbstractRoute<unknown, {}> = {
    path: homePath,
    method: "GET",
    validationSchema: {},
    handler: homeHandler,
}
