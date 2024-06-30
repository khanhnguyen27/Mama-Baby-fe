import axiosJWT from "./ConfigAxiosInterceptor";

const URL_USER = `http://localhost:8080/mamababy/users/all`;
const URL_LOGIN = `http://localhost:8080/mamababy/users/login`;
const URL_SIGNUP = `http://localhost:8080/mamababy/users/register`;
const URL_USERDETAIL = `http://localhost:8080/mamababy/users/details`;
const URL_ACTIVE = `http://localhost:8080/mamababy/users/admin`;
const URL_ACTIVESTORE = `http://localhost:8080/mamababy/users/admin`;
// const URL_LOGOUT = `http://localhost:8080/mamababy/users/logout`;
const URL_ACCOUNT = `http://localhost:8080/mamababy/users`;

export const allUserApi = (params) => {
  return axiosJWT.get(URL_USER, {
    params: params,
  });
};

export const loginApi = (username, password) => {
  return axiosJWT.post(URL_LOGIN, {
    username: username,
    password: password,
  });
};

export const signupApi = (
  username,
  password,
  retype,
  fullname,
  address,
  phone
) => {
  return axiosJWT.post(URL_SIGNUP, {
    username: username,
    password: password,
    retype_password: retype,
    fullName: fullname,
    address: address,
    phoneNumber: phone,
  });
};

export const profileUserApi = () => {
  return axiosJWT.get(URL_USERDETAIL);
};
export const updateAccountApi = (
  username,
  fullName,
  address,
  phoneNumber,
  status,
  roleId
) => {
  return axiosJWT.put(URL_ACTIVE, {
    username: username,
    fullName: fullName,
    address: address,
    phoneNumber: phoneNumber,
    status: status,
    roleId: roleId,
  });
};
export const updateRollUserApi = (
  username,
  fullName,
  address,
  phoneNumber,
  status,
  newRoleId
) => {
  return axiosJWT.put(URL_ACTIVESTORE, {
    username: username,
    fullName: fullName,
    address: address,
    phoneNumber: phoneNumber,
    status: status,
    roleId: newRoleId,
  });
};

// export const logoutApi = (token) => {
//   return axiosJWT.post(URL_LOGOUT, null, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const userByYearApi = async (selectedAccountYear) => {
  try {
    const response = await axiosJWT.get(`${URL_ACCOUNT}/findByYear?year=${selectedAccountYear}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};