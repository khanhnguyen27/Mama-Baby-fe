import axiosJWT from "./ConfigAxiosInterceptor";

const URL_AGE = `http://localhost:8080/mamababy/age`;

export const allAgeApi = (params) => {
  return axiosJWT.get(URL_AGE, {
    params: params,
  });
};
