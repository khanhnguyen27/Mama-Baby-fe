import axiosJWT from "./ConfigAxiosInterceptor";

const URL_STORE = `http://localhost:8080/mamababy/stores`;

export const allStoreApi = (params) => {
  return axiosJWT.get(URL_STORE, {
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
  userId
) => {
  return axiosJWT.post(URL_STORE, {
    name_store: storename,
    address: address,
    description: description,
    phone: phone,
    user_id: userId,
  });
};
export const requestStoreApi = (storeId, nameStore, address, description, phone, status, isActive, userId ) => {
  return axiosJWT.put(`${URL_STORE}/admin/update_status/${storeId}`, {
    name_store: nameStore,
    address:address,
    description:description,
    phone:phone,
    status: status,
    is_active: isActive,
    user_id: userId,
  });
};
