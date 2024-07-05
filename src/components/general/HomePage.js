import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Fade,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  Button,
  Badge,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import KeyboardCapslock from "@mui/icons-material/KeyboardCapslock";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { allProductApi } from "../../api/ProductAPI";
import { allStoreApi } from "../../api/StoreAPI";
import { allArticleApi } from "../../api/ArticleAPI";
import { allVoucherApi } from "../../api/VoucherAPI";
import { jwtDecode } from "jwt-decode";
import { KeyboardArrowRight } from "@mui/icons-material";
export default function HomePage() {
  const navigate = useNavigate();
  window.document.title = "Mama-Baby";
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [productWholesale, setProductWholesale] = useState([]);
  const [productGift, setProductGift] = useState([]);
  const [store, setStore] = useState([]);
  const [storeMap, setStoreMap] = useState([]);
  const [article, setArticle] = useState([]);
  const [voucher, setVoucher] = useState([]);
  const typeGIFT = "GIFT";
  const typeWHOLESALE = "WHOLESALE";

  // const handleChange = (panel) => (e, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

  const storedAccessToken = localStorage?.getItem("accessToken");
  const roleId = storedAccessToken
    ? jwtDecode(storedAccessToken)?.RoleID || null
    : null;
  if (roleId === "STAFF") {
    window.location.replace("/staff/products");
  }
  if (roleId === "ADMIN") {
    window.location.replace("/admin/dashboard");
  }

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
      // name: "Random Name #1",
      // description: "Learn Carousel!",
      image: "https://cdn1.concung.com/img/adds/2024/04/1714120748-HOME.png",
    },
    {
      // name: "Random Name #2",
      // description: "Hello World!",
      image:
        "https://cdn1.concung.com/img/adds/2024/04/1713941097-HOME-KIDESSENTIALS.png",
    },
    {
      // name: "Random Name #3",
      // description: "Bye World!",
      image: "https://cdn1.concung.com/img/adds/2024/05/1715592332-HOME.png",
    },
  ];

  // useEffect(() => {  // Old way to get data from API
  //   allAgeApi({ brand_id: 1, category_id: 4})
  //     .then((res) => {
  //       setAge(res?.data?.data);
  //       const ageMap = age.reduce((x, item) => { // Create a list of item based on id of other variables (age, brand, category, etc.) from product
  //         x[item.id] = item.rangeAge;
  //         return x;
  //       }, {});
  //       setAgeMap(ageMap);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const fetchData = async () => {
    try {
      const [
        ageRes,
        brandRes,
        categoryRes,
        productResW,
        productResG,
        storeRes,
        articleRes,
        voucherRes,
      ] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allProductApi({ type: typeWHOLESALE }),
        allProductApi({ type: typeGIFT }),
        allStoreApi(),
        allArticleApi(),
        allVoucherApi(),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productDataW = productResW?.data?.data || [];
      const productDataG = productResG?.data?.data || [];
      const storeData = storeRes?.data?.data || [];
      const articleData = articleRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProductWholesale(productDataW);
      setProductGift(productDataG);
      setStore(storeData);
      setArticle(articleData);
      setVoucher(voucherData);

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

      const storeMap = storeData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});

      setStoreMap(storeMap);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const listRef1 = useRef(null);
  const listRef2 = useRef(null);
  const listRef3 = useRef(null);
  const listRef4 = useRef(null);
  const listRef6 = useRef(null);

  const scrollLeft6 = () => {
    listRef6.current.scrollBy({ left: -460, behavior: "smooth" });
  };

  const scrollRight6 = () => {
    listRef6.current.scrollBy({ left: 460, behavior: "smooth" });
  };

  const scrollLeft1 = () => {
    listRef1.current.scrollBy({ left: -460, behavior: "smooth" });
  };

  const scrollRight1 = () => {
    listRef1.current.scrollBy({ left: 460, behavior: "smooth" });
  };
  const scrollLeft2 = () => {
    listRef2.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight2 = () => {
    listRef2.current.scrollBy({ left: 340, behavior: "smooth" });
  };
  const scrollLeft3 = () => {
    listRef3.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight3 = () => {
    listRef3.current.scrollBy({ left: 340, behavior: "smooth" });
  };
  const scrollLeft4 = () => {
    listRef4.current.scrollBy({ left: -460, behavior: "smooth" });
  };

  const scrollRight4 = () => {
    listRef4.current.scrollBy({ left: 460, behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f7fd",
      }}
    >
      <Container sx={{ py: 3 }}>
        {/* Left section */}
        {/* <Grid item xs={3}>
            <div
              sx={{
                position: "sticky",
                top: "8rem",
                border: "1px solid #ff469e",
                borderRadius: "10px",
                backgroundColor: "white",
                width: "270px",
                marginTop: visible ? "7rem" : "",
                padding: "16px 4px",
              }}
            >
              <Accordion disableGutters>
                <AccordionSummary>
                  <Typography sx={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px"}}>Filter</Typography>
                </AccordionSummary>
              </Accordion>
              <Accordion
                disableGutters
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel1"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel1" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel1" ? "white" : "black",
                    },
                    "&:hover": {
                      backgroundPosition: "top",
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      "& .MuiSvgIcon-root": {
                        color: "#ff469e",
                      },
                    },
                  }}
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Age
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container>
                    {age?.map((item) => (
                      <Grid item xs={12} lg={6}>
                        <ListItem
                          key={item.id}
                          sx={{
                            padding: "0.5rem 1rem",
                            border: "1px solid white",
                            borderRadius: "30px",
                            background:
                              "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                            backgroundSize: "200% 100%",
                            cursor: "pointer",
                            transition:
                              "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.5s ease-in-out, scale 0.5s ease-in-out",
                            "&:hover": {
                              backgroundPosition: "left",
                              border: "1px solid #ff469e",
                              color: "#ff469e",
                              scale: "0.95",
                            },
                          }}
                        >
                          <ListItemText>• {item.rangeAge}</ListItemText>
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion
                disableGutters
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel2"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel2" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel2" ? "white" : "black",
                    },
                    "&:hover": {
                      backgroundPosition: "top",
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      "& .MuiSvgIcon-root": {
                        color: "#ff469e",
                      },
                    },
                  }}
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Brand
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container>
                    {brand?.map((item) => (
                      <Grid item xs={12} lg={6}>
                        <ListItem
                          key={item.id}
                          sx={{
                            padding: "0.5rem 1rem",
                            border: "1px solid white",
                            borderRadius: "30px",
                            background:
                              "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                            backgroundSize: "200% 100%",
                            cursor: "pointer",
                            transition:
                              "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.5s ease-in-out, scale 0.5s ease-in-out",
                            "&:hover": {
                              backgroundPosition: "left",
                              border: "1px solid #ff469e",
                              color: "#ff469e",
                              scale: "0.95",
                            },
                          }}
                        >
                          <ListItemText>• {item.name}</ListItemText>
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion
                disableGutters
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel3"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel3" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel3" ? "white" : "black",
                    },
                    "&:hover": {
                      backgroundPosition: "top",
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      "& .MuiSvgIcon-root": {
                        color: "#ff469e",
                      },
                    },
                  }}
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Category
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {category?.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        padding: "0.5rem 1rem",
                        border: "1px solid white",
                        borderRadius: "30px",
                        background:
                          "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                        backgroundSize: "200% 100%",
                        cursor: "pointer",
                        transition:
                          "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.5s ease-in-out, scale 0.5s ease-in-out",
                        "&:hover": {
                          backgroundPosition: "left",
                          border: "1px solid #ff469e",
                          color: "#ff469e",
                          scale: "0.95",
                        },
                      }}
                    >
                      <ListItemText>• {item.name}</ListItemText>
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid> */}
        {/* Right Section */}
        {/* Banner */}
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
              {/* <Typography variant="h5" gutterBottom>
                {item.name}
              </Typography>
              <Typography variant="body1">{item.description}</Typography> */}
            </div>
          ))}
        </Carousel>
        {/* Sample */}
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
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
              onClick={scrollLeft1}
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
              ref={listRef1}
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
                    sx={{
                      flex: 1,
                      borderRight: "dash",
                      borderRadius: "10px",
                    }}
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
              onClick={scrollRight1}
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
              Best Rating
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  cursor: "pointer",
                  fontWeight: "bold",
                  mt: 0.25,
                }}
                onClick={() => {
                  navigate("/products");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                See all products
              </Typography>
              <KeyboardArrowRight
                sx={{ color: "#ff469e"}}
              />
            </Box>
          </Box>
          {/* List */}
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
              onClick={scrollLeft2}
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
              ref={listRef2}
              sx={{
                display: "flex",
                overflowX: "hidden",
                scrollBehavior: "smooth",
                width: "100%",
                padding: "0px 8px",
              }}
            >
              {productWholesale?.products?.map((item, index) => (
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
                    onClick={() => (
                      navigate(
                        `/products/${item.name
                          .toLowerCase()
                          .replace(/\s/g, "-")}`,
                        { state: { productId: item.id } }
                      ),
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    )}
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          item.image_url.includes("Product_")
                            ? `http://localhost:8080/mamababy/products/images/${item.image_url}`
                            : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                        }
                        onError={(e) => {
                          e.target.src =
                            "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                        }}
                        style={{ width: "64px", height: "64px" }}
                      />
                    </div>
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
                      sx={{
                        color: "gray",
                        textAlign: "left",
                      }}
                    >
                      {formatCurrency(item.price)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "gray",
                        textAlign: "left",
                      }}
                    >
                      {brandMap[item.brand_id]} |{" "}
                      {categoryMap[item.category_id]}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <IconButton
              onClick={scrollRight2}
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
              Gift products
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  cursor: "pointer",
                  fontWeight: "bold",
                  mt: 0.25,
                }}
                onClick={() => {
                  navigate("/productgift");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                See all gifts
              </Typography>
              <KeyboardArrowRight
                sx={{ color: "#ff469e"}}
              />
            </Box>
          </Box>
          {/* List */}

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
              onClick={scrollLeft3}
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
              ref={listRef3}
              sx={{
                display: "flex",
                overflowX: "hidden",
                scrollBehavior: "smooth",
                width: "100%",
                padding: "0px 8px",
              }}
            >
              {productGift?.products?.map((item, index) => (
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
                    onClick={() => (
                      navigate(
                        `/productgiftdetail/${item.name
                          .toLowerCase()
                          .replace(/\s/g, "-")}`,
                        { state: { productId: item.id } }
                      ),
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    )}
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
                    <Typography
                      variant="h5"
                      sx={{
                        mb: "10px",
                        fontWeight: "bold",
                        backgroundColor: "#ff469e",
                        color: "white",
                        marginLeft: "auto",
                        fontSize: "1rem",
                        textAlign: "right",
                        width: "20%",
                      }}
                    >
                      {item.type}{" "}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          item.image_url.includes("Product_")
                            ? `http://localhost:8080/mamababy/products/images/${item.image_url}`
                            : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                        }
                        onError={(e) => {
                          e.target.src =
                            "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                        }}
                        style={{ width: "64px", height: "64px" }}
                      />
                    </div>

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
                      sx={{
                        color: "gray",
                        textAlign: "left",
                      }}
                    >
                      {brandMap[item.brand_id]} |{" "}
                      {categoryMap[item.category_id]}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <IconButton
              onClick={scrollRight3}
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
        {/* <div>
              {product?.products?.map((item) => (
                <Typography>
                  {item.name} ${item.price} Age: {ageMap[item.age_id]} Brand:{" "}
                  {brandMap[item.brand_id]} Category:{" "}
                  {categoryMap[item.category_id]}
                </Typography>
              ))}
            </div> */}
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
              Stores
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  cursor: "pointer",
                  fontWeight: "bold",
                  mt: 0.25,
                }}
                onClick={() => navigate("/stores")}
              >
                See all stores
              </Typography>
              <KeyboardArrowRight
                sx={{ color: "#ff469e"}}
              />
            </Box>
          </Box>
          {/* List */}
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
              onClick={scrollLeft4}
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
              ref={listRef4}
              sx={{
                display: "flex",
                overflowX: "hidden",
                scrollBehavior: "smooth",
                width: "100%",
                padding: "0px 8px",
              }}
            >
              {store?.stores?.map((item, index) => (
                <Box
                  key={index}
                  onClick={() => (
                    navigate(
                      `/stores/${item.id}`,

                      { state: { storeId: item.id } }
                    ),
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  )}
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/store-logo-design%2C-online-shopping-store-logo-template-f16f818774fd63dead3a940d57b6c71d_screen.jpg?ts=1658656234"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                      }}
                      style={{ width: "64px", height: "64px" }}
                    />
                  </div>
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
                    {item.name_store}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {item.address}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {item.phone}
                  </Typography>
                </Box>
              ))}
            </Box>
            <IconButton
              onClick={scrollRight4}
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
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Articles
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  cursor: "pointer",
                  fontWeight: "bold",
                  mt: 0.25,
                }}
                onClick={() => {
                  navigate("/articles");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                See all articles
              </Typography>
              <KeyboardArrowRight
                sx={{ color: "#ff469e"}}
              />
            </Box>
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
              onClick={scrollLeft6}
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
              ref={listRef6}
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
                    minWidth: 300,
                    padding: 2,
                    textAlign: "center",
                    border: "1px solid #f5f7fd",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    marginRight: 2,
                    backgroundColor: "white",
                    transition: "border 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      border: "1px solid #ff496e",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        item.link_image && item.link_image.includes("Article_")
                          ? `http://localhost:8080/mamababy/products/images/${item.link_image}`
                          : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                      }}
                      alt={item.header}
                      style={{
                        width: "250px",
                        height: "140px",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  </Box>

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
                    {item.header.length > 40
                      ? `${item.header.substring(0, 40)}...`
                      : item.header}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "gray", textAlign: "left" }}
                  >
                    {item.content.length > 100
                      ? `${item.content.substring(0, 100)}...`
                      : item.content}
                  </Typography>
                </Box>
              ))}
            </Box>
            <IconButton
              onClick={scrollRight6}
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
