import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { productByIdApi } from "../../api/ProductAPI";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import ShopIcon from "@mui/icons-material/Shop";
import { allStoreApi } from "../../api/StoreAPI";
import { useNavigate } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Rating } from "@mui/material";
import Cart from "@mui/icons-material/ShoppingCart";
import { KeyboardCapslock } from "@mui/icons-material";
import { addToCart } from "../../redux/CartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function ProductDetails() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
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
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const typeWholeSale = "WHOLESALE";
  const [store, setStore] = useState([]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const extractDescriptionDetails = (description) => {
    const [
      weight,
      unit,
      brandOrigin,
      manufacturedAt,
      manufacturer,
      ingredient,
      usageInstructions,
      storageInstructions,
    ] = description.split("|");

    return {
      weight,
      unit,
      brandOrigin,
      manufacturedAt,
      manufacturer,
      ingredient,
      usageInstructions,
      storageInstructions,
    };
  };

  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes, storeRes] =
        await Promise.all([
          allAgeApi(),
          allBrandApi(),
          allCategorytApi(),
          productByIdApi(productId),
          allStoreApi(),
        ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || {};
      const storeData = storeRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);
      setStore(storeData);

      const details = extractDescriptionDetails(productData.description);
      setDetails(details);

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

  window.document.title = `${product?.name}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  if (!product) {
    window.document.title = "Loading...";
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
    // if(quantity == 0){
    //   toast.warn(`No item's quantity selected`);
    //   return;
    // }
    toast.info(`${product.name} x ${quantity} was added to cart`, {
      position: "top-right",
      autoClose: 2500,
    });
    dispatch(
      addToCart({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          point: product.point,
          type: product.type,
          store_id: product.store_id,
        },
        quantity: quantity,
      })
    );
  };

  // Helper function to format date as "yyyy-mm-dd"
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Inside your component
  const today = formatDate(new Date());

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
            to="/productgift"
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
              Products Gift
            </Typography>
          </Link>
          <Typography
            sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
          >
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Container>
      {product.type === typeWholeSale ||
      product.is_active === false ||
      (product.expiryDate && product.expiryDate <= today) ? (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{
            marginBottom: 1,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: "1.5rem",
          }}
        >
          No product available
        </Typography>
      ) : (
        <Box>
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
                          src={
                            product.image_url.includes("Product_")
                              ? `http://localhost:8080/mamababy/products/images/${product.image_url}`
                              : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                          }
                          onError={(e) => {
                            e.target.src =
                              "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                          }}
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="h6" sx={{ textAlign: "left" }}>
                            {product.point}
                          </Typography>
                          <MonetizationOnIcon
                            variant="h6"
                            sx={{
                              marginLeft: "4px",
                              fontSize: 24,
                            }}
                          />
                        </Box>
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
                            disabled={quantity <= 1}
                            onClick={() =>
                              setQuantity((prevQuantity) =>
                                Math.max(1, prevQuantity - 10)
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
                            disabled={quantity <= 1}
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
                            disabled={quantity >= 99}
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
                            disabled={quantity >= 99}
                            onClick={() =>
                              setQuantity((prevQuantity) =>
                                Math.min(99, prevQuantity + 10)
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
          <Container sx={{ my: 4, mt: 15 }}>
            <Typography
              variant="h4"
              sx={{ mb: 4, textAlign: "start", color: "#ff469e" }}
            >
              <Container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  marginBottom: "24px",
                  width: "100%",
                  maxWidth: "800px",
                  // backgroundImage:
                  //   "linear-gradient(45deg, #FAD0C4 30%, #FFD1DC 90%)",
                  backgroundImage:
                    "linear-gradient(45deg, #FCE4EC 50%, #FCE4EB 50%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZJVlDPE_mC28sugfpG-HdgSViHPXDHL5ww&s"
                    alt="Shop Logo"
                    style={{
                      borderRadius: "50%",
                      marginRight: "16px",
                      height: "75px",
                      width: "75px",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#000000" }}
                    >
                      {store?.stores?.map((item, index) =>
                        item.id === product.store_id
                          ? item.name_store.toUpperCase()
                          : ""
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          border: "2px solid #ff469e",
                          color: "#ff469e",
                          backgroundColor: "#fff",
                          marginRight: "8px",
                          fontSize: "0.75rem",
                          padding: "3px 6px",
                          borderRadius: "20px",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <CheckCircleIcon
                          sx={{ marginRight: "4px", color: "#ff469e" }}
                        />{" "}
                        Authentic
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      marginRight: "8px",
                      borderColor: "#ff469e",
                      color: "#ff469e",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "20px",
                      transition:
                        "transform 0.3s ease-in-out, border-color 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        borderColor: "#ff469e",
                        color: "#ff469e",
                      },
                    }}
                    onClick={() => (
                      navigate(
                        `/stores/${product.store_id}`,

                        { state: { storeId: product.store_id } }
                      ),
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    )}
                  >
                    <ShopIcon
                      sx={{
                        marginRight: "4px",
                        color: "#ff469e",
                        verticalAlign: "middle",
                      }}
                    />
                    <Typography
                      sx={{
                        verticalAlign: "middle",
                        lineHeight: 1,
                      }}
                    >
                      Visit Shop
                    </Typography>
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      marginRight: "8px",
                      borderColor: "#ff469e",
                      color: "#ff469e",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "20px",
                      transition:
                        "transform 0.3s ease-in-out, border-color 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        borderColor: "#ff469e",
                        color: "#ff469e",
                      },
                    }}
                  >
                    + Follow
                  </Button>
                </Box>
                <Box>
                  <Typography variant="body2">
                    Followers:{" "}
                    <span style={{ color: "#ff469e", fontWeight: "bold" }}>
                      1K
                    </span>
                  </Typography>
                  <Typography variant="body2">
                    Satisfaction:{" "}
                    <span style={{ color: "#ff469e", fontWeight: "bold" }}>
                      100%
                    </span>
                  </Typography>
                  <Typography variant="body2">
                    Ratings:{" "}
                    <span style={{ color: "#ff469e", fontWeight: "bold" }}>
                      5.0 / 5.0
                    </span>
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckIcon sx={{ color: "green", marginRight: "4px" }} />{" "}
                    100% Quality
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckIcon sx={{ color: "green", marginRight: "4px" }} />{" "}
                    Authentic Distribution
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <CheckIcon sx={{ color: "green", marginRight: "4px" }} />{" "}
                    Easy Returns
                  </Typography>
                </Box>
              </Container>
            </Typography>
          </Container>
          <Container sx={{ my: 4 }}>
            <Typography
              variant="h4"
              sx={{ mb: 4, textAlign: "start", color: "#ff469e" }}
            >
              Product Gift Details
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}
            >
              <Table>
                <TableBody>
                  <TableRow
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        borderBottom: "1px solid #ffb3d9",
                      }}
                    >
                      Weight
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "75%",
                        borderBottom: "1px solid #ffb3d9",
                        color: "#333",
                      }}
                    >
                      {details.weight} {details.unit}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        borderBottom: "1px solid #ffb3d9",
                      }}
                    >
                      Brand Origin
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "75%",
                        borderBottom: "1px solid #ffb3d9",
                        color: "#333",
                      }}
                    >
                      {details.brandOrigin}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        borderBottom: "1px solid #ffb3d9",
                      }}
                    >
                      Manufactured At
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "75%",
                        borderBottom: "1px solid #ffb3d9",
                        color: "#333",
                      }}
                    >
                      {details.manufacturedAt}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        borderBottom: "1px solid #ffb3d9",
                      }}
                    >
                      Manufacturer
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "75%",
                        borderBottom: "1px solid #ffb3d9",
                        color: "#333",
                      }}
                    >
                      {details.manufacturer}
                    </TableCell>
                  </TableRow>
                  {expanded && (
                    <>
                      <TableRow
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderBottom: "1px solid #ffb3d9",
                          }}
                        >
                          Usage Instructions
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "75%",
                            borderBottom: "1px solid #ffb3d9",
                            color: "#333",
                          }}
                        >
                          {details.usageInstructions}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderBottom: "1px solid #ffb3d9",
                          }}
                        >
                          Storage Instructions
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "75%",
                            borderBottom: "1px solid #ffb3d9",
                            color: "#333",
                          }}
                        >
                          {details.storageInstructions}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#fff4fc" },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderBottom: "1px solid #ffb3d9",
                          }}
                        >
                          Ingredient
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "75%",
                            borderBottom: "1px solid #ffb3d9",
                            color: "#333",
                          }}
                        >
                          {details.ingredient}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleToggle}
                sx={{
                  backgroundColor: "#f5f7fd",
                  color: "#ff469e",
                  borderRadius: "10px",
                  fontSize: 16,
                  fontWeight: "bold",
                  mr: 2,
                  padding: "0.25rem 0.5rem",
                  boxShadow: "none",
                  transition:
                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                    border: "1px solid white",
                  },
                }}
              >
                {expanded ? "Show Less" : "Show More"}
              </Button>
            </Box>
          </Container>
        </Box>
      )}
    </div>
  );
}
