import { SignJWT, jwtVerify } from "jose";
import { JWTPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "adorepark_super_secret_jwt_token_key_2026_32chars";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
