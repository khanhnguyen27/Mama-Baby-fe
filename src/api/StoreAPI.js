import axiosJWT from "./ConfigAxiosInterceptor";

const URL_STORE = `http://localhost:8080/mamababy/stores`;

export const allStoreApi = (params) => {
  return axiosJWT.get(URL_STORE, {
    params: params,
  });
};

export const allStoreByAdminApi = (params) => {
  return axiosJWT.get(`${URL_STORE}/admin`, {
    params: params,
  });
};

export const storeByIdApi = (storeId) => {
  return axiosJWT.get(`http://localhost:8080/mamababy/stores/${storeId}`);
};

export const storeByUserIdApi = (userId) => {
  return axiosJWT.get(`http://localhost:8080/mamababy/stores/user/${userId}`);
};

export const StoreByMonthApi = async (selectedMonth) => {
  try {
    const response = await axiosJWT.get(
      `${URL_STORE}/findByMonth?month=${selectedMonth}`
    );
    return response;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

export const regisStoreApi = (
  storename,
  address,
  description,
  phone,
  userId,
  license // Thêm tham số licenseUrl vào hàm
) => {
  const formData = new FormData();
  formData.append("nameStore", storename);
  formData.append("address", address);
  formData.append("description", description);
  formData.append("phone", phone);
  formData.append("userId", userId);
  formData.append("license", license); // Thêm giá trị licenseUrl vào FormData

  return axiosJWT.post(URL_STORE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const requestStoreApi = (
  storeId,
  nameStore,
  address,
  description,
  phone,
  status,
  isActive,
  userId
) => {
  return axiosJWT.put(`${URL_STORE}/admin/update_status/${storeId}`, {
    name_store: nameStore,
    address: address,
    description: description,
    phone: phone,
    status: status,
    is_active: isActive,
    user_id: userId,
  });
};
export const deleteStoreApi = (storeId) => {
  return axiosJWT.delete(`${URL_STORE}/${storeId}`);
};
