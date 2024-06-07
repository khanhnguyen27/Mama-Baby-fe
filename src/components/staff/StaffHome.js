import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { allProductApi } from "../../api/ProductAPI";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Tooltip,
  Typography,
} from "@mui/material";
import { ClearAll, KeyboardCapslock } from "@mui/icons-material";
import Cart from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";
import { allStoreApi, storeByUserIdApi } from "../../api/StoreAPI";
import { jwtDecode } from "jwt-decode";

export default function StaffHome() {
  const navigate = useNavigate();
  window.document.title = "Products";
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [ageFilter, setAgeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const keyword = state?.keyword;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;

  useEffect(() => {
    storeByUserIdApi(userId)
      .then((res) => {
        setStore(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const storeId = store.id;
  console.log(storeId);
  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allProductApi({
          keyword: keyword,
          age_id: ageFilter,
          brand_id: brandFilter,
          category_id: categoryFilter,
          store_id: storeId,
        }),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);

      const ageMap = ageData.reduce((x, item) => {
        x[item.id] = item.rangeAge;
        return x;
      }, {});
      setAgeMap(ageMap);

      const brandMap = brandData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setBrandMap(brandMap);

      const categoryMap = categoryData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setCategoryMap(categoryMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchData();
  }, [keyword, ageFilter, brandFilter, categoryFilter, storeId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleAgeChange = (id) => {
    setAgeFilter((prev) => (prev === id ? null : id));
    setLoading(true);
  };

  const handleBrandChange = (id) => {
    setBrandFilter((prev) => (prev === id ? null : id));
    setLoading(true);
  };

  const handleCategoryChange = (id) => {
    setCategoryFilter((prev) => (prev === id ? null : id));
    setLoading(true);
  };

  const handleClearFilters = () => {
    setAgeFilter(null);
    setBrandFilter(null);
    setCategoryFilter(null);
    setLoading(true);
  };


  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return (
      <div
        style={{
          backgroundColor: "#f5f7fd",
          padding: "20px",
        }}
      >
        <Container sx={{ my: 4 }}>
        </Container>
        <Container>
          <Grid container spacing={3}>
            {/* Filters */}
            <Grid
              item
              sm={12}
              md={3}
              sx={{
                border: "2px solid #ff469e",
                borderRadius: "20px",
                backgroundColor: "white",
                my: 3,
              }}
            >
              <Box sx={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      flexGrow: 1,
                      textAlign: "center",
                    }}
                  >
                    Filters
                  </Typography>
                  {(ageFilter || brandFilter || categoryFilter) && (
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "10px",
                        fontSize: 16,
                        fontWeight: "bold",
                        mr: 2,
                        padding: "0.25rem 0.5rem",
                        boxShadow: "none",
                        transition:
                          "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                        border: "1px solid #ff469e",
                        "&:hover": {
                          backgroundColor: "#ff469e",
                          color: "white",
                          border: "1px solid white",
                        },
                      }}
                    >
                      <ClearAll />
                    </Button>
                  )}
                </div>
                <Grid container spacing={2}>
                  {/* Age Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Age
                    </Typography>
                    <Grid container spacing={1}>
                      {age.map((item) => (
                        <Grid
                          xs={6}
                          item
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={ageFilter === item.id}
                                onChange={() => handleAgeChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.rangeAge}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {/* Brand Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Brand
                    </Typography>
                    <Grid container spacing={1}>
                      {brand.map((item) => (
                        <Grid
                          xs={6}
                          item
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={brandFilter === item.id}
                                onChange={() => handleBrandChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {/* Category Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Category
                    </Typography>
                    <Grid container spacing={1}>
                      {category.map((item) => (
                        <Grid
                          item
                          xs={12}
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={categoryFilter === item.id}
                                onChange={() => handleCategoryChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Loading Spinner */}
            <Grid item sm={12} md={9}>
              <Box
                sx={{
                  backgroundColor: "#f5f7fd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ color: "#ff469e" }} size={90} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container>
        <Grid container spacing={3}>
          {/* Filters */}
          <Grid
            item
            sm={12}
            md={3}
            sx={{
              border: "2px solid #ff469e",
              borderRadius: "20px",
              backgroundColor: "white",
              my: 3,
            }}
          >
            <Box sx={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    flexGrow: 1,
                    textAlign: "center",
                  }}
                >
                  Filters
                </Typography>
                {(ageFilter || brandFilter || categoryFilter) && (
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "10px",
                      fontSize: 16,
                      fontWeight: "bold",
                      mr: 2,
                      padding: "0.25rem 0.5rem",
                      boxShadow: "none",
                      transition:
                        "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                        border: "1px solid white",
                      },
                    }}
                  >
                    <ClearAll />
                  </Button>
                )}
              </div>
              <Grid container spacing={2}>
                {/* Age Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Age
                  </Typography>
                  <Grid container spacing={1}>
                    {age.map((item) => (
                      <Grid
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                        item
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={ageFilter === item.id}
                              onChange={() => handleAgeChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.rangeAge}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Brand Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Brand
                  </Typography>
                  <Grid container spacing={1}>
                    {brand.map((item) => (
                      <Grid
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                        item
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={brandFilter === item.id}
                              onChange={() => handleBrandChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Category Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Category
                  </Typography>
                  <Grid container spacing={1}>
                    {category.map((item) => (
                      <Grid
                        item
                        xs={12}
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={categoryFilter === item.id}
                              onChange={() => handleCategoryChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* List Products */}
          <Grid item sm={12} md={9}>
            <Grid container spacing={3}>
              {product?.products?.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", marginTop: 8, color: "#ff469e" }}
                  >
                    There's no item matching your search.
                  </Typography>
                </Grid>
              ) : (
                product?.products?.map((item, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Tooltip
                      title={item.name}
                      enterDelay={500}
                      leaveDelay={50}
                      placement="right-start"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 250 }}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "white",
                            boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.16)",
                            color: "black",
                            borderRadius: "8px",
                            border: "1px solid black",
                            fontSize: "12px",
                          },
                        },
                      }}
                    >
                      <Card
                        sx={{
                          minWidth: 180,
                          padding: 2,
                          border: "1px solid #f5f7fd",
                          borderRadius: "16px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          backgroundColor: "white",
                          transition: "border 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            border: "1px solid #ff469e",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                          alt={item.name}
                          sx={{ width: "64px", height: "64px", margin: "auto" }}
                          onClick={() =>
                            navigate(
                              `/products/${item.name
                                .toLowerCase()
                                .replace(/\s/g, "-")}`,
                              { state: { productId: item.id } },
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              })
                            )
                          }
                        />
                        <CardContent
                          onClick={() =>
                            navigate(
                              `/products/${item.name
                                .toLowerCase()
                                .replace(/\s/g, "-")}`,
                              { state: { productId: item.id } },
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              })
                            )
                          }
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              marginTop: "0.75rem",
                              textAlign: "left",
                              whiteSpace: "normal",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              maxWidth: "100%",
                              lineHeight: "1.2rem",
                              maxHeight: "2.4rem",
                            }}
                          >
                            {item.name.length > 40
                              ? `${item.name.substring(0, 40)}...`
                              : item.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            {formatCurrency(item.price)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            {brandMap[item.brand_id]} |{" "}
                            {categoryMap[item.category_id]}
                          </Typography>
                        </CardContent>            
                      </Card>
                    </Tooltip>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
        {visible && (
          <IconButton
            size="large"
            sx={{
              position: "fixed",
              right: 25,
              bottom: 25,
              border: "1px solid #ff469e",
              backgroundColor: "#fff4fc",
              color: "#ff469e",
              transition:
                "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#ff469e",
                color: "white",
              },
            }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <KeyboardCapslock />
          </IconButton>
        )}
      </Container>
    </div>
  );
}
