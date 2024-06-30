import axiosJWT from "./ConfigAxiosInterceptor";

const URL_PRODUCT = `http://localhost:8080/mamababy/products`;
// const URL_PRODUCTBYID = `http://localhost:8080/mamababy/products/${productId}`;
// const URL_ADD_PRODUCT = `http://localhost:8080/mamababy/products`;
// const URL_UPDATE_PRODUCT = `http://localhost:8080/mamababy/products`;

export const allProductApi = (params) => {
  return axiosJWT.get(URL_PRODUCT, {
    params: params,
  });
};

export const allProductCHApi = (params) => {
  return axiosJWT.get(`${URL_PRODUCT}/comment_history`, {
    params: params,
  });
};

export const allProductByStoreApi = (params) => {
  return axiosJWT.get(`${URL_PRODUCT}/store`, {
    params: params,
  });
};

export const productByIdApi = (productId) => {
  return axiosJWT.get(`${URL_PRODUCT}/${productId}`);
};

export const addProductApi = (
  image,
  name,
  price,
  point,
  remain,
  status,
  description,
  expiryDate,
  type,
  brandId,
  categoryId,
  ageId,
  storeId,
  isActive
) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("name", name);
  formData.append("price", price);
  formData.append("point", point);
  formData.append("remain", remain);
  formData.append("status", status);
  formData.append("description", description);
  formData.append("expiryDate", expiryDate);
  formData.append("imageUrl", "");
  formData.append("type", type);
  formData.append("brandId", brandId);
  formData.append("categoryId", categoryId);
  formData.append("rangeAge", ageId);
  formData.append("storeId", storeId);
  formData.append("isActive", isActive);

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return axiosJWT.post(URL_PRODUCT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProductApi = (
  image,
  productId,
  name,
  price,
  point,
  remain,
  status,
  description,
  expiryDate,
  type,
  brandId,
  categoryId,
  ageId,
  storeId,
  isActive
) => {
  debugger;
  const formData = new FormData();
  formData.append("image", image);
  formData.append("name", name);
  formData.append("price", price);
  formData.append("point", point);
  formData.append("remain", remain);
  formData.append("status", status);
  formData.append("description", description);
  formData.append("expiryDate", expiryDate);
  formData.append("imageUrl", "");
  formData.append("type", type);
  formData.append("brandId", brandId);
  formData.append("categoryId", categoryId);
  formData.append("rangeAge", ageId);
  formData.append("storeId", storeId);
  formData.append("isActive", isActive);

  return axiosJWT.put(`${URL_PRODUCT}/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
