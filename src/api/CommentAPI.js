import axiosJWT from "./ConfigAxiosInterceptor";

const URL_COMMENT = `http://localhost:8080/mamababy/comments`;

export const allCommentApi = (params) => {
  return axiosJWT.get(URL_COMMENT, {
    params: params,
  });
};

export const commentByProductIdApi = (productId) => {
  return axiosJWT.get(
    `http://localhost:8080/mamababy/comments/product/${productId}`
  );
};

export const commentByProductIdWithStoreApi = (productId) => {
  return axiosJWT.get(
    `http://localhost:8080/mamababy/comments/store/product/${productId}`
  );
};

export const commentByUserIdApi = (userId) => {
  return axiosJWT.get(`http://localhost:8080/mamababy/comments/user/${userId}`);
};

export const createCommentApi = (product_id, rating, comment, user_id) => {
  return axiosJWT.post(URL_COMMENT, {
    product_id: product_id,
    rating: rating,
    comment: comment,
    user_id: user_id,
  });
};

export const updateCommentApi = (id, rating, comment, user_id) => {
  return axiosJWT.put(`${URL_COMMENT}/${id}`, {
    rating: rating,
    comment: comment,
    user_id: user_id,
  });
};

export const updateCommentStatusApi = (id, status) => {
  return axiosJWT.put(`${URL_COMMENT}/status/${id}`, {
    status: status,
  });
};
