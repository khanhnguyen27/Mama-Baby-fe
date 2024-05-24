import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLPRODUCT = `http://localhost:8080/mamababy/products`;

export const allProductApi = (params) => {
  return axiosJWT.get(URL_ALLPRODUCT, {
    params: params,
  });
};
