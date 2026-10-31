import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "../src/modules/auth/auth.middleware.js";
import { authService } from "../src/modules/auth/auth.service.js";

// Helper to create mock Express request/response objects
function createMockContext(headers: Record<string, string> = {}, admin?: { id: string; role: string }) {
  const req = {
    headers,
    admin
  } as unknown as Request;

  let statusCode = 200;
  let responseBody: any = null;

  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(body: any) {
      responseBody = body;
      return res;
    }
  } as unknown as Response;

  let nextCalled = false;
  const next: NextFunction = () => {
    nextCalled = true;
  };

  return {
    req,
    res,
    next,
    getStatusCode: () => statusCode,
    getBody: () => responseBody,
    isNextCalled: () => nextCalled
  };
}

describe("Authentication & RBAC Middleware", () => {
  it("rejects unauthenticated requests with 401", () => {
    const ctx = createMockContext();
    authenticate(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), false, "next() should not be called when unauthenticated");
    assert.equal(ctx.getStatusCode(), 401, "Status code should be 401");
    assert.equal(ctx.getBody().success, false);
    assert.equal(ctx.getBody().errors[0].code, "AUTH_005");
  });

  it("rejects malformed authorization header with 401", () => {
    const ctx = createMockContext({ authorization: "Basic 12345" });
    authenticate(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), false);
    assert.equal(ctx.getStatusCode(), 401);
  });

  it("rejects invalid/expired JWT token with 401", () => {
    const ctx = createMockContext({ authorization: "Bearer invalid.fake.token" });
    authenticate(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), false);
    assert.equal(ctx.getStatusCode(), 401);
    assert.equal(ctx.getBody().errors[0].code, "AUTH_004");
  });

  it("authenticates valid token and populates request.admin", () => {
    const token = authService.signToken({ sub: "admin-123", role: "ADMIN" });
    const ctx = createMockContext({ authorization: `Bearer ${token}` });

    authenticate(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), true, "next() should be called for valid token");
    assert.deepEqual(ctx.req.admin, { id: "admin-123", role: "ADMIN" });
  });

  it("denies access with 403 when role is ADMIN but SUPER_ADMIN is required", () => {
    const ctx = createMockContext({}, { id: "admin-123", role: "ADMIN" });
    const superAdminGuard = authorize("SUPER_ADMIN");

    superAdminGuard(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), false, "ADMIN must NOT access SUPER_ADMIN endpoint");
    assert.equal(ctx.getStatusCode(), 403, "Status code must be 403 Forbidden");
    assert.equal(ctx.getBody().errors[0].code, "AUTH_006");
  });

  it("denies access with 403 when role is VIEWER or CONTENT_EDITOR", () => {
    const ctx = createMockContext({}, { id: "editor-456", role: "CONTENT_EDITOR" });
    const superAdminGuard = authorize("SUPER_ADMIN");

    superAdminGuard(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), false);
    assert.equal(ctx.getStatusCode(), 403);
    assert.equal(ctx.getBody().errors[0].code, "AUTH_006");
  });

  it("allows access when role is SUPER_ADMIN", () => {
    const ctx = createMockContext({}, { id: "super-999", role: "SUPER_ADMIN" });
    const superAdminGuard = authorize("SUPER_ADMIN");

    superAdminGuard(ctx.req, ctx.res, ctx.next);

    assert.equal(ctx.isNextCalled(), true, "SUPER_ADMIN must be permitted");
  });
});
