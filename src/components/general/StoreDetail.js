import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { allProductApi } from "../../api/ProductAPI";
import Carousel from "react-material-ui-carousel";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import { allVoucherApi } from "../../api/VoucherAPI";
import {storeByIdApi, productByStoreIdApi } from "../../api/StoreAPI";
import {
  Box,
  Breadcrumbs,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Tooltip,
  Typography,
} from "@mui/material";
import { KeyboardCapslock } from "@mui/icons-material";
import Cart from "@mui/icons-material/ShoppingCart";

export default function Products() {
  const navigate = useNavigate();
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
  const [ageFilter, setAgeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [voucher, setVoucher] = useState([]);
  const [store, setStore] = useState([]);
  const storeId = state?.storeId;
  const keyword = state?.keyword;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  var items = [
    {

      image: "https://cdn1.concung.com/img/adds/2024/04/1714120748-HOME.png",
    },
    {

      image:
        "https://cdn1.concung.com/img/adds/2024/04/1713941097-HOME-KIDESSENTIALS.png",
    },
    {

      image: "https://cdn1.concung.com/img/adds/2024/05/1715592332-HOME.png",
    },
  ];

  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes, voucherRes, storeRes, productByStoreIdRes] = await Promise.all([
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
        allVoucherApi(),
        storeByIdApi(storeId),


      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];
      const storeData = storeRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);
      setVoucher(voucherData);
      setStore(storeData);

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
  }, [keyword, ageFilter, brandFilter, categoryFilter]);

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
  const listRef = useRef(null);
  const listRef2 = useRef(null);
  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -460, behavior: "smooth" });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: 460, behavior: "smooth" });
  };
  const scrollLeft2 = () => {
    listRef2.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight2 = () => {
    listRef2.current.scrollBy({ left: 340, behavior: "smooth" });
  };
  console.log(product);

  return (
    <div
      style={{
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container sx={{ my: 4 }}>
        <Breadcrumbs separator=">" sx={{ color: "black" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
            }}
          >
            <Typography
              sx={{
                color: "black",
                transition: "color 0.2s ease-in-out",
                fontSize: 20,
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Home
            </Typography>
          </Link>
          <Link
            to="/stores"
            style={{
              textDecoration: "none",
            }}
          >
            <Typography
              sx={{
                color: "black",
                transition: "color 0.2s ease-in-out",
                fontSize: 20,
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Stores
            </Typography>
          </Link>
          <Typography
            sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
          >
            {store.name_store} 
          </Typography>
        </Breadcrumbs>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRadius: "16px",
            background: "white",
            padding: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              VinhTam
            </Typography>
          </Box>
        </Box>
      </Container>
      <Container sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            borderRadius: "16px",
            background: "white",
          }}
        >
          <IconButton
            onClick={scrollLeft}
            size="small"
            sx={{
              position: "absolute",
              left: -10,
              zIndex: 1,
              backgroundColor: "white",
              color: "#ff469e",
              border: "1px solid #ff469e",
              boxShadow: "1px 1px 2px rgba(0, 0, 0.16)",
              transition: "0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.15)",
                background: "white",
                boxShadow: "1px 1px 4px rgba(0, 0, 0.24)",
                "& svg": {
                  transform: "scale(1.1)",
                },
              },
            }}
          >
            <ArrowLeft />
          </IconButton>
          <Box
            ref={listRef}
            sx={{
              display: "flex",
              overflowX: "hidden",
              scrollBehavior: "smooth",
              width: "100%",
              padding: "0px 8px",
            }}
          >
            {voucher?.map((item, index) => (
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
                      boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                      color: "black",
                      borderRadius: "8px",
                      border: "1px solid black",
                      fontSize: "12px",
                    },
                  },
                }}
              >
                <Box
                  key={index}

                  sx={{
                    minWidth: 180,
                    padding: 2,
                    border: "1px solid white",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    marginRight: 2,
                    backgroundColor: "white",
                    transition: "border 0.2s",
                    "&:hover": {
                      border: "1px solid #ff496e",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <img
                    src="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                    style={{ width: "64px", height: "64px" }}
                  />
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
                    {item.code.length > 40
                      ? `${item.code.substring(0, 40)}...`
                      : item.code}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "gray",
                      textAlign: "left",
                    }}
                  >
                    {item.discountValue}VND
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "gray",
                      textAlign: "left",
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
          <IconButton
            onClick={scrollRight}
            size="small"
            sx={{
              position: "absolute",
              right: -10,
              zIndex: 1,
              backgroundColor: "white",
              color: "#ff469e",
              border: "1px solid #ff469e",
              boxShadow: "1px 1px 1px rgba(0, 0, 0.16)",
              transition: "0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.15)",
                background: "white",
                boxShadow: "1px 1px 3px rgba(0, 0, 0.24)",
                "& svg": {
                  transform: "scale(1.1)",
                },
              },
            }}
          >
            <ArrowRight />
          </IconButton>
        </Box>
      </Container>

      <Container sx={{ my: -3 }}></Container>

      <Container sx={{ my: 4 }}>
        <Box></Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRadius: "16px",
            background: "white",
            padding: "1rem",
            marginTop: "3rem",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Store article
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#ff469e",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/article")}
            >
              See more article
            </Typography>
          </Box>
          <Carousel>
            {items.map((item, i) => (
              <div
                onClick={() => navigate("/article")}
                key={i}
                style={{
                  padding: 20,
                  textAlign: "center",
                  backgroundImage: `url(${item.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "16px",
                }}
              >
              </div>
            ))}
          </Carousel>
          {/* List */}
        </Box>
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
              <Typography
                variant="h6"
                sx={{ marginBottom: "1rem", fontWeight: "bold" }}
              >
                Filters
              </Typography>
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
                        <CardMedia
                          component="img"
                          image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                          alt={item.name}
                          sx={{ width: "64px", height: "64px", margin: "auto" }}
                        />
                        <CardContent>
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
                            ${item.price}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            {brandMap[item.brand_id]}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "right" }}>
                          <IconButton>
                            <Cart />
                          </IconButton>
                        </CardActions>
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
