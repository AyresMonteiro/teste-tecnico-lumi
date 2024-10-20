import { FastifyReply, FastifyRequest } from "fastify";

export interface AbstractRoute<T extends any, V extends Object> {
    path: string,
    method: "GET" | "POST" | "OPTIONS" | "PATCH" | "DELETE";
    handler: (request: FastifyRequest, reply: FastifyReply) => Promise<T>;
    validationSchema: V;
}
