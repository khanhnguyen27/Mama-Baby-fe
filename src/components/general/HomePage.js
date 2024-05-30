import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
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
export default function HomePage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [storeMap, setStoreMap] = useState([]);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
      name: "Random Name #1",
      description: "Learn Carousel!",
      image: "https://cdn1.concung.com/img/adds/2024/04/1714120748-HOME.png",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      image:
        "https://cdn1.concung.com/img/adds/2024/04/1713941097-HOME-KIDESSENTIALS.png",
    },
    {
      name: "Random Name #3",
      description: "Bye World!",
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
      const [ageRes, brandRes, categoryRes, productRes, storeRes] =
        await Promise.all([
          allAgeApi(),
          allBrandApi(),
          allCategorytApi(),
          allProductApi(),
          allStoreApi(),
        ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const storeData = storeRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);
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

  useEffect(() => {
    allStoreApi()
      .then((res) => setStore(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

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

  return (
    <div
      style={{
        backgroundColor: "#f5f7fd",
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Left section */}
          <Grid item xs={3}>
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
              {/* <Accordion disableGutters>
                <AccordionSummary>
                  <Typography sx={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px"}}>Filter</Typography>
                </AccordionSummary>
              </Accordion> */}
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
              <Accordion
                disableGutters
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel4"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel4" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel4" ? "white" : "black",
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
                    Store
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {store?.stores?.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        padding: "0.5rem 1rem",
                        borderRadius: "30px",
                        background:
                          "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                        backgroundSize: "200% 100%",
                        cursor: "pointer",
                        transition:
                          "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        "&:hover": {
                          backgroundPosition: "left",
                          color: "#ff469e",
                          border: "1px solid #ff496e",
                        },
                      }}
                    >
                      <ListItemText>• {item.name_store}</ListItemText>
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
          {/* Right Section */}
          <Grid item xs={9}>
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
                  <Typography variant="h5" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body1">{item.description}</Typography>
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
                  Some of our products
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ff469e",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate("/products")}
                >
                  See more products
                </Typography>
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
                  {product?.products?.map((item, index) => (
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
                          ${item.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "gray",
                            textAlign: "left",
                          }}
                        >
                          {brandMap[item.brand_id]}
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
                  Some of stores
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ff469e",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate("/stores")}
                >
                  See more stores
                </Typography>
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
                  ref={listRef2}
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
                      sx={{
                        minWidth: 120,
                        padding: 2,
                        textAlign: "center",
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
                        style={{ width: "50px", height: "65px" }}
                        src="data:image/png;base64,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"
                      ></img>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", marginTop: "0.5rem" }}
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
                  onClick={scrollRight2}
                  size="small"
                  sx={{
                    position: "absolute",
                    right: -8,
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
