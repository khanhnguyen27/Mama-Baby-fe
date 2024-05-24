import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLSTORE = `http://localhost:8080/mamababy/stores`;

export const allStoreApi = (params) => {
  return axiosJWT.get(URL_ALLSTORE, {
    params: params,
  });
};
