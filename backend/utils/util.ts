import * as jwt from 'jsonwebtoken';

export function isDefined(val: any): boolean {
  if (val !== null && val !== undefined && typeof val !== 'undefined' && val !== '') {
    return true;
  }
  return false;
}

export const getUserReturnData = (userRecord, token?): { user?: any; token?: string } => {
  const data: { user?: any; token?: string } = {};
  data.user = {
    email: userRecord.email,
    phone: userRecord.phone,
    name: userRecord.name,
    role: userRecord.role
  };
  if (userRecord.role == 'user') {
    data.user.adminApproved = userRecord.adminApproved;
  }
  if (token) {
    data.token = token;
  }

  return data;
};

export const createJWT = (data: any, secret: string, expiresIn: string | number): string => {
  return jwt.sign(data, secret, { expiresIn: expiresIn });
};

export const verifyJWT = (token: string, secret: string): jwt.JwtPayload => {
  try {
    const decodedJwt: jwt.JwtPayload = jwt.verify(token, secret) as jwt.JwtPayload;
    return decodedJwt;
  } catch (e) {
    console.log(`Error in verifyJWT => `, e);
    return null;
  }
};
