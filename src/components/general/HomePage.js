import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  //   allAgeApi()
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
      const [ageRes, brandRes, categoryRes, productRes] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allProductApi(),
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
    fetchData();
  }, []);
  useEffect(() => {
    allStoreApi()
      .then((res) => setStore(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

  const listRef = useRef(null);

  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: 340, behavior: "smooth" });
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
                      <ListItemText>• {item.nameStore}</ListItemText>
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
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", marginTop: "0.5rem" }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        ${item.price}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        {brandMap[item.brand_id]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <IconButton
                  onClick={scrollRight}
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
            {/* <div>
              {product?.products?.map((item) => (
                <Typography>
                  {item.name} ${item.price} Age: {ageMap[item.age_id]} Brand:{" "}
                  {brandMap[item.brand_id]} Category:{" "}
                  {categoryMap[item.category_id]}
                </Typography>
              ))}
            </div> */}
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
