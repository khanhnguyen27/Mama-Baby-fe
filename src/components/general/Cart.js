import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Container,
  CardMedia,
  ButtonGroup,
} from "@mui/material";
import { Close, KeyboardCapslock } from "@mui/icons-material";
import {
  addToCart,
  clearCart,
  removeFromCart,
  selectCart,
  selectCartAmount,
  selectTotalCost,
} from "../../redux/CartSlice";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Cart() {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCart);
  const cartAmount = useSelector(selectCartAmount);
  const totalCost = useSelector(selectTotalCost);
  const isEmptyCart = !cartItems.products.length;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Card sx={{ backgroundColor: "#fff4fc" }}>
          <CardHeader title="Your Cart" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                {!isEmptyCart ? (
                  cartItems.products.map((item) => (
                    <Card
                      sx={{
                        display: "flex",
                        px: 1,
                        border: "1px solid #ff469e",
                        borderRadius: "20px",
                        my: 2,
                      }}
                    >
                      <CardMedia
                        sx={{ width: "120px", height: "120px", pt: 1.5 }}
                        image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                        title="Product Image"
                      />
                      <CardContent sx={{ flex: "1 0 auto", ml: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            gutterBottom
                            noWrap
                            variant="h5"
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                                color: "#ff469e",
                              },
                            }}
                            onClick={() =>
                              navigate(
                                `/products/${item.product.name
                                  .toLowerCase()
                                  .replace(/\s/g, "-")}`,
                                { state: { productId: item.product.id } },
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                })
                              )
                            }
                          >
                            {item.product.name}
                          </Typography>
                          <IconButton
                            onClick={() => (
                              dispatch(removeFromCart(item.product)),
                              toast.info(
                                `Removed ${item.product.name} out of cart`
                              )
                            )}
                          >
                            <Close
                              fontSize="large"
                              sx={{
                                color: "#ff469e",
                                borderRadius: "30px",
                                boxShadow: "none",
                                transition: "0.3s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#ff469e",
                                  color: "white",
                                  transform: "scale(1.1)",
                                },
                              }}
                            />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            pt: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2rem",
                            }}
                          >
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                              ${Math.round(item.product.price * item.quantity)}
                            </Typography>
                          </Box>
                          <ButtonGroup
                            variant="outlined"
                            aria-label="outlined button group"
                            style={{ height: "2.5rem" }}
                          >
                            <Button
                              variant="contained"
                              disabled={item.quantity <= 1}
                              onClick={() => {
                                const newQuantity =
                                  item.quantity >= 11
                                    ? -10
                                    : -(item.quantity - 1);
                                dispatch(
                                  addToCart({
                                    product: item.product,
                                    quantity: newQuantity,
                                  })
                                );
                              }}
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
                              disabled={item.quantity <= 1}
                              onClick={() => {
                                dispatch(
                                  addToCart({
                                    product: item.product,
                                    quantity: -1,
                                  })
                                );
                              }}
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
                              {item.quantity}
                            </Button>
                            <Button
                              variant="contained"
                              disabled={item.quantity >= 99}
                              onClick={() => {
                                dispatch(
                                  addToCart({
                                    product: item.product,
                                    quantity: 1,
                                  })
                                );
                              }}
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
                              disabled={item.quantity >= 99}
                              onClick={() => {
                                const newQuantity =
                                  item.quantity <= 89 ? 10 : 99 - item.quantity;
                                dispatch(
                                  addToCart({
                                    product: item.product,
                                    quantity: newQuantity,
                                  })
                                );
                              }}
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
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ff469e",
                      fontSize: "1.25rem",
                      textAlign: "center",
                      my: 3,
                    }}
                  >
                    Your cart is currently empty.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 3,
                  }}
                >
                  <Typography variant="h6">Total:</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    ${totalCost}
                  </Typography>
                </Box>
                <Divider />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "10px",
                    fontSize: 16,
                    fontWeight: "bold",
                    my: 1,
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                >
                  Checkout
                </Button>
                <Button
                  onClick={() => navigate("/products")}
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "10px",
                    fontSize: 16,
                    fontWeight: "bold",
                    my: 1,
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                >
                  Continue shopping
                </Button>
                {!isEmptyCart && (
                  <Button
                    onClick={() => (
                      dispatch(clearCart()), toast.info("Removed all items")
                    )}
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "10px",
                      fontSize: 16,
                      fontWeight: "bold",
                      my: 1,
                      transition:
                        "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                        border: "1px solid white",
                      },
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
