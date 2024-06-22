import axiosJWT from "./ConfigAxiosInterceptor";

const URL_EXCHANGE = `http://localhost:8080/mamababy/exchanges`;

export const allExchangeApi = (params) => {
  return axiosJWT.get(URL_EXCHANGE, {
    params: params,
  });
};

export const exchangeByStoreIdApi = (storeId) => {
  return axiosJWT.get(`${URL_EXCHANGE}/store/${storeId}`);
}

export const addExchangeApi = (description, orderId, status, storeId, userId, cartItemsExchange) => {
    return axiosJWT.post(URL_EXCHANGE, {
        description: description,
        // amount: finalAmount,
        order_id: orderId,
        status: status,
        store_id: storeId,
        user_id: userId,
        cart_items_exchange: cartItemsExchange
      });
};
