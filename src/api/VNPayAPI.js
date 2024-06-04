import axiosJWT from "./ConfigAxiosInterceptor";

const URL_MAKEPAYMENT = `http://localhost:8080/mamababy/payment/vn-pay`;


export const makePaymentApi = (userId, voucherId, totalPoint, amount, totalDiscount, shippingAddress, finalAmount, bankCode, type, cartItems, language) => {
    const url = `${URL_MAKEPAYMENT}?finalAmount=${encodeURIComponent(finalAmount)}&bankCode=${encodeURIComponent(bankCode)}&language=${encodeURIComponent(language)}`;
    return axiosJWT.post(url, {
      userId: userId,
      voucherId: voucherId,
      totalPoint : totalPoint,
      amount: amount,
      totalDiscount: totalDiscount,
      shippingAddress: shippingAddress,
      finalAmount: finalAmount,
      bankCode: bankCode,
      type: type,
      cartItems: cartItems,
      language: language
    });
};