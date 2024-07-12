import axiosJWT from "./ConfigAxiosInterceptor";

const URL_PACKAGE = `http://localhost:8080/mamababy/package`;

export const allPackageApi = (params) => {
    return axiosJWT.get(URL_PACKAGE, {
      params: params,
    });
  };

  