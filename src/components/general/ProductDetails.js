import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { productByIdApi } from "../../api/ProductAPI";
import {
  Box,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  ButtonGroup,
  Breadcrumbs,
  Container,
  Badge,
  IconButton,
} from "@mui/material";
import Cart from "@mui/icons-material/ShoppingCart";
import { KeyboardCapslock } from "@mui/icons-material";
import { addToCart } from "../../redux/CartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [product, setProduct] = useState(null);
  const productId = state?.productId;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        productByIdApi(productId),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || {};

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
      if (productId) {
        fetchData();
      }
    }, 1000);
  }, [productId]);

  if (!product) {
    return (
      <Box
        sx={{
          backgroundColor: "#f5f7fd",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#ff469e" }} size={90} />
      </Box>
    );
  }

  const handleAddToCart = () => {
    if(quantity == 0){
      toast.warn(`No item's quantity selected`);
      return;
    }
    toast.info(`${product.name} x ${quantity} was added to cart`, {
      position: "top-right",
    });
    dispatch(
      addToCart({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        quantity: quantity,
      })
    );
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
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
            to="/products"
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
              Products
            </Typography>
          </Link>
          <Typography
            sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
          >
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Container>
      <Container
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Badge
          badgeContent={product.type}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiBadge-badge": {
              transform: "rotate(45deg)",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: "#ff469e",
              borderRadius: "0 4px 4px 0",
              padding: "5px 10px",
              position: "absolute",
              top: product.type == "WHOLESALE" ? "65px" : "40px",
              right: product.type == "WHOLESALE" ? "-20px" : "0px",
              boxShadow: "0 0 0 3px white",
            },
          }}
        >
          <Card
            style={{
              backgroundColor: "#fff4fc",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.24)",
              border: "3px solid #ff469e",
              color: "black",
              padding: "20px",
              maxWidth: "900px",
              width: "60vw",
              margin: "0 auto",
            }}
          >
            <CardContent>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={4}>
                  <Paper
                    style={{
                      padding: "10px",
                      backgroundColor: "#ffe6f0",
                      textAlign: "center",
                    }}
                  >
                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                      src="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                      alt={product.name}
                    />
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={8}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Typography variant="h6">Brand:</Typography>
                    <Typography
                      variant="h6"
                      style={{ color: "#ff469e", fontWeight: "bold" }}
                    >
                      {brandMap[product.brand_id]}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h5"
                      style={{
                        wordWrap: "break-word",
                        fontWeight: "600",
                        textAlign: "left",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "left" }}>
                      ${product.price}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Typography variant="h6">Age Range:</Typography>
                    <Typography
                      variant="h6"
                      style={{
                        border: "1px solid #ff469e",
                        color: "#ff469e",
                        fontWeight: "bold",
                        padding: "0 8px",
                      }}
                    >
                      {ageMap[product.age_id]}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Typography variant="h6">Category:</Typography>
                    <Typography
                      variant="h6"
                      style={{
                        border: "1px solid #ff469e",
                        color: "#ff469e",
                        fontWeight: "bold",
                        padding: "0 8px",
                      }}
                    >
                      {categoryMap[product.category_id]}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Typography>{product.description}</Typography>
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                      style={{ height: "2.5rem" }}
                    >
                      <Button
                        variant="contained"
                        disabled={quantity < 1}
                        onClick={() =>
                          setQuantity((prevQuantity) =>
                            Math.max(0, prevQuantity - 10)
                          )
                        }
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "20px",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          boxShadow: "none",
                          transition:
                            "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                          border: "1px solid #ff469e",
                          "&:hover": {
                            backgroundColor: "#ff469e",
                            color: "white",
                          },
                        }}
                      >
                        --
                      </Button>
                      <Button
                        variant="contained"
                        disabled={quantity < 1}
                        onClick={() => setQuantity(quantity - 1)}
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          boxShadow: "none",
                          transition:
                            "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                          border: "1px solid #ff469e",
                          "&:hover": {
                            backgroundColor: "#ff469e",
                            color: "white",
                          },
                        }}
                      >
                        -
                      </Button>
                      <Button
                        disableRipple
                        style={{
                          backgroundColor: "white",
                          fontSize: "1.25rem",
                          width: "4rem",
                          cursor: "default",
                          border: "1px solid #ff469e",
                          color: "black",
                        }}
                      >
                        {quantity}
                      </Button>
                      <Button
                        variant="contained"
                        disabled={quantity > 99}
                        onClick={() => setQuantity(quantity + 1)}
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          boxShadow: "none",
                          transition:
                            "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                          border: "1px solid #ff469e",
                          "&:hover": {
                            backgroundColor: "#ff469e",
                            color: "white",
                          },
                        }}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        disabled={quantity > 99}
                        onClick={() =>
                          setQuantity((prevQuantity) =>
                            Math.min(100, prevQuantity + 10)
                          )
                        }
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "20px",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          boxShadow: "none",
                          transition:
                            "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                          border: "1px solid #ff469e",
                          "&:hover": {
                            backgroundColor: "#ff469e",
                            color: "white",
                          },
                        }}
                      >
                        ++
                      </Button>
                    </ButtonGroup>
                    <Button
                      variant="contained"
                      onClick={handleAddToCart}
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "20px",
                        fontSize: "0.95rem",
                        fontWeight: "bold",
                        boxShadow: "none",
                        transition:
                          "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        border: "1px solid #ff469e",
                        "&:hover": {
                          backgroundColor: "#ff469e",
                          color: "white",
                        },
                      }}
                    >
                      <Cart sx={{ mr: 1 }} />
                      ADD TO CART
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Badge>
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

{
  /* <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Price
                    </Typography>
                    <Typography style={{ color: "black" }}>
                      ${product.price}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Brand
                    </Typography>
                    <Typography style={{ color: "black" }}>
                      {brandMap[product.brand_id]}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Category
                    </Typography>
                    <Typography style={{ color: "black" }}>
                      {categoryMap[product.category_id]}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Age Range
                    </Typography>
                    <Typography style={{ color: "black" }}>
                      {ageMap[product.age_id]}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Status
                    </Typography>
                    <Typography style={{ color: "black" }}>
                      {product.status}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Type
                    </Typography>
                    <Typography style={{ color: "black" }}>
                      {product.type}
                    </Typography>
                  </div>
                </Grid>
              </Grid> 
              <Button><Cart /></Button>
              */
}