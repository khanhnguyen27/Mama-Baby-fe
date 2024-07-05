import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { productByIdApi } from "../../api/ProductAPI";
import { commentByProductIdApi } from "../../api/CommentAPI";
import { format } from "date-fns";
import { allUserApi } from "../../api/UserAPI";
import { updateCommentApi, createCommentApi } from "../../api/CommentAPI";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Send from "@mui/icons-material/Send";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Refund from "@mui/icons-material/CurrencyExchange";
import ShopIcon from "@mui/icons-material/Shop";
import { allStoreApi } from "../../api/StoreAPI";
import {
  Star,
  StarHalf,
  StarOutline,
  StarQuarter,
  StarThreeQuarter,
  VerifiedUser,
} from "@mui/icons-material";
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
  colors,
  Menu,
  MenuItem,
  TextField,
  Avatar,
  Modal,
  LinearProgress,
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
import { useNavigate } from "react-router-dom";

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
  const [comment, setComment] = useState([]);
  const [visibleComments, setVisibleComments] = useState(5);
  const productId = state?.productId;
  const [quantity, setQuantity] = useState(1);
  const isComment = comment?.length;
  const [userMap, setUserMap] = useState({});
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditComment, setOpenEditComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [emptyStars, setEmptyStars] = useState(0);
  const [halfStar, setHalfStar] = useState(0);
  const [fullStars, setFullStars] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const typeGift = "GIFT";
  const [store, setStore] = useState([]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const accessToken = localStorage.getItem("accessToken");

  var username = "";
  var userId = 0;
  if (accessToken && typeof accessToken === "string") {
    try {
      const decodedAccessToken = jwtDecode(accessToken);
      userId = decodedAccessToken.UserID;
      username = decodedAccessToken.FullName;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  } else {
    console.warn("Invalid token specified: must be a string");
  }

  const [ratingArr, setRatingArr] = useState([0, 0, 0, 0, 0]);

  const avatarUrl = "https://via.placeholder.com/150";
  const dateTime = format(new Date(), "Ppp");

  const handleMenuClick = (event, item) => {
    setAnchorEl({ element: event.currentTarget, id: item.id });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditComment = (item) => {
    handleMenuClose();
    setSelectedComment(item);
    setOpenEditComment(true);
  };

  const handleChange = (field, value) => {
    if (field === "rating") {
      // Convert value to integer and ensure it's within the valid range (0 to 5)
      const intValue = parseInt(value);
      if (!isNaN(intValue) && intValue >= 0 && intValue <= 5) {
        setSelectedComment((prevComment) => ({
          ...prevComment,
          [field]: intValue,
        }));
      }
    } else {
      setSelectedComment((prevComment) => ({
        ...prevComment,
        [field]: value,
      }));
    }
  };

  const handleCloseEditComment = () => {
    setOpenEditComment(false);
    setSelectedComment(null);
  };

  const handleEditComment = async () => {
    if (selectedComment?.rating === 0) {
      toast.warn("Please select a rating.");
      return;
    }

    if (selectedComment?.comment.length < 20) {
      toast.warn("Please enter a comment of at least 20 characters.");
      return;
    }

    await updateCommentApi(
      selectedComment?.id,
      selectedComment?.rating,
      selectedComment?.comment,
      userId
    )
      .then((response) => {
        fetchData();
        handleCloseEditComment();
        toast.success("Comment Edit successfully!");
      })
      .catch((error) => {
        toast.error("Failed to edit comment. Please try again later.");
      });
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
      const [
        ageRes,
        brandRes,
        categoryRes,
        userRes,
        productRes,
        commentRes,
        storeRes,
      ] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allUserApi(),
        productByIdApi(productId),
        commentByProductIdApi(productId),
        allStoreApi(),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const userData = userRes?.data?.data || [];
      const productData = productRes?.data?.data || {};
      const commentData = commentRes?.data?.data || null;
      const storeData = storeRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setUser(userData);
      setProduct(productData);
      setComment(commentData);
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

      const userMap = userData.reduce((x, item) => {
        x[item.id] = item.full_name;
        return x;
      }, {});
      setUserMap(userMap);

      if (!commentData || commentData.length === 0) {
        const averageRating = 0;
        const fullStars = 0;
        const halfStar = false;
        const emptyStars = 5;

        setFullStars(fullStars);
        setHalfStar(halfStar);
        setEmptyStars(emptyStars);
        setAverageRating(averageRating);
        setTotalRating(0);
        setRatingArr([0, 0, 0, 0, 0]);
      } else {
        const productComments = commentData.filter(
          (x) => x.product_id === productData.id
        );

        const averageRating = productComments.length
          ? (
              productComments.reduce((acc, cmt) => acc + cmt.rating, 0) /
              productComments.length
            ).toFixed(1)
          : 0;

        const fullStars = Math.floor(averageRating);
        const halfStar = averageRating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        setFullStars(fullStars);
        setHalfStar(halfStar);
        setEmptyStars(emptyStars);
        setAverageRating(averageRating);
        setTotalRating(productComments.length);

        const ratingArr = [0, 0, 0, 0, 0];
        productComments.forEach((comment) => {
          if (comment.rating >= 1 && comment.rating <= 5) {
            ratingArr[5 - comment.rating]++;
          }
        });

        setRatingArr(ratingArr);
      }
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

  //Add comment

  const [rating, setRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const maxCharacters = 2000;

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setCommentInput(value);
    }
  };

  const handleKeyDown = (e) => {
    if (
      commentInput.length >= maxCharacters &&
      e.key !== "Backspace" &&
      e.key !== "Delete"
    ) {
      e.preventDefault();
    }
  };

  const handleComment = async () => {
    if (rating === 0) {
      toast.warn("Please select a rating.");
      return;
    }

    if (commentInput.length < 20) {
      toast.warn("Please enter a comment of at least 20 characters.");
      return;
    }

    await createCommentApi(product.id, rating, commentInput, userId)
      .then((response) => {
        fetchData();
        setRating(0);
        setCommentInput("");
        toast.success("Comment added successfully!");
      })
      .catch((error) => {
        toast.error("Failed to add comment. Please try again later.");
      });
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
    if (product.status === "OUT OF STOCK") {
      toast.error(`Cannot add this product to cart`, {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }
    if (product.status === "IN STOCK") {
      toast.info(`${product.name} x ${quantity} was added to cart`, {
        position: "top-right",
        autoClose: 1500,
      });
    }
    dispatch(
      addToCart({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          point: product.point,
          remain: product.remain,
          type: product.type,
          store_id: product.store_id,
          image_url: product.image_url,
        },
        quantity: quantity,
      })
    );
  };

  const handleShowMore = () => {
    setVisibleComments((prevVisibleComments) => prevVisibleComments + 5);
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
      {product.type === typeGift ||
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
                  maxWidth: "1500px",
                  width: "72vw",
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
                      <Box sx={{ display: "flex", mt: 1.5 }}>
                        <Refund
                          sx={{
                            color: "#ff469e",
                            fontSize: "1.5rem",
                            mr: 1,
                            pt: 1,
                          }}
                        />
                        <Typography
                          sx={{ color: "black", fontSize: "1.2rem", mt: 0.7 }}
                        >
                          15 days for exchange/refund
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", mt: 1.5 }}>
                        <VerifiedUser
                          sx={{
                            color: "#ff469e",
                            fontSize: "1.5rem",
                            mr: 1,
                            pt: 1,
                          }}
                        />
                        <Typography
                          sx={{ color: "black", fontSize: "1.2rem", mt: 0.7 }}
                        >
                          100% genuine product
                        </Typography>
                      </Box>
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
                          {product.status === "OUT OF STOCK" && (
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                fontSize: "1rem",
                                opacity: 0.5,
                              }}
                            >
                              ({product.status})
                            </span>
                          )}
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            style={{ textAlign: "left" }}
                          >
                            {formatCurrency(product.price)}
                          </Typography>
                          <Typography
                            variant="h6"
                            style={{ textAlign: "right" }}
                          >
                            Remain qty:{" "}
                            <span
                              style={{ color: "#ff469e", fontWeight: "600" }}
                            >
                              {product.remain}
                            </span>
                          </Typography>
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
                      {/* <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Typography>{product.description}</Typography>
                  </div> */}
                      {product.status !== "OUT OF STOCK" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 6,
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
                              disabled={
                                quantity >= 99 || quantity >= product.remain
                              }
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
                              disabled={
                                quantity >= 99 || quantity >= product.remain
                              }
                              onClick={() =>
                                setQuantity((prevQuantity) =>
                                  Math.min(
                                    99,
                                    product.remain,
                                    prevQuantity + 10
                                  )
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
                      )}
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
                <Box sx={{ display: "flex", alignItems: "center" }}></Box>
                {/* <Box>
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
                </Box> */}
                <Box>
                  <Button
                    variant="outlined"
                    sx={{
                      mr: 0.5,
                      mb: 2,
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
                      navigate(`/stores/${product.store_id}`, {
                        state: { storeId: product.store_id },
                      }),
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    )}
                  >
                    <ShopIcon
                      sx={{
                        mr: 1,
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
              Product Details
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
                  border: "1px solid #f5f7fd",
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
          <Container sx={{ my: 4 }}>
            <Typography
              variant="h4"
              sx={{ mb: 4, textAlign: "start", color: "#ff469e" }}
            >
              Comments
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Grid
                container
                spacing={2}
                className="rating-table row-small align-middle"
                mb={5}
              >
                {/* Điểm đánh giá trung bình */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Box className="rating-table__total" textAlign="center">
                    <Typography variant="h1" className="rating_total">
                      {averageRating !== 0 ? averageRating : ""}
                    </Typography>
                    <Typography variant="h4" className="rating_total">
                      {typeof averageRating === "number" &&
                        averageRating === 0 &&
                        "No reviews yet"}
                    </Typography>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      className="star-rating-custom"
                      sx={{ mt: 0 }}
                    >
                      <Typography variant="h6">
                        {Array(fullStars).fill(
                          <Star
                            style={{ color: "#ff469e", fontSize: "36px" }}
                          />
                        )}
                        {halfStar && (
                          <StarHalf
                            style={{ color: "#ff469e", fontSize: "36px" }}
                          />
                        )}
                        {Array(emptyStars).fill(
                          <StarOutline
                            style={{ color: "#ff469e", fontSize: "36px" }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        className="title-rating"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="body2" component="span">
                          Total{" "}
                        </Typography>
                        <PersonIcon
                          sx={{
                            ml: 1,
                            mr: 1,
                            width: 24,
                            height: 24,
                            color: "inherit",
                          }}
                        />
                        <Typography variant="body2" component="span">
                          {totalRating}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Thanh thanh đánh giá từng sao */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Box className="rating-table__bar">
                    <div className="bar-star">
                      {ratingArr.map((rating, index) => {
                        const ratingPer = Math.round(
                          (rating / totalRating) * 100
                        );
                        const starIndex = 5 - index;
                        var barColor =
                          totalRating === 0 ? "#e0e0e0" : "#ff469e";

                        return (
                          <Box key={index} display="flex" alignItems="center">
                            <Typography
                              variant="body1"
                              sx={{ flex: "0 0 auto", minWidth: 50 }}
                            >
                              <Grid
                                sx={{
                                  padding: "0 0 5px 0",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <StarIcon style={{ color: "#ff469e" }} />
                                {starIndex}
                              </Grid>
                            </Typography>
                            <Box sx={{ width: 300 }}>
                              <LinearProgress
                                variant="determinate"
                                value={ratingPer}
                                sx={{
                                  height: 8,
                                  borderRadius: 5,
                                  backgroundColor: "#e0e0e0", // Màu nền nhạt khi ratingPer là 0
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: barColor, // Màu sắc thanh tiến trình
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {rating}
                            </Typography>
                          </Box>
                        );
                      })}
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <>
              {userId !== 0 && (
                <Box
                  component="form"
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#fff4fc",
                    padding: 2,
                    mb: 4,
                    position: "relative",
                  }}
                >
                  <Grid container alignItems="center" spacing={2} mb={2}>
                    <Grid item>
                      <Avatar>
                        <PersonIcon
                          sx={{
                            ml: 1,
                            mr: 1,
                            width: 24,
                            height: 24,
                            color: "inherit",
                          }}
                        />
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">{username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {dateTime}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Rating
                    name="star-rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    sx={{
                      mb: 2,
                      "& .MuiRating-iconFilled": {
                        color: "#ff469e",
                      },
                      "& .MuiRating-iconHover": {
                        color: "#ff69b4",
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write a comment..."
                    variant="outlined"
                    value={commentInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label="submit comment"
                          sx={{ p: "10px", color: "#ff469e" }}
                          onClick={handleComment}
                        >
                          <Send />
                        </IconButton>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ff469e",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ff69b4",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ff469e",
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      p: "10px",
                      color: "gray",
                      fontSize: "0.8rem",
                    }}
                  >
                    {`${commentInput.length}/${maxCharacters}`}
                  </Box>
                </Box>
              )}
            </>

            {isComment ? (
              [...comment] // Tạo bản sao của mảng comment trước khi sắp xếp
                .sort((a, b) =>
                  a.user_id === userId ? -1 : b.user_id === userId ? 1 : 0
                )
                .slice(0, visibleComments)
                .map((item, index) => (
                  <Card
                    key={item.id}
                    sx={{
                      backgroundColor: "#fff4fc",
                      boxShadow:
                        "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
                      border: "1px solid #e0e0e0",
                      color: "#333",
                      padding: "5px",
                      position: "relative",
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={2.5}>
                          <Paper
                            sx={{
                              padding: "10px",
                              backgroundColor: "#ffe6f0",
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h6">
                              {userMap[item.user_id]}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(item.date).toLocaleString()}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={9.5}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Rating
                              value={item.rating}
                              readOnly
                              sx={{
                                "& .MuiRating-iconFilled": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          </Box>

                          <Typography variant="body1">
                            {item.comment}
                          </Typography>
                        </Grid>
                      </Grid>
                      {item.user_id === userId && (
                        <>
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(event) => handleMenuClick(event, item)}
                            sx={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              color: "#ff469e",
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id={`menu-${item.id}`}
                            anchorEl={
                              anchorEl && anchorEl.id === item.id
                                ? anchorEl.element
                                : null
                            }
                            keepMounted
                            open={Boolean(anchorEl && anchorEl.id === item.id)}
                            onClose={handleMenuClose}
                            MenuListProps={{
                              elevation: 3,
                              sx: {
                                "& .MuiMenuItem-root": {
                                  transition:
                                    "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                                  "&:hover": {
                                    backgroundColor: "#ffebf2",
                                    color: "#ff469e",
                                  },
                                  "&:active": {
                                    backgroundColor: "#ffc1e3",
                                    color: "#ff469e",
                                  },
                                },
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => handleOpenEditComment(item)}
                            >
                              Edit Comment
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ textAlign: "center" }}
              >
                No comments available.
              </Typography>
            )}

            {visibleComments < comment?.length && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "#ff469e",
                    "&:hover": { backgroundColor: "#e6338f" },
                    marginTop: "20px",
                  }}
                  onClick={handleShowMore}
                >
                  Show more
                </Button>
              </Box>
            )}
          </Container>
          <Modal open={openEditComment} onClose={handleCloseEditComment}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Grid container alignItems="center" spacing={2} mb={2}>
                <Grid item>
                  <Avatar>
                    <PersonIcon
                      sx={{
                        ml: 1,
                        mr: 1,
                        width: 24,
                        height: 24,
                        color: "inherit",
                      }}
                    />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    {userMap[selectedComment?.user_id]}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedComment
                      ? new Date(selectedComment.date).toLocaleString()
                      : ""}
                  </Typography>
                </Grid>
              </Grid>
              <Rating
                name="star-rating"
                value={selectedComment?.rating}
                onChange={(event, newValue) => handleChange("rating", newValue)}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#ff469e",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#ff69b4",
                  },
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comment"
                variant="outlined"
                value={selectedComment?.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ff469e",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ff69b4",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff469e",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff469e",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  marginTop: 4,
                  backgroundColor: "white",
                  color: "#ff469e",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: 16,
                  width: "10vw",
                  transition:
                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                    border: "1px solid white",
                  },
                }}
                onClick={handleEditComment}
              >
                Submit
              </Button>
            </Box>
          </Modal>
        </Box>
      )}
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
