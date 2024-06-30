import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ACTIVE = `http://localhost:8080/mamababy/active`;

export const allActiveByUserApi = (userId) => {
  return axiosJWT.get(`${URL_ACTIVE}/${userId}`);
};
