import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { changeStatusOrderApi, orderByUserIdApi } from "../../api/OrderAPI";
import { format } from "date-fns"; // Optional: for date formatting
import {
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  CardContent,
  IconButton,
  Modal,
  CircularProgress,
  TextField,
  Rating,
  Avatar,
} from "@mui/material";
import { makePaymentApi } from "../../api/VNPayAPI";
import { toast } from "react-toastify";
import { allProductApi } from "../../api/ProductAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { useNavigate } from "react-router-dom";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";
import { allVoucherApi } from "../../api/VoucherAPI";
import { createCommentApi, allCommentApi } from "../../api/CommentAPI";

export default function Orders() {
  window.document.title = "Your Orders";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [ordersByStatus, setOrdersByStatus] = useState({
    UNPAID: [],
    PENDING: [],
    PREPARING: [],
    DELIVERING: [],
    COMPLETED: [],
    CANCELLED: [],
    RETURNED: [],
  });
  const [commentMap, setCommentMap] = useState({});
  const [productMap, setProductMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [voucherMap, setVoucherMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);

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
      const [
        orderRes,
        productRes,
        brandRes,
        categoryRes,
        voucherRes,
        comments,
      ] = await Promise.all([
        orderByUserIdApi(userId),
        allProductApi(),
        allBrandApi(),
        allCategorytApi(),
        allVoucherApi(),
        allCommentApi(),
      ]);
      const orderData = orderRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];
      const commentData = comments?.data?.data || [];

      const categorizedOrders = {
        UNPAID: [],
        PENDING: [],
        PREPARING: [],
        DELIVERING: [],
        COMPLETED: [],
        CANCELLED: [],
        RETURNED: [],
      };

      orderData.forEach((order) => {
        const latestStatus =
          order.status_order_list[order.status_order_list.length - 1].status;
        categorizedOrders[latestStatus]?.push(order);
      });
      // for (const status in categorizedOrders) {
      //   categorizedOrders[status].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      // }
      for (const status in categorizedOrders) {
        categorizedOrders[status].reverse();
      }
      setOrdersByStatus(categorizedOrders);

      const productMap = productData.reduce((x, item) => {
        x[item.id] = [item.name, item.brand_id, item.category_id, item.price];
        return x;
      }, {});
      setProductMap(productMap);

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

      const voucherMap = voucherData.reduce((x, item) => {
        x[item.id] = item.code;
        return x;
      }, {});
      setVoucherMap(voucherMap);

      const commentMap = commentData.reduce((x, item) => {
        x[item.id] = item.product_id;
        return x;
      }, {});
      setCommentMap(commentMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (e, newValue) => {
    setLoading(true);
    setTabValue(newValue);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleCheckout = (finalAmount, bankCode, orderId) => {
    const orders = [{ id: orderId }];
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
  };

  const handleCancel = (orderId, status) => {
    changeStatusOrderApi(orderId, status)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Cancelled!", {
          autoClose: 1500,
        });
        handleClose();
        setLoading(true);
        setTimeout(() => {
          navigate("/orders");
        }, 1500);
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 2500);
      })
      .catch((error) => console.log(error));
  };

  const handleReceived = (orderId, status) => {
    changeStatusOrderApi(orderId, status)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Cancelled!", {
          autoClose: 1500,
        });
        handleClose();
        setLoading(true);
        setTimeout(() => {
          navigate("/orders");
        }, 1500);
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 2500);
      })
      .catch((error) => console.log(error));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openComment, setOpenComment] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);

  const username = selectedComment?.full_name; // Replace with actual username
  const avatarUrl = "https://via.placeholder.com/150"; // Replace with actual avatar URL
  const dateTime = format(new Date(), "PPPppp"); // Formatted current date and time

  const handleOpenComment = (item) => {
    setSelectedComment(item);
    setOpenComment(true);
  };

  //console.log(commentMap);
  //console.log(selectedComment);
  //console.log(selectedComment?.order_detail_list);
  const handleCloseComment = () => {
    setOpenComment(false);
  };

  const handleComment = async () => {
    if (rating === 0) {
      toast.warn("Please select a rating.");
      return;
    }

    if (comment.length < 50) {
      toast.warn("Please enter a comment of at least 50 characters.");
      return;
    }

    const cartItems =
      selectedComment?.order_detail_list?.map((item) => ({
        product_id: item.product_id,
      })) || [];

    await createCommentApi(cartItems, rating, comment, selectedComment?.user_id)
      .then((response) => {
        handleCloseComment();
        toast.success("Comment added successfully!");
      })
      .catch((error) => {
        toast.error("Failed to add comment. Please try again later.");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container sx={{ my: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            border: "1px solid #ff469e",
            backgroundColor: "white",
            borderRadius: "30px",
            opacity: 0.95,
          }}
        >
          {Object.keys(ordersByStatus).map((status, index) => (
            <Tab
              key={status}
              label={status.charAt(0) + status.slice(1).toLowerCase()}
              sx={{
                backgroundColor: tabValue === index ? "#ff469e" : "#fff4fc",
                color: tabValue === index ? "white" : "#ff469e",
                borderRadius: "20px",
                minHeight: "30px",
                minWidth: "100px",
                m: 1,
                fontWeight: "bold",
                boxShadow: "none",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
                "&.Mui-selected": {
                  color: "white",
                },
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ marginTop: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                maxWidth: "100vw",
                backgroundColor: "#f5f7fd",
              }}
            >
              <CircularProgress sx={{ color: "#ff469e" }} size={90} />
            </Box>
          ) : ordersByStatus[Object.keys(ordersByStatus)[tabValue]].length ===
            0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  fontSize: "1.75rem",
                  textAlign: "center",
                }}
              >
                There's no order of this status
              </Typography>
            </Box>
          ) : (
            ordersByStatus[Object.keys(ordersByStatus)[tabValue]].map(
              (item) => (
                <Card
                  key={item.id}
                  sx={{
                    mb: "16px",
                    padding: "16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ mb: "10px", fontWeight: "bold" }}
                  >
                    Order No. {item.id}{" "}
                  </Typography>
                  <Divider sx={{ mb: "16px" }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          mb: "5px",
                          fontWeight: "medium",
                          fontSize: "1.25rem",
                        }}
                      >
                        Order Date:{" "}
                        <span style={{ fontWeight: "600" }}>
                          {item.orderDate}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          mb: "5px",
                          fontWeight: "medium",
                          fontSize: "1.25rem",
                        }}
                      >
                        Status:{" "}
                        <span style={{ fontWeight: "600" }}>
                          {
                            item.status_order_list[
                              item.status_order_list.length - 1
                            ].status
                          }
                        </span>
                      </Typography>
                    </Grid>
                    <Divider sx={{ mb: "16px" }} />
                    <Accordion
                      sx={{
                        minWidth: "75vw",
                        width: "100%",
                        border: "none",
                        boxShadow: "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: "#ff469e" }} />}
                        sx={{
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Typography
                          sx={{
                            width: "100%",
                            textAlign: "center",
                            color: "#ff469e",
                            fontSize: "1.25rem",
                          }}
                        >
                          View detail{" "}
                          {item.order_detail_list.length === 0
                            ? ""
                            : `(${item.order_detail_list.length} ${
                                item.order_detail_list.length === 1
                                  ? "item"
                                  : "items"
                              })`}
                          {"  "}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <Card
                              sx={{
                                pl: 2,
                                pr: 0,
                                border: "1px solid #ff469e",
                                borderRadius: "1rem",
                                my: 2.4,
                                minHeight: "120px",
                                maxHeight: "260px",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  overflowY: "auto",
                                  maxHeight: "260px",
                                  pr: 0.5,
                                  "&::-webkit-scrollbar": {
                                    width: "0.65rem",
                                  },
                                  "&::-webkit-scrollbar-track": {
                                    background: "#f5f7fd",
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    background: "#ff469e",
                                    borderRadius: "0.8rem",
                                  },
                                  "&::-webkit-scrollbar-thumb:hover": {
                                    background: "#ffbbd0",
                                  },
                                }}
                              >
                                {item.order_detail_list.map((detail, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: "flex",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <CardMedia
                                      sx={{
                                        width: "70px",
                                        height: "70px",
                                        justifyContent: "center",
                                        alignSelf: "center",
                                        borderRadius: "10px",
                                      }}
                                      image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                                      title={productMap[detail.product_id][0]}
                                    />
                                    <CardContent
                                      sx={{
                                        flex: "1 0 auto",
                                        ml: 2,
                                        borderBottom: "1px dashed black",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          mt: 2,
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontWeight: "600",
                                            fontSize: "1.25rem",
                                            "&:hover": {
                                              cursor: "pointer",
                                              color: "#ff469e",
                                            },
                                          }}
                                          onClick={() =>
                                            navigate(
                                              `/products/${productMap[
                                                detail.product_id
                                              ][0]
                                                .toLowerCase()
                                                .replace(/\s/g, "-")}`,
                                              {
                                                state: {
                                                  productId: detail.product_id,
                                                },
                                              },
                                              window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                              })
                                            )
                                          }
                                        >
                                          {productMap[detail.product_id][0]}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontWeight: "600",
                                            fontSize: "1.15rem",
                                          }}
                                        >
                                          {" "}
                                          {formatCurrency(
                                            productMap[detail.product_id][3]
                                          )}{" "}
                                          <span
                                            style={{
                                              fontSize: "1.05rem",
                                              opacity: 0.4,
                                            }}
                                          >
                                            x{detail.quantity}
                                          </span>{" "}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          mt: 1,
                                        }}
                                      >
                                        <Typography sx={{ opacity: 0.7 }}>
                                          {
                                            brandMap[
                                              productMap[detail.product_id][1]
                                            ]
                                          }{" "}
                                          |{" "}
                                          {
                                            categoryMap[
                                              productMap[detail.product_id][2]
                                            ]
                                          }
                                        </Typography>
                                        <Typography sx={{ opacity: 0.8 }}>
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            ={" "}
                                            {formatCurrency(
                                              detail.amount_price
                                            )}
                                          </span>
                                        </Typography>
                                      </Box>
                                    </CardContent>
                                  </div>
                                ))}
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    <Grid item xs={12} md={7}>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: "5px",
                          fontWeight: "medium",
                          fontSize: "1.25rem",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>Payment:</span>{" "}
                        {item.payment_method}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: "5px",
                          mt: 2,
                          fontWeight: "medium",
                          fontSize: "1.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Delivery:
                        </span>{" "}
                        <Divider
                          sx={{
                            width: "70%",
                            my: 1,
                            borderColor: "rgba(0, 0, 0, 0.4)",
                            borderWidth: "1px",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "70%",
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>Receiver:</span>
                            <span style={{ fontWeight: "600" }}>
                              {item.full_name}
                            </span>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "70%",
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>Contact:</span>
                            <span style={{ fontWeight: "600" }}>
                              {item.phone_number}
                            </span>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "70%",
                            }}
                          >
                            <span style={{ opacity: 0.7 }}>Address:</span>
                            <span style={{ fontWeight: "600" }}>
                              {item.shippingAddress}
                            </span>
                          </Box>
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Typography
                        sx={{
                          mb: "5px",
                          fontWeight: "medium",
                          textAlign: "right",
                          fontSize: "1.25rem",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                        >
                          Order Summary:
                        </span>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "12px 0",
                          }}
                        >
                          <span>Subtotal:</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            opacity: 0.7,
                            margin: "6px 0",
                          }}
                        >
                          <span>
                            Discount:{" "}
                            <span style={{ fontSize: "1.05rem" }}>
                              {" "}
                              {item.voucher_id
                                ? `(${voucherMap[item.voucher_id]})`
                                : null}
                            </span>
                          </span>
                          <span>- {formatCurrency(item.total_discount)}</span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Divider
                            sx={{
                              borderStyle: "dashed",
                              borderColor: "rgba(0, 0, 0, 0.7)",
                              borderWidth: "1px",
                              my: 1.5,
                              width: "100%",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{ fontWeight: "bold", fontSize: "1.35rem" }}
                          >
                            Total:
                          </span>
                          <span
                            style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {formatCurrency(item.final_amount)}
                          </span>
                        </Box>
                      </Typography>
                    </Grid>

                    {item.status_order_list[item.status_order_list.length - 1]
                      .status === "UNPAID" && (
                      <Grid item xs={12} sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "10px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 2,
                            mx: 1,
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={handleOpen}
                        >
                          COMPLETE PAYMENT
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          slotProps={{
                            backdrop: {
                              style: {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              borderRadius: "20px",
                              backgroundColor: "#fff4fc",
                              border: "2px solid #ff469e",
                              boxShadow: 20,
                              p: 4,
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                            >
                              Confirm Payment
                            </Typography>
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                            >
                              Are you sure you want to complete payment for this
                              order?
                            </Typography>
                            <Box
                              sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#ff469e",
                                  borderRadius: "20px",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  my: 0.2,
                                  mx: 1,
                                  transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                  border: "1px solid #ff469e",
                                  "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                  },
                                }}
                                onClick={() =>
                                  handleCheckout(
                                    item.final_amount,
                                    "VNBANK",
                                    item.id
                                  )
                                }
                              >
                                Yes
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#ff469e",
                                  borderRadius: "20px",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  my: 0.2,
                                  mx: 1,
                                  transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                  border: "1px solid #ff469e",
                                  "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                  },
                                }}
                                onClick={handleClose}
                              >
                                No
                              </Button>
                            </Box>
                          </Box>
                        </Modal>
                      </Grid>
                    )}
                    {item.status_order_list[item.status_order_list.length - 1]
                      .status === "PENDING" && (
                      <Grid item xs={12} sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "10px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 2,
                            mx: 1,
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={handleOpen}
                        >
                          CANCEL ORDER
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          slotProps={{
                            backdrop: {
                              style: {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              borderRadius: "20px",
                              backgroundColor: "#fff4fc",
                              border: "2px solid #ff469e",
                              boxShadow: 20,
                              p: 4,
                            }}
                          >
                            <Typography variant="h6" component="h2">
                              Confirm Cancellation
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              Are you sure you want to cancel this order?
                            </Typography>
                            <Box
                              sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#ff469e",
                                  borderRadius: "20px",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  my: 0.2,
                                  mx: 1,
                                  transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                  border: "1px solid #ff469e",
                                  "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                  },
                                }}
                                onClick={() =>
                                  handleCancel(item.id, "CANCELLED")
                                }
                              >
                                Yes
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#ff469e",
                                  borderRadius: "20px",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  my: 0.2,
                                  mx: 1,
                                  transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                  border: "1px solid #ff469e",
                                  "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                  },
                                }}
                                onClick={handleClose}
                              >
                                No
                              </Button>
                            </Box>
                          </Box>
                        </Modal>
                      </Grid>
                    )}
                    {item.status_order_list[item.status_order_list.length - 1]
                      .status === "DELIVERING" && (
                      <Grid item xs={12} sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "10px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 2,
                            mx: 1,
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={handleOpen}
                        >
                          CONFIRM ORDER RECEIVED
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          slotProps={{
                            backdrop: {
                              style: {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              borderRadius: "20px",
                              backgroundColor: "#fff4fc",
                              border: "2px solid #ff469e",
                              boxShadow: 20,
                              p: 4,
                            }}
                          >
                            <Typography variant="h6" component="h2">
                              Confirm Order Received
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              Do you confirm that you received your order?
                            </Typography>
                            <Box
                              sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#ff469e",
                                  borderRadius: "20px",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  my: 0.2,
                                  mx: 1,
                                  transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                  border: "1px solid #ff469e",
                                  "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                  },
                                }}
                                onClick={() =>
                                  handleReceived(item.id, "COMPLETED")
                                }
                              >
                                Yes
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#ff469e",
                                  borderRadius: "20px",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  my: 0.2,
                                  mx: 1,
                                  transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                  border: "1px solid #ff469e",
                                  "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                  },
                                }}
                                onClick={handleClose}
                              >
                                No
                              </Button>
                            </Box>
                          </Box>
                        </Modal>
                      </Grid>
                    )}
                    {item.status_order_list[item.status_order_list.length - 1]
                      .status === "COMPLETED" && (
                      <Grid item xs={12} sx={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "10px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 2,
                            mx: 1,
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
                          EXCHANGE
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "10px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 2,
                            mx: 1,
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={() => handleOpenComment(item)}
                        >
                          COMMENT
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              )
            )
          )}
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
      <Modal open={openComment} onClose={handleCloseComment}>
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
              <Avatar src={avatarUrl} alt={username} />
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
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
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
            onClick={handleComment}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
