import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLAGE = `http://localhost:8080/mamababy/age`;

export const allAgeApi = (params) => {
  return axiosJWT.get(URL_ALLAGE, {
    params: params,
  });
};
