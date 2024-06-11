import axiosJWT from "./ConfigAxiosInterceptor";

const URL_MAKEPAYMENT = `http://localhost:8080/mamababy/payment/vn-pay`;


export const makePaymentApi = (finalAmount, bankCode, orders) => {
  // const formData = new FormData();
  // formData.append('finalAmount', finalAmount);
  // formData.append('bankCode', bankCode);
  // formData.append('orders', orders);
  return axiosJWT.post(URL_MAKEPAYMENT, {
    finalAmount: finalAmount,
    bankCode: bankCode,
    orders: orders
  });
};

// export const makePaymentApi = (finalAmount, bankCode) => {
//     // const url = `${URL_MAKEPAYMENT}?finalAmount=${encodeURIComponent(finalAmount)}&bankCode=${encodeURIComponent(bankCode)}`;
//     return axiosJWT.post(URL_MAKEPAYMENT, {
//       // user_id: userId,
//       // voucher_id: voucherId,
//       // total_point : totalPoint,
//       // amount: amount,
//       // total_discount: totalDiscount,
//       // shipping_address: shippingAddress,
//       // final_amount: final_amount,
//       finalAmount: finalAmount,
//       // payment_method: paymentMethod,
//       bankCode: bankCode,
//       // type: type,
//       // cartItems: cartItems,
//     });
// };
