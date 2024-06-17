import axiosJWT from "./ConfigAxiosInterceptor";

const URL_REFUND = `http://localhost:8080/mamababy/refunds`;

export const allRefundApi = (params) => {
    return axiosJWT.get(URL_REFUND, {
      params: params,
    });
  };