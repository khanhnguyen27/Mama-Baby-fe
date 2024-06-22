import axiosJWT from "./ConfigAxiosInterceptor";

const URL_USER = `http://localhost:8080/mamababy/users/all`;
const URL_LOGIN = `http://localhost:8080/mamababy/users/login`;
const URL_SIGNUP = `http://localhost:8080/mamababy/users/register`;
const URL_USERDETAIL = `http://localhost:8080/mamababy/users/details`;
const URL_ACTIVE = `http://localhost:8080/mamababy/users/admin`;
const URL_ACTIVESTORE = `http://localhost:8080/mamababy/users/admin`;
// const URL_LOGOUT = `http://localhost:8080/mamababy/users/logout`;

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
export const updateAccountApi = ( username, fullName, address, phoneNumber, status) => {
  return axiosJWT.put(URL_ACTIVE, {
    username: username,
    password: "888888888",
    fullName: fullName,
    address: address,
    phoneNumber: "123312312312",
    status: status
  });
};
export const updateRollUserApi = ( username, fullName, address, phoneNumber, status) => {
  return axiosJWT.put(URL_ACTIVESTORE, {
    username: username,
    password: "88888888",
    fullName: fullName,
    address: "",
    phoneNumber: "123312312312",
    status: status,
    roleId: 2,
  });
};




// export const logoutApi = (token) => {
//   return axiosJWT.post(URL_LOGOUT, null, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
