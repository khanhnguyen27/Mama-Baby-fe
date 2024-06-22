import axiosJWT from "./ConfigAxiosInterceptor";

const URL_REFUND = `http://localhost:8080/mamababy/refunds`;

export const allRefundApi = (params) => {
    return axiosJWT.get(URL_REFUND, {
      params: params,
    });
};

export const refundByYearApi = async (selectedYear) => {
  try {
    const response = await axiosJWT.get(`${URL_REFUND}/findByYear?year=${selectedYear}`);
    return response;
  } catch (error) {
    throw new Error(`Error fetching refunds: ${error.message}`);
  }
};

export const refundByIdApi = (refundId) => {
  return axiosJWT.get(`${URL_REFUND}/${refundId}`, {
    refundId: refundId,
  });
};

export const refundByStoreIdApi = (storeId) => {
    return axiosJWT.get(`${URL_REFUND}/store/${storeId}`, {
      storeId: storeId,
    });
};

export const updateRefundApi = (
  id,
  description,
  storeId,
  userId,
  orderId,
  status,
  cartItemsRefund
) => {
  return axiosJWT.put(`${URL_REFUND}/${id}`, {
    description:description,
    store_id:storeId,
    user_id:userId,
    order_id:orderId,
    status:status,
    cart_items_refund:cartItemsRefund
  });
};


