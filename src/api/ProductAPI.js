import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLPRODUCT = `http://localhost:8080/mamababy/products`;
// const URL_PRODUCTBYID = `http://localhost:8080/mamababy/products/${productId}`;


export const allProductApi = (params) => {
  return axiosJWT.get(URL_ALLPRODUCT, {
    params: params,
  });
};

export const productByIdApi = (productId) => {
  return axiosJWT.get(`http://localhost:8080/mamababy/products/${productId}`);
};
