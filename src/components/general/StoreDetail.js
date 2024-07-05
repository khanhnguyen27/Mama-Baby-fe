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
import { allArticleApi } from "../../api/ArticleAPI";
import { allCommentApi } from "../../api/CommentAPI";
import { Star, StarHalf, StarOutline } from "@mui/icons-material";

import { storeByIdApi, productByStoreIdApi } from "../../api/StoreAPI";
import {
  Paper,
  Box,
  Breadcrumbs,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Tooltip,
  Typography,
  Pagination,
  Avatar,
  Divider,
  Rating,
} from "@mui/material";
import { KeyboardCapslock } from "@mui/icons-material";
import Cart from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";

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
  const [article, setArticle] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const typeWHOLESALE = "WHOLESALE";
  const storeId = state?.storeId;
  const keyword = state?.keyword;
  const [comment, setComment] = useState([]);

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
      const [
        ageRes,
        brandRes,
        categoryRes,
        productRes,
        voucherRes,
        storeRes,
        articleRes,
        commentRes,
      ] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allProductApi({
          keyword: keyword,
          type: typeWHOLESALE,
          age_id: ageFilter,
          brand_id: brandFilter,
          category_id: categoryFilter,
          store_id: storeId,
          page: currentPage - 1,
        }),
        allVoucherApi(),
        storeByIdApi(storeId),
        allArticleApi(),
        allCommentApi(),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];
      const storeData = storeRes?.data?.data || [];
      const articleData = articleRes?.data?.data || [];
      const commentData = commentRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);
      setVoucher(voucherData);
      setStore(storeData);
      setArticle(articleData);
      setComment(commentData);

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
  }, [keyword, ageFilter, brandFilter, categoryFilter, currentPage]);

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
  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };
  const listRef = useRef(null);
  const listRef3 = useRef(null);
  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -460, behavior: "smooth" });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: 460, behavior: "smooth" });
  };
  const scrollLeft3 = () => {
    listRef3.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight3 = () => {
    listRef3.current.scrollBy({ left: 340, behavior: "smooth" });
  };
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

        <Box sx={{ p: 2 }}>
          <Paper
            sx={{
              padding: "20px",
              backgroundColor: "#f8f8f8",
              textAlign: "center",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              border: "2px solid #ff469e", // Màu viền hồng
              "&:hover": {
                border: "2px solid #ff469e", // Màu viền hồng khi hover
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                sx={{
                  color: "#ff469e",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                {store?.name_store}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={10} md={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center", // Canh giữa các phần tử trong Box
                      height: "100%", // Đảm bảo chiều cao của Box tương thích với Paper
                      padding: "10px",
                      border: "2px solid #ff469e", // Viền bọc quanh Avatar
                      borderRadius: "15px",
                    }}
                  >
                    <Avatar
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZJVlDPE_mC28sugfpG-HdgSViHPXDHL5ww&s"
                      alt={store?.name_store}
                      sx={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                      }}
                    />
                    <Box
                      sx={{
                        borderRadius: "15px",
                        padding: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <Divider
                        sx={{ margin: "12px 0", backgroundColor: "#ff469e" }}
                      />
                      <Typography variant="body1" gutterBottom>
                        <LocationOnIcon
                          sx={{
                            fontSize: 20,
                            verticalAlign: "middle",
                            marginRight: "8px",
                            color: "#ff469e",
                          }}
                        />
                        {store?.address}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <PhoneIcon
                          sx={{
                            fontSize: 20,
                            verticalAlign: "middle",
                            marginRight: "8px",
                            color: "#ff469e",
                          }}
                        />
                        {store?.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h5"
                    sx={{
                      marginBottom: "1rem",
                      color: "#ff469e",
                      textAlign: "left",
                    }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ textAlign: "left" }}
                  >
                    {store?.description}
                  </Typography>
                  {/* Add more content or sections as needed */}
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Box>
      </Container>
      <Container>
        <Carousel
          PrevIcon={<ArrowLeft />}
          NextIcon={<ArrowRight />}
          height="240px"
          animation="slide"
          duration={500}
          navButtonsProps={{
            style: {
              backgroundColor: "white",
              color: "#ff469e",
            },
          }}
          sx={{
            border: "1px solid black",
            borderRadius: "16px",
            position: "relative",
            marginBottom: "2rem",
          }}
          indicatorContainerProps={{
            style: {
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 99,
            },
          }}
          indicatorIconButtonProps={{
            style: {
              color: "whitesmoke",
              backgroundColor: "black",
              borderRadius: "50%",
              width: "12px",
              height: "12px",
              margin: "0 4px",
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              color: "#ff469e",
              backgroundColor: "#ff469e",
              border: "1px solid white",
              borderRadius: "8px",
              width: "28px",
              height: "12px",
            },
          }}
        >
          {items.map((item, i) => (
            <div
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
              <Typography variant="h5" gutterBottom>
                {item.name}
              </Typography>
              <Typography variant="body1">{item.description}</Typography>
            </div>
          ))}
        </Carousel>
      </Container>
      <Container sx={{ my: 4 }}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ff379b" }}
            >
              Take Voucher
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={scrollLeft3}
              size="small"
              sx={{
                position: "absolute",
                left: -8,
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
              ref={listRef3}
              sx={{
                display: "flex",
                overflowX: "hidden",
                scrollBehavior: "smooth",
                width: "100%",
                padding: "0 8px",
              }}
            >
              {voucher.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 350,
                    padding: 2,
                    textAlign: "center",
                    border: "1px solid white",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    marginRight: 2,
                    backgroundColor: "#ffe4ec",
                    transition: "border 0.2s",
                    "&:hover": {
                      border: "1px solid #ff469e",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {/* Bố trí phần bên trái */}
                  <Box
                    sx={{ flex: 1, borderRight: "dash", borderRadius: "10px" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#ae0258" }}
                    >
                      {item.code}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#ff0064" }}
                    >
                      {formatCurrency(item.discount_value)}
                    </Typography>
                  </Box>

                  {/* Bố trí phần bên phải */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#ff0064", marginBottom: "0.5rem" }}
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#ae0258", marginBottom: "0.5rem" }}
                    >
                      {item.endAt}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <IconButton
              onClick={scrollRight3}
              size="small"
              sx={{
                position: "absolute",
                right: -8,
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
              <ArrowRight />
            </IconButton>
          </Box>
        </Box>
      </Container>

      <Container sx={{ my: 4 }}>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ff379b" }}
            >
              Store article
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#ff469e",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => {
                navigate("/articles");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              See more articles
            </Typography>
          </Box>
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
              {article?.articles?.map((item, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    navigate(
                      `/article/${item.header
                        .toLowerCase()
                        .replace(/\s/g, "-")}`,
                      { state: { articleId: item.id } }
                    );
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  sx={{
                    position: "relative",
                    minWidth: 180,
                    maxWidth: 600,
                    textAlign: "center",
                    border: "3px solid white",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    marginRight: 2,
                    backgroundColor: "white",
                    transition: "border 0.2s",
                    "&:hover": {
                      border: "3px solid #ff496e",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "auto",
                      borderRadius: "10px",
                    }}
                    src={
                      item.link_image && item.link_image.includes("Article_")
                        ? `http://localhost:8080/mamababy/products/images/${item.link_image}`
                        : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                    }
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      backgroundImage:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)",
                      color: "white",
                      fontWeight: "bold",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                      textAlign: "left",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.2rem",
                      height: "2.4rem",
                      maxHeight: "2.4rem",
                      paddingTop: "20px",
                      paddingBottom: "15px",
                    }}
                  >
                    <span>
                      {`\u00A0\u00A0\u00A0\u00A0${
                        item.header.length > 55
                          ? `${item.header.substring(0, 55)}...`
                          : item.header
                      }`}
                    </span>
                    <br />
                    <span
                      style={{
                        wordWrap: "break-word",
                        textAlign: "left",
                        color: "white",
                        marginBottom: "10px",
                        marginLeft: "15px",
                      }}
                    >
                      Created at:{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </Typography>
                </Box>
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
                product?.products?.map((item, index) => {
                  const productComments = comment.filter(
                    (x) => x.product_id === item.id
                  );

                  const averageRating = productComments.length
                    ? (
                        productComments.reduce(
                          (acc, cmt) => acc + cmt.rating,
                          0
                        ) / productComments.length
                      ).toFixed(1)
                    : 0;

                  const fullStars = Math.floor(averageRating);
                  const halfStar = averageRating - fullStars >= 0.5;
                  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                  return (
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
                            image={
                              item.image_url?.includes("Product_")
                                ? `http://localhost:8080/mamababy/products/images/${item.image_url}`
                                : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                            }
                            onError={(e) => {
                              e.target.src =
                                "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                            }}
                            alt={item.name}
                            sx={{
                              width: "64px",
                              height: "64px",
                              margin: "auto",
                            }}
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
                          <CardActions sx={{ justifyContent: "space-between" }}>
                            <CardContent sx={{ padding: "10px 0 0 0" }}>
                              <Typography
                                variant="h6"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {Array(fullStars).fill(
                                    <Star style={{ color: "#ff469e" }} />
                                  )}
                                  {halfStar && (
                                    <StarHalf style={{ color: "#ff469e" }} />
                                  )}
                                  {Array(emptyStars).fill(
                                    <StarOutline style={{ color: "#ff469e" }} />
                                  )}
                                  <span
                                    style={{
                                      color: "gray",
                                      fontSize: "0.8em",
                                    }}
                                  >
                                    (
                                    {
                                      comment.filter(
                                        (x) => x.product_id === item.id
                                      ).length
                                    }
                                    )
                                  </span>
                                </div>
                              </Typography>
                            </CardContent>
                            <IconButton
                              size="large"
                              sx={{
                                transition:
                                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1.5,
                              }}
                            >
                              <Cart />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Tooltip>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={product.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton={product.totalPages !== 1}
            showLastButton={product.totalPages !== 1}
            hidePrevButton={currentPage === 1}
            hideNextButton={currentPage === product.totalPages}
            size="large"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2.5rem",
              width: "70%",
              p: 1,
              opacity: 0.9,
              borderRadius: "20px",
              "& .MuiPaginationItem-root": {
                backgroundColor: "white",
                borderRadius: "20px",
                border: "1px solid black",
                boxShadow: "0px 2px 3px rgba(0, 0, 0.16, 0.5)",
                mx: 1,
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    border: "1px solid #ff469e",
                  },
                },
                fontSize: "1.25rem",
              },
              "& .MuiPaginationItem-ellipsis": {
                mt: 1.25,
                fontSize: "1.25rem",
              },
            }}
            componentsProps={{
              previous: {
                sx: {
                  fontSize: "1.5rem",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  },
                },
              },
              next: {
                sx: {
                  fontSize: "1.5rem",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  },
                },
              },
            }}
          />
        </Box>
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
