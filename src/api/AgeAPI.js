import axiosJWT from "./ConfigAxiosInterceptor";

const URL_AGE = `http://localhost:8080/mamababy/age`;

export const allAgeApi = (params) => {
  return axiosJWT.get(URL_AGE, {
    params: params,
  });
};

export const allAgeAdminApi = (params) => {
  return axiosJWT.get((`${URL_AGE}/admin`), {
    params: params,
  });
};

export const addAgeApi = async (ageData) => {
  try {
    const response = await axiosJWT.post(URL_AGE, ageData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAgeApi = (
  id,
  rangeAge,
  isActive
) => {
  return axiosJWT.put(`${URL_AGE}/${id}`, {
    range_age: rangeAge,
    is_active: isActive
  });
};