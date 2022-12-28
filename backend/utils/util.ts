export function isDefined(val: any): boolean {
  if (val !== null && val !== undefined && typeof val !== 'undefined' && val !== '') {
    return true;
  }
  return false;
}

export const getUserReturnData = (userRecord, token) => {
  return {
    user: {
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role
    },
    token: token
  };
};
