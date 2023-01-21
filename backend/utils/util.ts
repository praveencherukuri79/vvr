export function isDefined(val: any): boolean {
  if (val !== null && val !== undefined && typeof val !== 'undefined' && val !== '') {
    return true;
  }
  return false;
}

export const getUserReturnData = (userRecord, token?) => {
  const data: { user?: any; token?: string } = {};
  data.user = {
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role
  };
  if (userRecord.role == 'user') {
    data.user.adminApproved = userRecord.adminApproved;
  }
  if (token){
    data.token = token;
  }

  return data;
};
