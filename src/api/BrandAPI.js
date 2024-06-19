import axiosJWT from "./ConfigAxiosInterceptor";

const URL_BRAND = `http://localhost:8080/mamababy/brands`;

export const allBrandApi = (params) => {
  return axiosJWT.get(URL_BRAND, {
    params: params,
  });
};

export const allBrandAdminApi = (params) => {
  return axiosJWT.get((`${URL_BRAND}/admin`), {
    params: params,
  });
};

export const addBrandApi = async (brandData) => {
  try {
    const response = await axiosJWT.post(URL_BRAND, brandData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrandApi = (
  id,
  name,
  isActive
) => {
  return axiosJWT.put(`${URL_BRAND}/${id}`, {
    name: name,
    is_active: isActive
  });
};


{
  /*<List
              sx={{
                position: "sticky",
                top: "8rem",
                border: "1px solid #ff469e",
                borderRadius: "10px",
                backgroundColor: "white",
                marginTop: visible ? "7rem" : "",
              }}
            >
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemText primary="Mama's Milks" />
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowRight sx={{ color: "inherit" }} />
                </ListItemIcon>
              </ListItem>
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemText primary="Baby's Milks" />
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowRight sx={{ color: "inherit" }} />
                </ListItemIcon>
              </ListItem>
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemText primary="Other Milks" />
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowRight sx={{ color: "inherit" }} />
                </ListItemIcon>
              </ListItem>
            </List>*/
}
