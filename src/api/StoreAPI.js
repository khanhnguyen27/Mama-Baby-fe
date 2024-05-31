import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLSTORE = `http://localhost:8080/mamababy/stores`;

export const allStoreApi = (params) => {
  return axiosJWT.get(URL_ALLSTORE, {
    params: params,
  });
};
export const storeByIdApi = (storeId) => {
  return axiosJWT.get(`http://localhost:8080/mamababy/stores/${storeId}`);
};
