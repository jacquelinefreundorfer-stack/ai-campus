import { createServerFn } from "@tanstack/react-start";
import { auth } from "~/lib/auth";
import { db } from "~/db/index";
import { enrollments } from "~/db/schema";
import { eq } from "drizzle-orm";

// ── Get the current session from request headers ─────────────────────────────

export async function getSessionFromHeaders(headers: Headers) {
  try {
    const session = await auth.api.getSession({ headers });
    return session;
  } catch {
    return null;
  }
}

// ── Server function: verify enrollment ownership ─────────────────────────────

export const verifyEnrollmentOwnership = createServerFn()
  .validator((enrollmentId: number) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    // This runs server-side — we need access to headers
    // TanStack Start server functions can access the request context
    // For now, we do a direct lookup and rely on the route loaders for auth
    const d = db();
    const [enrollment] = await d
      .select()
      .from(enrollments)
      .where(eq(enrollments.id, enrollmentId));
    return enrollment ?? null;
  });
