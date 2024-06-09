import axiosJWT from "./ConfigAxiosInterceptor";

const URL_VOUCHER = `http://localhost:8080/mamababy/vouchers`;

export const allVoucherApi = (params) => {
  return axiosJWT.get(URL_VOUCHER, {
    params: params,
  });
};