import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ARTICLE = `http://localhost:8080/mamababy/article`;

export const allArticleApi = (params) => {
  return axiosJWT.get(URL_ARTICLE, {
    params: params,
  });
};

// import {allArticleApi } from "../../api/ArticleAPI";
// const [article, setArticle] = useState([]);