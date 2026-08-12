import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { JWTPayload } from "@/types";

export const SESSION_COOKIE_NAME = "adorepark_session";

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized access. Please login.");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]): Promise<JWTPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error("Forbidden. You do not have permission for this action.");
  }
  return session;
}
