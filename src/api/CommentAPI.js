import axiosJWT from "./ConfigAxiosInterceptor";

const URL_COMMENT = `http://localhost:8080/mamababy/comments`;

export const allCommentApi = (params) => {
    return axiosJWT.get(URL_COMMENT, {
      params: params,
    });
};

export const commentByProductIdApi = (productId) => {
    return axiosJWT.get(`http://localhost:8080/mamababy/comments/product/${productId}`);
  };