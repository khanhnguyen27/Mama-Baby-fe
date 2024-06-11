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
  Select,
  MenuItem,
  Modal,
  List,
  ListItem,
  TextField,
  FormControl,
  InputLabel,
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
import { allStoreApi } from "../../api/StoreAPI";
import { allVoucherApi } from "../../api/VoucherAPI";
import { makePaymentApi } from "../../api/VNPayAPI";
import { createOrderApi } from "../../api/OrderAPI";
import { jwtDecode } from "jwt-decode";
import { profileUserApi } from "../../api/UserAPI";
export default function Cart() {
  window.document.title = "Cart";
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [store, setStore] = useState([]);
  const [storeMap, setStoreMap] = useState({});
  const [voucher, setVoucher] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
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

  const fetchData = async () => {
    try {
      const [userRes, storeRes, voucherRes] = await Promise.all([
        profileUserApi(),
        allStoreApi(),
        allVoucherApi(),
      ]);

      const userData = userRes?.data?.data || [];
      const storeData = storeRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];

      setUserInfo(userData);
      setStore(storeData);
      setVoucher(voucherData);

      const storeMap = storeData.stores.reduce((x, item) => {
        x[item.id] = item.name_store;
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

  const groupedCartItems = cartItems.products.reduce((acc, item) => {
    if (!acc[item.product.store_id]) {
      acc[item.product.store_id] = [];
    }
    acc[item.product.store_id].push(item);
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleVoucherChange = (e) => {
    setSelectedVoucher(e.target.value);
  };

  const getDiscountedTotal = () => {
    if (selectedVoucher === null || selectedVoucher === 0) return totalCost;
    return totalCost - selectedVoucher <= 0 ? 0 : totalCost - selectedVoucher;
  };

  const handleOpen = () => {
    !isEmptyCart
      ? (setOpen(true),
        setFullName(userInfo.full_name),
        setPhone(userInfo.phone_number),
        setAddress(userInfo.address))
      : toast.warn("There's no item in your cart", { autoClose: 2500 });
  };
  const handleClose = () => setOpen(false);

  console.log(fullName);
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleAdressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCheckout = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken === null) {
      toast.warn("Please login to continue your paycheck", { autoClose: 2500 });
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
      return;
    }
    const decodedAccessToken = jwtDecode(accessToken);
    const userId = decodedAccessToken.UserID;
    console.log(userId);

    // Add phone and fullname of the user, also add these 2 column in the order database
    const selectedVoucherObj = voucher.find(
      (item) => item.discountValue === selectedVoucher
    );
    const voucherId = selectedVoucherObj ? selectedVoucherObj.id : null;

    const totalPoint = 0;

    const amount = totalCost;

    const totalDiscount = selectedVoucher;

    const finalAmount = getDiscountedTotal();

    const shippingAddress = address;

    const bankCode = "VNBANK";

    const type = "ORDER";

    const cartItems2 = cartItems.products.map((item) => ({
      product_id: item.product.id,
      store_id: item.product.store_id,
      quantity: item.quantity,
    }));

    // const language = "vn";

    if (paymentMethod === "COD") {
      createOrderApi(
        userId,
        fullName,
        phone,
        voucherId,
        totalPoint,
        amount,
        totalDiscount,
        finalAmount,
        shippingAddress,
        paymentMethod,
        type,
        cartItems2
      )
        .then((res) => {
          console.log(res.data);
          toast.success("Create new order successfully", {
            autoClose: 1500,
          });
        })
        .catch((error) => console.log(error));
    } else if (paymentMethod === "VNPAY") {
      createOrderApi(
        userId,
        fullName,
        phone,
        voucherId,
        totalPoint,
        amount,
        totalDiscount,
        finalAmount,
        shippingAddress,
        paymentMethod,
        type,
        cartItems2
      )
        .then((res) => {
          console.log(res.data);
          const orders = res?.data?.data.map((item) => ({
            id: item.id,
          }));
          console.log(orders);
          setTimeout(() => {
            makePaymentApi(finalAmount, bankCode, orders)
              .then((res) => {
                console.log(res.data);
                toast.success("Now moving to payment page!", {
                  autoClose: 1500,
                });
                setTimeout(() => {
                  window.location.replace(res.data?.data?.payment_url);
                }, 1500);
              })
              .catch((error) => console.log(error));
          }, 1000);
        })
        .catch((error) => console.log(error));
    } else if (paymentMethod === "") {
      toast.error("You haven't choose a valid payment method");
    } else {
      toast.error("Unable to checkout");
    }
  };
  // axiosJWT.post(`http://localhost:8080/mamababy/payment/vn-pay?finalAmount=${getDiscountedTotal()}&bankCode=${paymentMethod}&language=${language}`, {
  // products: cartItems.products.map(item => ({
  //   productId: item.product.id,
  //   quantity: item.quantity,
  //   storeId: item.product.store_id
  // })),
  // amount: totalCost,
  // totalDiscount: selectedVoucher,
  // finalAmount: getDiscountedTotal(),
  // bankCode: paymentMethod,
  // language: "vn"
  // })

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
        <Card
          sx={{
            backgroundColor: "#fff4fc",
            border: "3px solid #ff469e",
            borderRadius: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "2.5rem",
              color: "#ff469e",
              fontWeight: "bold",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            Your Cart{" "}
            {cartAmount === 0
              ? ""
              : `(${cartAmount} ${cartAmount === 1 ? "item" : "items"})`}
          </Typography>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                {!isEmptyCart ? (
                  Object.keys(groupedCartItems).map((storeId) => (
                    <div key={storeId}>
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#ff469e",
                          fontWeight: "bold",
                          marginTop: "1rem",
                          marginLeft: "1.25rem",
                        }}
                      >
                        {/* Store {storeId} */}
                        {storeMap[storeId]}
                      </Typography>
                      {groupedCartItems[storeId].map((item) => (
                        <Card
                          sx={{
                            display: "flex",
                            px: 2,
                            border: "1px solid #ff469e",
                            borderRadius: "20px",
                            my: 2,
                            minHeight: "180px",
                          }}
                        >
                          <CardMedia
                            sx={{
                              width: "100px",
                              height: "100px",
                              justifyContent: "center",
                              alignSelf: "center",
                            }}
                            image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                            title={item.product.name}
                          />
                          <CardContent sx={{ flex: "1 0 auto", ml: 2 }}>
                            <Box sx={{ textAlign: "right", height: "30px" }}>
                              <IconButton
                                size="small"
                                onClick={() => (
                                  dispatch(removeFromCart(item.product)),
                                  toast.info(
                                    `Removed ${item.product.name} out of cart`,
                                    { autoClose: 2500 }
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
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                gutterBottom
                                noWrap
                                sx={{
                                  fontSize: "22px",
                                  fontWeight: "bold",
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
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                my: 1,
                              }}
                            >
                              <Grid xs={3}>
                                <Typography
                                  sx={{ fontSize: "20px", fontWeight: "600" }}
                                >
                                  Unit Price
                                </Typography>
                              </Grid>
                              <Grid xs={6}>
                                <Typography
                                  sx={{
                                    fontSize: "20px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    mr: 1.5,
                                  }}
                                >
                                  Quantity
                                </Typography>
                              </Grid>
                              <Grid xs={3}>
                                <Typography
                                  sx={{
                                    fontSize: "20px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                  }}
                                >
                                  Total Amount
                                </Typography>
                              </Grid>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 1.5,
                              }}
                            >
                              <Typography sx={{ fontSize: "20px" }}>
                                {formatCurrency(item.product.price)}
                              </Typography>
                              <ButtonGroup
                                variant="outlined"
                                aria-label="outlined button group"
                                style={{ height: "2rem" }}
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
                                    fontSize: "1rem",
                                    width: "2.9rem",

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
                                    fontSize: "1rem",
                                    width: "2.9rem",
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
                                    fontSize: "1rem",
                                    width: "2.9rem",

                                    width: "3rem",
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
                                    fontSize: "1rem",
                                    width: "2.9rem",
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
                                      item.quantity <= 89
                                        ? 10
                                        : 99 - item.quantity;
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
                                    fontSize: "1rem",
                                    width: "2.9rem",
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
                              <Typography sx={{ fontSize: "20px" }}>
                                {formatCurrency(
                                  Math.round(item.product.price * item.quantity)
                                )}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "right", mt: 2 }}>
                              {/* <ButtonGroup
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
                                      item.quantity <= 89
                                        ? 10
                                        : 99 - item.quantity;
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
                              </ButtonGroup> */}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                      <Divider />
                    </div>
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
                    py: 2,
                    px: 2,
                    mt: 8.5,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    border: "1px solid #ff469e",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0.16)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Choose a voucher:
                  </Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    defaultValue=""
                    value={selectedVoucher}
                    onChange={handleVoucherChange}
                    sx={{
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      borderRadius: "20px",
                      fontSize: "20px",
                      border: "1px solid #ff469e",
                      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
                      transition:
                        "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border 0.3s ease-in-out",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#ff469e",
                        border: "1px solid white",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "inherit",
                      },
                    }}
                    MenuProps={{
                      sx: {
                        "& .MuiMenu-list": {
                          backgroundColor: "white",
                          borderRadius: "10px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.16)",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      key={null}
                      value={""}
                      sx={{
                        color: "black",
                        fontSize: "18px",
                        transition:
                          "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#fff4fc",
                          color: "#ff469e",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#ff469e",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#fff4fc",
                            color: "#ff469e",
                          },
                        },
                      }}
                    >
                      -
                    </MenuItem>
                    {voucher.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.discountValue}
                        sx={{
                          color: "black",
                          fontSize: "18px",
                          transition:
                            "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#fff4fc",
                            color: "#ff469e",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#ff469e",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#fff4fc",
                              color: "#ff469e",
                            },
                          },
                        }}
                      >
                        {item.code}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    mt: 3,
                  }}
                >
                  <Typography variant="h6">Total:</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontSize: "1.25rem",
                    }}
                  >
                    {formatCurrency(totalCost)}
                  </Typography>
                </Box>
                {selectedVoucher != 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    <Typography variant="h6">Discount:</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "black",
                        fontSize: "1.25rem",
                      }}
                    >
                      - {formatCurrency(selectedVoucher)}
                    </Typography>
                  </Box>
                )}
                <Divider
                  sx={{
                    borderStyle: "dashed",
                    borderColor: "rgba(0, 0, 0, 0.7)",
                    borderWidth: "1px",
                    my: 1.5,
                    width: "100%",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    my: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                  >
                    Final Total:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(getDiscountedTotal())}
                  </Typography>
                </Box>
                <Divider />
                <Button
                  variant="contained"
                  onClick={handleOpen}
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
                <Modal open={open} onClose={handleClose}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 1000,
                      backgroundColor: "#fff4fc",
                      border: "2px solid #ff469e",
                      boxShadow: 20,
                      p: 4,
                    }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <IconButton onClick={handleClose}>
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
                    </div>
                    <Grid container spacing={2}>
                      <Grid item md={6}>
                        <div style={{ margin: "1rem 0.25rem" }}>
                          <lable>Full Name</lable>
                          <TextField
                            fullWidth
                            onChange={handleFullNameChange}
                            value={fullName}
                            placeholder="Enter your full name"
                            size="small"
                            variant="outlined"
                            InputProps={{
                              sx: {
                                padding: 0,
                                border: "1px solid #ff469e",
                                borderRadius: "7px",
                                backgroundColor: "white",
                                transition: "0.2s ease-in-out",
                                "&:hover": {
                                  border: "1px solid #ff469e",
                                },
                                "&:focus": {
                                  backgroundColor: "#F8F8F8",
                                },
                                "&.Mui-focused": {
                                  border: "1px solid #ff469e",
                                  backgroundColor: "#F8F8F8",
                                  boxShadow:
                                    "inset 0px 2px 4px rgba(0, 0, 0, 0.32)",
                                  outline: "none",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                              },
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item md={6}>
                        <div style={{ margin: "1rem 0.25rem" }}>
                          <lable>Phone</lable>
                          <TextField
                            fullWidth
                            onChange={handlePhoneChange}
                            value={phone}
                            placeholder="Enter your phone"
                            size="small"
                            variant="outlined"
                            InputProps={{
                              sx: {
                                padding: 0,
                                border: "1px solid #ff469e",
                                borderRadius: "7px",
                                backgroundColor: "white",
                                transition: "0.2s ease-in-out",
                                "&:hover": {
                                  border: "1px solid #ff469e",
                                },
                                "&:focus": {
                                  backgroundColor: "#F8F8F8",
                                },
                                "&.Mui-focused": {
                                  border: "1px solid #ff469e",
                                  backgroundColor: "#F8F8F8",
                                  boxShadow:
                                    "inset 0px 2px 4px rgba(0, 0, 0, 0.32)",
                                  outline: "none",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                              },
                            }}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <div style={{ margin: "1rem 0.25rem" }}>
                      <label>Address</label>
                      <TextField
                        fullWidth
                        onChange={handleAdressChange}
                        value={address}
                        placeholder="Enter your delivery address. E.g: 123 To Hoai Street, District 1, Ho Chi Minh City"
                        size="small"
                        variant="outlined"
                        InputProps={{
                          sx: {
                            padding: 0,
                            border: "1px solid #ff469e",
                            borderRadius: "7px",
                            backgroundColor: "white",
                            transition: "0.2s ease-in-out",
                            "&:hover": {
                              border: "1px solid #ff469e",
                            },
                            "&:focus": {
                              backgroundColor: "#F8F8F8",
                            },
                            "&.Mui-focused": {
                              border: "1px solid #ff469e",
                              backgroundColor: "#F8F8F8",
                              boxShadow:
                                "inset 0px 2px 4px rgba(0, 0, 0, 0.32)",
                              outline: "none",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          },
                        }}
                      />
                    </div>
                    <Typography variant="h6" component="h2">
                      Your cart
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6} lg={8}>
                        <List>
                          <Grid container spacing={2}>
                            {cartItems.products.map((item, index) => (
                              <Grid item xs={12} md={6}>
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <img
                                    style={{ width: "48px", height: "56px" }}
                                    src="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                                  />
                                  <ListItem>
                                    {item.product.name} x {item.quantity}
                                    {/* {"="}{" "}
                                    {formatCurrency(
                                      item.quantity * item.product.price
                                    )} */}
                                  </ListItem>
                                </div>
                              </Grid>
                            ))}
                          </Grid>
                        </List>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        sx={{ textAlign: "right" }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                        >
                          Final Total:
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#ff469e",
                            fontSize: "2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {formatCurrency(getDiscountedTotal())}
                        </Typography>
                        <FormControl fullWidth>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1.25rem",
                              mt: 2,
                            }}
                          >
                            Select Payment Method:
                          </Typography>
                          <Select
                            fullWidth
                            displayEmpty
                            defaultValue=""
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            sx={{
                              backgroundColor: "#fff4fc",
                              color: "#ff469e",
                              borderRadius: "20px",
                              my: 1,
                              fontSize: "16px",
                              textAlign: "left",
                              border: "1px solid #ff469e",
                              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
                              transition:
                                "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border 0.3s ease-in-out",
                              "&:hover": {
                                color: "white",
                                backgroundColor: "#ff469e",
                                border: "1px solid white",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "inherit",
                              },
                            }}
                            MenuProps={{
                              sx: {
                                "& .MuiMenu-list": {
                                  backgroundColor: "white",
                                  borderRadius: "10px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.16)",
                                },
                              },
                            }}
                          >
                            <MenuItem
                              key={null}
                              value={""}
                              sx={{
                                color: "black",
                                fontSize: "18px",
                                transition:
                                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "#ff469e",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#fff4fc",
                                    color: "#ff469e",
                                  },
                                },
                              }}
                            >
                              -
                            </MenuItem>
                            <MenuItem
                              value={"COD"}
                              sx={{
                                color: "black",
                                fontSize: "18px",
                                transition:
                                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "#ff469e",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#fff4fc",
                                    color: "#ff469e",
                                  },
                                },
                              }}
                            >
                              COD
                            </MenuItem>
                            <MenuItem
                              value={"VNPAY"}
                              sx={{
                                color: "black",
                                fontSize: "18px",
                                transition:
                                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "#ff469e",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#fff4fc",
                                    color: "#ff469e",
                                  },
                                },
                              }}
                            >
                              Internal Payment
                            </MenuItem>
                            {/* <MenuItem value={'NCB'}>Internal Payment</MenuItem> */}
                            {/* <MenuItem
                              value={"INTCARD"}
                              sx={{
                                color: "black",
                                fontSize: "18px",
                                transition:
                                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "#ff469e",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#fff4fc",
                                    color: "#ff469e",
                                  },
                                },
                              }}
                            >
                              International Payment
                            </MenuItem> */}
                          </Select>
                        </FormControl>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleCheckout}
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "10px",
                            fontSize: 16,
                            fontWeight: "bold",
                            mt: 3,
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
                          Payment Check
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
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
                      dispatch(clearCart()),
                      toast.info("Removed all items", { autoClose: 2500 }),
                      window.scrollTo({ top: 0, behavior: "smooth" })
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
