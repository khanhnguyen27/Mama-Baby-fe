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
export const storeByUserIdApi = (userId) => {
  return axiosJWT.get(`http://localhost:8080/mamababy/stores/user/${userId}`);
};
export const regisStoreApi = (
  storename,
  address,
  description,
  phone,
  user_id,

) => {
  return axiosJWT.post(URL_ALLSTORE, {
    name_store: storename,
    address: address,
    description: description,
    phone: phone,
    status: 1,
    is_active:false,
    user_id: 12,
  });
};



