import axiosJWT from "./ConfigAxiosInterceptor";

const URL_CATEGORY = `http://localhost:8080/mamababy/categories`;

export const allCategorytApi = (params) => {
  return axiosJWT.get(URL_CATEGORY, {
    params: params,
  });
};
