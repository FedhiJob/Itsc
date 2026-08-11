import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body);
    }

    if (schemas.params) {
      Object.defineProperty(request, "params", {
        value: schemas.params.parse(request.params),
        writable: true,
        configurable: true,
        enumerable: true
      });
    }

    if (schemas.query) {
      // Express 5 defines `req.query` as a getter-only property on the
      // prototype, so direct assignment throws in strict-mode ESM. Shadow it
      // with an own property instead.
      Object.defineProperty(request, "query", {
        value: schemas.query.parse(request.query),
        writable: true,
        configurable: true,
        enumerable: true
      });
    }

    next();
  };
}
