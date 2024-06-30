import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { productByIdApi } from "../../api/ProductAPI";
import { commentByProductIdWithStoreApi } from "../../api/CommentAPI";
import { allUserApi } from "../../api/UserAPI";
import { updateCommentStatusApi, createCommentApi } from "../../api/CommentAPI";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import { Star, StarHalf, StarOutline } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  Breadcrumbs,
  Container,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import { Rating } from "@mui/material";
import { KeyboardCapslock } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function ProductDetailsManagement() {
  const [visible, setVisible] = useState(false);
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
  const [emptyStars, setEmptyStars] = useState(0);
  const [halfStar, setHalfStar] = useState(0);
  const [fullStars, setFullStars] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [blockComment, setBlockComment] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [ratingArr, setRatingArr] = useState([0, 0, 0, 0, 0]);
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleLockComment = (item) => {
    handleMenuClose();
    setBlockComment(!blockComment);

    if (item.status === false) {
      updateCommentStatusApi(item.id, "true")
        .then((response) => {
          fetchData();
          toast.success("Comment locked successfully!");
        })
        .catch((error) => {
          toast.error("Failed to lock comment. Please try again later.");
        });
    } else {
      updateCommentStatusApi(item.id, "false")
        .then((response) => {
          fetchData();
          toast.success("Comment unlocked successfully!");
        })
        .catch((error) => {
          toast.error("Failed to unlock comment. Please try again later.");
        });
    }
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl({ element: event.currentTarget, id: item.id });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      const [ageRes, brandRes, categoryRes, userRes, productRes, commentRes] =
        await Promise.all([
          allAgeApi(),
          allBrandApi(),
          allCategorytApi(),
          allUserApi(),
          productByIdApi(productId),
          commentByProductIdWithStoreApi(productId),
        ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const userData = userRes?.data?.data || [];
      const productData = productRes?.data?.data || {};
      const commentData = commentRes?.data?.data || null;

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setUser(userData);
      setProduct(productData);
      setComment(commentData);

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
          (x) => x.product_id === productData.id && x.status === true
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

  const handleShowMore = () => {
    setVisibleComments((prevVisibleComments) => prevVisibleComments + 5);
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
            to="/staff/products"
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
                      src={
                        product.image_url &&
                        product.image_url.includes("Product_")
                          ? `http://localhost:8080/mamababy/products/images/${product.image_url}`
                          : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
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
                    <Typography variant="h6" style={{ textAlign: "left" }}>
                      {formatCurrency(product.price)}
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
              md={3}
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
                      <Star style={{ color: "#ff469e", fontSize: "36px" }} />
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
                    const ratingPer = Math.round((rating / totalRating) * 100);
                    const starIndex = 5 - index;
                    var barColor = totalRating === 0 ? "#e0e0e0" : "#ff469e";

                    return (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        mb={0}
                      >
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
                  backgroundColor: item.status ? "#f9f9f9" : "#CACACA",
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
                          backgroundColor: item.status ? "#fafafa" : "#CACACA",
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
                              color: item.status ? "#ff469e" : "#aaa",
                            },
                          }}
                        />
                      </Box>

                      <Typography variant="body1">{item.comment}</Typography>
                    </Grid>
                  </Grid>
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
                      <MenuItem onClick={() => handleLockComment(item)}>
                        {item.status ? "Lock Comment" : "Unlock Comment"}
                      </MenuItem>
                    </Menu>
                  </>
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
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
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
    </div>
  );
}
