import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Container,
  Rating,
  Avatar,
  CardMedia,
} from "@mui/material";
import { Close, KeyboardCapslock } from "@mui/icons-material";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { commentByUserIdApi } from "../../api/CommentAPI";
import PersonIcon from "@mui/icons-material/Person";
import { allProductCHApi } from "../../api/ProductAPI";
export default function CommentHistory() {
  window.document.title = "Comment History";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState([]);
  const [product, setProduct] = useState([]);
  const [visibleComments, setVisibleComments] = useState(5);
  const accessToken = localStorage.getItem("accessToken");
  const isComment = comment?.length;

  var userName = "";
  var userId = 0;
  if (accessToken && typeof accessToken === "string") {
    try {
      const decodedAccessToken = jwtDecode(accessToken);
      userId = decodedAccessToken.UserID;
      userName = decodedAccessToken.FullName;
    } catch (error) {
      console.error("Failed to decode token:", error);
      // Xử lý lỗi nếu cần thiết
    }
  } else {
    console.warn("Invalid token specified: must be a string");
    // Xử lý trường hợp token không hợp lệ nếu cần thiết
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(product);
  const fetchData = async () => {
    try {
      const [commentRes, productRes] = await Promise.all([
        commentByUserIdApi(userId),
        allProductCHApi({
          type: "WHOLESALE",
        }),
      ]);

      const commentData = commentRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];

      setProduct(productData);
      setComment(commentData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

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
        <Typography
          sx={{
            fontSize: "2.25rem",
            color: "#ff469e",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          Comment History{" "}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {isComment ? (
            comment.slice(0, visibleComments).map((comment) => (
              <Grid item xs={12} key={comment.id}>
                <Card
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center" }}
                    onClick={() =>
                      navigate(
                        `/products/${comment.product_id}`,
                        {
                          state: {
                            productId: comment.product_id,
                          },
                        },
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        })
                      )
                    }
                  >
                    <Avatar sx={{ mr: 2 }}>
                      {" "}
                      <PersonIcon
                        sx={{
                          ml: 1,
                          mr: 1,
                          width: 24,
                          height: 24,
                          color: "inherit",
                        }}
                      />
                    </Avatar>{" "}
                    {/* Placeholder avatar */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: "#333" }}
                      >
                        {userName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        Posted on: {new Date(comment.date).toLocaleString()}
                      </Typography>
                      <Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Rating
                            value={comment.rating}
                            readOnly
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: "#ff469e",
                              },
                            }}
                          />
                        </Box>
                      </Typography>
                      <Typography variant="body1" component="div">
                        {comment.comment}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {product.map((item) => {
                        if (item.id === comment.product_id) {
                          return (
                            <Box
                              key={item.id}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                              }}
                            >
                              <Typography
                                variant="body1"
                                color="textSecondary"
                                sx={{ marginBottom: 1 }}
                              >
                                {item.name.length > 30
                                  ? `${item.name.substring(0, 30)}...`
                                  : item.name}
                              </Typography>
                              <CardMedia
                                component="img"
                                image={
                                  item.image_url.includes("Product_")
                                    ? `http://localhost:8080/mamababy/products/images/${item.image_url}`
                                    : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                                }
                                onError={(e) => {
                                  e.target.src =
                                    "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                                }}
                                alt={item.name}
                                sx={{
                                  width: "128px",
                                  height: "auto",
                                }}
                              />
                            </Box>
                          );
                        }
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ textAlign: "center" }}
              >
                No comments available.
              </Typography>
            </Grid>
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
