import axiosJWT from "./ConfigAxiosInterceptor";

const URL_VOUCHER = `http://localhost:8080/mamababy/vouchers`;
const URL_VOUCHERADMIN = `http://localhost:8080/mamababy/vouchers/admin`;

export const allVoucherApi = (params) => {
  return axiosJWT.get(URL_VOUCHER, {
    params: params,
  });
};

export const allVoucherAdminApi = (params) => {
  return axiosJWT.get(URL_VOUCHERADMIN, {
    params: params,
  });
};

export const getVoucherByStoreIdApi = (storeId) => {
  return axiosJWT.get(`${URL_VOUCHER}/store/${storeId}`, {
    storeId: storeId,
  });
};

export const addVoucherApi = (
  code,
  discountValue,
  description,
  endAt,
  storeId,
  isActive
) => {
  return axiosJWT.post(URL_VOUCHER, {
    code:code,
    discount_value:discountValue,
    description:description,
    end_at:endAt,
    store_id:storeId,
    is_active:isActive
  });
};

export const updateVoucherApi = (
  id,
  code,
  discountValue,
  description,
  endAt,
  isActive
) => {
  return axiosJWT.put(`${URL_VOUCHER}/${id}`, {
    code:code,
    discount_value:discountValue,
    description:description,
    end_at:endAt,
    is_active:isActive
  });
};
