import axiosJWT from "./ConfigAxiosInterceptor";

const URL_MAKEPAYMENT = `http://localhost:8080/mamababy/payment/vn-pay`;


export const makePaymentApi = (finalAmount, bankCode) => {
  const formData = new FormData();
  formData.append('finalAmount', finalAmount);
  formData.append('bankCode', bankCode);

  return axiosJWT.post(URL_MAKEPAYMENT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
