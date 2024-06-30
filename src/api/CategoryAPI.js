import axiosJWT from "./ConfigAxiosInterceptor";

const URL_CATEGORY = `http://localhost:8080/mamababy/categories`;

export const allCategorytApi = (params) => {
  return axiosJWT.get(URL_CATEGORY, {
    params: params,
  });
};

export const allCategoryAdminApi = (params) => {
  return axiosJWT.get(`${URL_CATEGORY}/admin`, {
    params: params,
  });
};

export const addCategoryApi = async (categoryData) => {
  try {
    const response = await axiosJWT.post(URL_CATEGORY, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryApi = (id, name, isActive) => {
  return axiosJWT.put(`${URL_CATEGORY}/${id}`, {
    name: name,
    is_active: isActive,
  });
};
