import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ARTICLE = `http://localhost:8080/mamababy/article`;
//const URL_ARTICLE_BY_STORE = `http://localhost:8080/mamababy/article/store`;

export const allArticleApi = (params) => {
  return axiosJWT.get(URL_ARTICLE, {
    params: params,
  });
};

export const getArticlesByStoreIdApi = (params) => {
  return axiosJWT.get(`${URL_ARTICLE}/store`, {
    params: params,
  });
};

export const getArticlesNoPageApi = (params) => {
  return axiosJWT.get(`${URL_ARTICLE}/no_page`, {
    params: params,
  });
};

// import {allArticleApi } from "../../api/ArticleAPI";
// const [article, setArticle] = useState([]);

export const addArticleApi = (
  file,
  header,
  content,
  product_recom,
  store_id,
  status
) => {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("header", header);
  formData.append("content", content);
  formData.append("product_recom", product_recom);
  formData.append("link_image", "");
  formData.append("store_id", store_id);
  formData.append("status", status);

  return axiosJWT.post(URL_ARTICLE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateArticleApi = (id, articleData, file) => {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("header", articleData.header);
  formData.append("content", articleData.content);
  formData.append("product_recom", articleData.product_recom);
  formData.append("link_image", articleData.link_image);
  formData.append("store_id", articleData.store_id);
  formData.append("status", articleData.status);

  return axiosJWT.put(`${URL_ARTICLE}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const articleByIdApi = (articleId) => {
  return axiosJWT.get(`${URL_ARTICLE}/${articleId}`);
};
