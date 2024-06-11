import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ORDER = `http://localhost:8080/mamababy/orders`;

export const allOrderApi = (params) => {
  return axiosJWT.get(URL_ORDER, {
    params: params,
  });
};

export const orderByUserIdApi = (userId) => {
  return axiosJWT.get(`${URL_ORDER}/user/${userId}`, {
    userId: userId,
  });
};

export const createOrderApi = (
  userId,
  fullName,
  phone,
  voucherId,
  totalPoint,
  amount,
  totalDiscount,
  finalAmount,
  shippingAddress,
  paymentMethod,
  type,
  cartItems
) => {
  return axiosJWT.post(URL_ORDER, {
    user_id: userId,
    full_name: fullName,
    phone_number: phone,
    voucher_id: voucherId,
    total_point: totalPoint,
    amount: amount,
    total_discount: totalDiscount,
    final_amount: finalAmount,
    shipping_address: shippingAddress,
    payment_method: paymentMethod,
    type: type,
    cart_items: cartItems,
  });
};
