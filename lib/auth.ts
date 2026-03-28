import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  onboarded: boolean;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  trialEndsAt?: string;
}

export const signToken = async (payload: UserPayload): Promise<string> => {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
};

export const verifyToken = async (token: string): Promise<UserPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
};
