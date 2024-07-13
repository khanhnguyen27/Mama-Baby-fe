import axiosJWT from "./ConfigAxiosInterceptor";

const URL_PACKAGE = `http://localhost:8080/mamababy/package`;

export const allPackageApi = (params) => {
  return axiosJWT.get(URL_PACKAGE, {
    params: params,
  });
};

export const updatePackageApi = (id, packageName, price, month, description) => {
  return axiosJWT.put(`${URL_PACKAGE}/${id}`, {
    package_name: packageName,
    price: price,
    month: month,
    description: description,
  });
};

