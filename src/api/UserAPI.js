import axiosJWT from "./ConfigAxiosInterceptor";

const URL_LOGIN = `http://localhost:8080/mamababy/users/login`;
const URL_SIGNUP = `http://localhost:8080/mamababy/users/register`;
const URL_USERDETAIL = `http://localhost:8080/mamababy/users/details`;
// const URL_LOGOUT = `http://localhost:8080/mamababy/users/logout`;

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

// export const logoutApi = (token) => {
//   return axiosJWT.post(URL_LOGOUT, null, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
