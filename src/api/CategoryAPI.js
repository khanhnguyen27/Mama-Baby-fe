import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLCATEGORY = `http://localhost:8080/mamababy/categories`;

export const allCategorytApi = (params) => {
  return axiosJWT.get(URL_ALLCATEGORY, {
    params: params,
  });
};
