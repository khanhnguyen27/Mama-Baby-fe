import axiosJWT from "./ConfigAxiosInterceptor";
const URL_STOREPACKAGE = `http://localhost:8080/mamababy/store_package`;

export const allStorePackageApi = (params) => {
    return axiosJWT.get(URL_STOREPACKAGE, {
        params: params,
    });
};