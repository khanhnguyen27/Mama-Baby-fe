import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ALLVOUCHER = `http://localhost:8080/mamababy/vouchers`;

export const allVoucherApi = (params) => {
  return axiosJWT.get(URL_ALLVOUCHER, {
    params: params,
  });
};