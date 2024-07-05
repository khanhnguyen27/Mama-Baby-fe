import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { changeStatusOrderApi, orderByUserIdApi } from "../../api/OrderAPI";
import { format } from "date-fns"; // Optional: for date formatting
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
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
  FormControlLabel,
  Checkbox,
  ButtonGroup,
  Tooltip,
  Fade,
} from "@mui/material";
import { makePaymentApi } from "../../api/VNPayAPI";
import { toast } from "react-toastify";
import {
  allProductApi,
  productByIdApi,
  allProductCHApi,
} from "../../api/ProductAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { useNavigate } from "react-router-dom";
import { Close, ExpandMore, Info, KeyboardCapslock } from "@mui/icons-material";
import { allVoucherApi } from "../../api/VoucherAPI";
import { addToCart } from "../../redux/CartSlice";
import { useDispatch } from "react-redux";
import { addExchangeApi, exchangeByUserIdApi } from "../../api/ExchangeAPI";
import { allStoreApi } from "../../api/StoreAPI";
import { addRefundApi, refundByUserIdApi } from "../../api/RefundAPI";

export default function Orders() {
  window.document.title = "Your Orders";
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    // RETURNED: [],
  });
  const [productMap, setProductMap] = useState({});
  const [storeMap, setStoreMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [voucherMap, setVoucherMap] = useState({});
  const [exchange, setExchange] = useState([]);
  const [refund, setRefund] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedFinalAmount, setSelectedFinalAmount] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openExchange, setOpenExchange] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

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
        storeRes,
        brandRes,
        categoryRes,
        voucherRes,
        exchangeRes,
        refundRes,
      ] = await Promise.all([
        orderByUserIdApi(userId),
        allProductCHApi({ limit: 1000 }),
        allStoreApi({ limit: 1000 }),
        allBrandApi(),
        allCategorytApi(),
        allVoucherApi(),
        exchangeByUserIdApi(userId),
        refundByUserIdApi(userId),
      ]);
      const orderData = orderRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];
      const storeData = storeRes?.data?.data?.stores || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];
      const exchangeData = exchangeRes?.data?.data || [];
      const refundData = refundRes?.data?.data || [];

      const categorizedOrders = {
        UNPAID: [],
        PENDING: [],
        PREPARING: [],
        DELIVERING: [],
        COMPLETED: [],
        CANCELLED: [],
        // RETURNED: [],
      };

      orderData.forEach((order) => {
        const latestStatus =
          order.status_order_list[order.status_order_list.length - 1].status;
        categorizedOrders[latestStatus]?.unshift(order);
      });
      for (const status in categorizedOrders) {
        categorizedOrders[status].sort(
          (a, b) => new Date(b.order_date) - new Date(a.order_date)
        );
      }
      // for (const status in categorizedOrders) {
      //   categorizedOrders[status].reverse();
      // }
      setOrdersByStatus(categorizedOrders);

      setExchange(exchangeData);
      setRefund(refundData);

      const productMap = productData.reduce((x, item) => {
        x[item.id] = [
          item.name,
          item.brand_id,
          item.category_id,
          item.price,
          item.image_url,
        ];
        return x;
      }, {});
      setProductMap(productMap);

      const storeMap = storeData.reduce((x, item) => {
        x[item.id] = item.name_store;
        return x;
      }, {});
      setStoreMap(storeMap);

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

  const formatCurrencyPoint = (amount) => {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {new Intl.NumberFormat("vi-VN").format(amount)}
          <MonetizationOnIcon
            variant="h6"
            sx={{
              marginLeft: "4px",
              color: "gray",
              fontSize: 24,
            }}
          />
        </Box>
      </>
    );
  };

  const handleCheckout = () => {
    const bankCode = "VNBANK";
    console.log(
      selectedFinalAmount,
      bankCode,
      selectedOrderId,
      selectedStoreId
    );
    makePaymentApi(
      selectedFinalAmount,
      bankCode,
      selectedOrderId,
      selectedStoreId
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Now moving to payment page!", {
          autoClose: 1500,
        });
        setTimeout(() => {
          window.location.replace(res.data?.data?.payment_url);
          // window.open(res.data?.data?.payment_url);
        }, 1500);
        handleClose();
      })
      .catch((error) => console.log(error));
  };

  // const handleCancel = (orderId, status) => {
  //   changeStatusOrderApi(orderId, status)
  //     .then((res) => {
  //       console.log(res.data);
  //       toast.success("Order Cancelled!", {
  //         autoClose: 1500,
  //       });
  //       handleClose();
  //       setLoading(true);
  //       setTimeout(() => {
  //         navigate("/orders");
  //       }, 1500);
  //       setTimeout(() => {
  //         fetchData();
  //         setLoading(false);
  //       }, 2500);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // const handleReceived = (orderId, status) => {
  //   changeStatusOrderApi(orderId, status)
  //     .then((res) => {
  //       console.log(res.data);
  //       toast.success("Order Cancelled!", {
  //         autoClose: 1500,
  //       });
  //       handleClose();
  //       setLoading(true);
  //       setTimeout(() => {
  //         navigate("/orders");
  //       }, 1500);
  //       setTimeout(() => {
  //         fetchData();
  //         setLoading(false);
  //       }, 2500);
  //     })
  //     .catch((error) => console.log(error));
  // };

  const handleCancel = (orderId, newStatus, order) => {
    changeStatusOrderApi(orderId, newStatus)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Cancelled!", {
          autoClose: 1500,
        });
        updateOrderStatus(orderId, newStatus);
      })
      .then(() => {
        if (order.payment_method === "VNPAY") {
          const description = "Refund because cancelled pre-paid order";
          const orderId = order.id;
          const status = "PROCESSING";
          const storeId = order.store_id;
          const userId = order.user_id;
          const amount = order.final_amount;
          // order.order_detail_list.reduce((total, selectedItem) => {
          //   const difference = order.final_amount - total;
          //   const itemAmount = selectedItem.unit_price * selectedItem.quantity;
          //   return total + Math.min(difference, itemAmount);
          // }, 0);
          const cartItemsRefund = order.order_detail_list
            .filter((item) => item.product_id)
            .map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.quantity * item.unit_price,
            }));

          console.log(
            description,
            status,
            amount,
            storeId,
            userId,
            orderId,
            cartItemsRefund
          );
          addRefundApi(
            description,
            status,
            amount,
            storeId,
            userId,
            orderId,
            cartItemsRefund
          )
            .then((res) => {
              console.log(res.data);
              setSelectedItems([]);
              fetchData();
            })
            .catch((error) => {
              console.error("Failed to send refund request:", error);
            });
        }
      })
      .catch((error) => console.log(error));
  };

  const handleReceived = (orderId, newStatus) => {
    changeStatusOrderApi(orderId, newStatus)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Received!", {
          autoClose: 1500,
        });
        updateOrderStatus(orderId, newStatus);
      })
      .catch((error) => console.log(error));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersByStatus((prevOrders) => {
      const updatedOrders = { ...prevOrders };
      let upToDateOrder;

      for (const status in updatedOrders) {
        const orderIndex = updatedOrders[status].findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          [upToDateOrder] = updatedOrders[status].splice(orderIndex, 1);
          break;
        }
      }

      if (upToDateOrder) {
        upToDateOrder.status_order_list.push({ status: newStatus });
        updatedOrders[newStatus].unshift(upToDateOrder);
      }

      return updatedOrders;
    });

    handleClose();
    setLoading(true);
    setTimeout(() => {
      navigate("/orders");
      fetchData();
      setLoading(false);
    }, 1500);
  };

  console.log(ordersByStatus);

  const handleRepurchase = async (items) => {
    // const reversedItems = [...items].reverse();
    // items?.forEach((index) => {
    //   productByIdApi(index.product_id)
    //   .then((res) => (
    for (const item of items) {
      const res = await productByIdApi(item.product_id);
      console.log(res?.data?.data),
        dispatch(
          addToCart({
            product: {
              id: item.product_id,
              name: res?.data?.data.name,
              price: res?.data?.data.price,
              store_id: res?.data?.data.store_id,
              point: res?.data?.data.point,
              type: res?.data?.data.type,
            },
            quantity: item.quantity,
          })
        );
    }
    toast.success("Your order is now added to cart", { autoClose: 1000 });
    handleClose();
  };

  const handleOpen = (orderId, finalAmount, orderDetails, storeId, order) => {
    setSelectedOrderId(orderId);
    setSelectedFinalAmount(finalAmount);
    setSelectedOrderDetails(orderDetails);
    setSelectedStoreId(storeId);
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrderId(null);
    setSelectedStoreId(null);
  };

  const handleOpenExchange = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenExchange(true);
  };

  const handleCloseExchange = () => {
    setSelectedItems([]);
    setOpenExchange(false);
  };

  const handleOpenRefund = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenRefund(true);
  };

  const handleCloseRefund = () => {
    setSelectedItems([]);
    setOpenRefund(false);
  };

  const handleItemChange = (productId, quantity) => {
    setSelectedItems((prev) => {
      console.log(productId);
      const updatedItems = prev.filter((item) => item.product_id !== productId);
      if (quantity > 0) {
        updatedItems.push({ product_id: productId, quantity });
      }
      return updatedItems;
    });
  };

  const handleItemChange2 = (productId, quantity, unitPrice) => {
    setSelectedItems((prev) => {
      console.log(productId);
      const updatedItems = prev.filter((item) => item.product_id !== productId);
      if (quantity > 0) {
        updatedItems.push({
          product_id: productId,
          quantity,
          unit_price: unitPrice,
        });
      }
      return updatedItems;
    });
  };

  const handleRequestExchange = async (item) => {
    if (description === "") {
      toast.warn("Please input your reason", { autoClose: 1000 });
      return;
    }
    if (selectedItems.length === 0) {
      toast.warn("No item selected for exchaging", { autoClose: 1000 });
      return;
    }
    console.log(selectedItems);
    // const finalAmount = selectedItems.reduce((total, selectedItem) => {
    //   const product = item.order_detail_list.find(
    //     (detail) => detail.id === selectedItem.order_detail_id
    //   );
    //   if (product) {
    //     const productPrice = productMap[product.product_id][3];
    //     return total + selectedItem.quantity * productPrice;
    //   }
    //   return total;
    // }, 0);

    // console.log(finalAmount);
    const orderId = item.id;
    const status = "PROCESSING";
    const storeId = item.store_id;
    const userId = item.user_id;
    const cartItemsExchange = selectedItems
      .filter((item) => item.product_id)
      .map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

    console.log(
      description,
      orderId,
      status,
      storeId,
      userId,
      cartItemsExchange
    );
    addExchangeApi(
      description,
      orderId,
      status,
      storeId,
      userId,
      cartItemsExchange
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Request sent successfully", { autoClose: 1000 });
        setSelectedItems([]);
        handleCloseExchange();
        fetchData();
      })
      .catch((error) => {
        toast.error("Failed to send request!");
        console.error("Failed to send exchange request:", error);
      });
  };

  const handleRequestRefund = async (item) => {
    if (description === "") {
      toast.warn("Please input your reason", { autoClose: 1000 });
      return;
    }
    if (selectedItems.length === 0) {
      toast.warn("No item selected for refunding", { autoClose: 1000 });
      return;
    }

    const orderId = item.id;
    const status = "PROCESSING";
    const storeId = item.store_id;
    const userId = item.user_id;
    const amount = selectedItems.reduce((total, selectedItem) => {
      const difference = item.final_amount - total;
      const itemAmount = selectedItem.unit_price * selectedItem.quantity;
      return total + Math.min(difference, itemAmount);
    }, 0);
    const cartItemsRefund = selectedItems
      .filter((item) => item.product_id)
      .map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.quantity * item.unit_price,
      }));

    console.log(
      description,
      status,
      amount,
      storeId,
      userId,
      orderId,
      cartItemsRefund
    );
    addRefundApi(
      description,
      status,
      amount,
      storeId,
      userId,
      orderId,
      cartItemsRefund
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Request sent successfully", { autoClose: 1000 });
        setSelectedItems([]);
        handleCloseRefund();
        fetchData();
      })
      .catch((error) => {
        toast.error("Failed to send request!");
        console.error("Failed to send refund request:", error);
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
                There's no orders of this status
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ mb: "10px", fontWeight: "bold" }}
                    >
                      Order No. {item.id}{" "}
                    </Typography>
                    {item?.status_order_list[item.status_order_list.length - 1]
                      ?.status === "COMPLETED" && (
                      <Tooltip
                        title="An order can only be submitted for one exchange or refund request at a time."
                        enterDelay={300}
                        leaveDelay={100}
                        placement="left"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 250 }}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#fff4fc",
                              boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.16)",
                              color: "#ff469e",
                              borderRadius: "8px",
                              border: "1px solid #ff469e",
                              fontSize: "1rem",
                            },
                          },
                        }}
                      >
                        <IconButton
                          sx={{
                            p: 0,
                            mb: 1,
                            color: "black",
                            opacity: 0.3,
                            "&:hover": { color: "#ff469e", opacity: 0.9 },
                          }}
                        >
                          <Info sx={{ fontSize: "2rem" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
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
                          {item.order_date}
                        </span>
                      </Typography>
                    </Grid>
                    {item?.status_order_list[item.status_order_list.length - 1]
                      ?.status === "DELIVERING" && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          sx={{
                            mb: "5px",
                            fontWeight: "medium",
                            fontSize: "1.25rem",
                          }}
                        >
                          Delivery Date:{" "}
                          <span style={{ fontWeight: "600" }}>
                            {
                              item.status_order_list[
                                item.status_order_list.length - 1
                              ].date
                            }
                          </span>
                        </Typography>
                      </Grid>
                    )}
                    {item?.status_order_list[item.status_order_list.length - 1]
                      ?.status === "CANCELLED" && (
                      <Grid item xs={12} md={6}>
                        <Typography
                          sx={{
                            mb: "5px",
                            fontWeight: "medium",
                            fontSize: "1.25rem",
                          }}
                        >
                          Cancelled Date:{" "}
                          <span style={{ fontWeight: "600" }}>
                            {
                              item.status_order_list[
                                item.status_order_list.length - 1
                              ].date
                            }
                          </span>
                        </Typography>
                      </Grid>
                    )}
                    {item?.status_order_list[item.status_order_list.length - 2]
                      ?.status === "DELIVERING" &&
                      item?.status_order_list[item.status_order_list.length - 1]
                        ?.status === "COMPLETED" && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                mb: "5px",
                                fontWeight: "medium",
                                fontSize: "1.25rem",
                              }}
                            >
                              Delivery Date:{" "}
                              <span style={{ fontWeight: "600" }}>
                                {
                                  item.status_order_list[
                                    item.status_order_list.length - 2
                                  ].date
                                }
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
                              Received Date:{" "}
                              <span style={{ fontWeight: "600" }}>
                                {
                                  item.status_order_list[
                                    item.status_order_list.length - 1
                                  ].date
                                }
                              </span>
                            </Typography>
                          </Grid>
                        </>
                      )}
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
                        <Typography
                          sx={{
                            fontSize: "1.5rem",
                            color: "#ff469e",
                            fontWeight: "bold",
                            mt: 0.25,
                            ml: 0.75,
                          }}
                        >
                          {storeMap[item.store_id]}
                        </Typography>
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
                                      component="img"
                                      sx={{
                                        width: "70px",
                                        height: "70px",
                                        justifyContent: "center",
                                        alignSelf: "center",
                                        borderRadius: "10px",
                                      }}
                                      image={
                                        productMap[
                                          detail.product_id
                                        ][4]?.includes("Product_")
                                          ? `http://localhost:8080/mamababy/products/images/${
                                              productMap[detail.product_id][4]
                                            }`
                                          : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                                      }
                                      onError={(e) => {
                                        e.target.src =
                                          "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                                      }}
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
                                        {detail.unit_price !== 0 ? (
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
                                                    productId:
                                                      detail.product_id,
                                                  },
                                                },
                                                window.scrollTo({
                                                  top: 0,
                                                  behavior: "smooth",
                                                })
                                              )
                                            }
                                          >
                                            {productMap[detail.product_id][0]
                                              .length > 50
                                              ? `${productMap[
                                                  detail.product_id
                                                ][0].substring(0, 50)}...`
                                              : productMap[
                                                  detail.product_id
                                                ][0]}
                                          </Typography>
                                        ) : (
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
                                                `/productgiftdetail/${productMap[
                                                  detail.product_id
                                                ][0]
                                                  .toLowerCase()
                                                  .replace(/\s/g, "-")}`,
                                                {
                                                  state: {
                                                    productId:
                                                      detail.product_id,
                                                  },
                                                },
                                                window.scrollTo({
                                                  top: 0,
                                                  behavior: "smooth",
                                                })
                                              )
                                            }
                                          >
                                            {productMap[detail.product_id][0]
                                              .length > 50
                                              ? `${productMap[
                                                  detail.product_id
                                                ][0].substring(0, 50)}...`
                                              : productMap[
                                                  detail.product_id
                                                ][0]}
                                          </Typography>
                                        )}

                                        <Typography
                                          sx={{
                                            fontWeight: "600",
                                            fontSize: "1.15rem",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {" "}
                                          {detail.unit_price !== 0
                                            ? formatCurrency(detail.unit_price)
                                            : formatCurrencyPoint(
                                                Math.round(detail.unit_point)
                                              )}{" "}
                                          <span
                                            style={{
                                              fontSize: "1.05rem",
                                              opacity: 0.4,
                                              marginLeft: "4px",
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
                                        <Typography
                                          sx={{
                                            opacity: 0.8,
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: "bold",
                                            fontSize: "1.25rem",
                                          }}
                                        >
                                          <span>=</span>{" "}
                                          <span style={{ marginLeft: "4px" }}>
                                            {detail.unit_price !== 0
                                              ? formatCurrency(
                                                  detail.amount_price
                                                )
                                              : formatCurrencyPoint(
                                                  Math.round(
                                                    detail.amount_point
                                                  )
                                                )}
                                          </span>
                                        </Typography>
                                      </Box>
                                      {item.status_order_list[
                                        item.status_order_list.length - 1
                                      ].status === "COMPLETED" &&
                                        detail.unit_price > 0 && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row",
                                              justifyContent: "flex-end",
                                              mt: 2,
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
                                                    productId:
                                                      detail.product_id,
                                                  },
                                                },
                                                window.scrollTo({
                                                  top: 0,
                                                  behavior: "smooth",
                                                })
                                              )
                                            }
                                          >
                                            <Button
                                              sx={{
                                                color: "#ff469e",
                                                border: "2px solid #ff469e",
                                                borderRadius: "8px",
                                                padding: "8px 16px",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                  backgroundColor: "#ff469e",
                                                  color: "#ffffff",
                                                  transform: "scale(1.05)",
                                                  boxShadow:
                                                    "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                },
                                                "&:active": {
                                                  backgroundColor: "#e0357b",
                                                  borderColor: "#e0357b",
                                                },
                                              }}
                                            >
                                              Comment
                                            </Button>
                                          </Box>
                                        )}
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
                              {item.shipping_address}
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
                        {item.total_point > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              opacity: 0.7,
                              margin: "6px 0",
                            }}
                          >
                            <span>
                              Points used:{" "}
                              <span style={{ fontSize: "1.05rem" }}> </span>
                            </span>
                            {formatCurrencyPoint(item.total_point)}
                          </Box>
                        ) : null}

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
                          onClick={() =>
                            handleOpen(
                              item.id,
                              item.final_amount,
                              "",
                              item.store_id
                            )
                          }
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
                              boxShadow: 10,
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
                                onClick={handleCheckout}
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
                          onClick={() => handleOpen(item.id, "", "", "", item)}
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
                              boxShadow: 10,
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
                                  handleCancel(
                                    selectedOrderId,
                                    "CANCELLED",
                                    selectedOrder
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
                          onClick={() => handleOpen(item.id)}
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
                              boxShadow: 10,
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
                                  handleReceived(selectedOrderId, "COMPLETED")
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
                      .status === "CANCELLED" && (
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
                          onClick={() => (
                            handleOpen("", "", item.order_detail_list),
                            console.log(item.order_detail_list)
                          )}
                        >
                          REPURCHASE
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
                              boxShadow: 10,
                              p: 4,
                            }}
                          >
                            <Typography variant="h6" component="h2">
                              Confirm Repurchase
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              Do you want to repurchase these products?
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
                                  handleRepurchase(selectedOrderDetails)
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
                          onClick={() => (
                            handleOpen("", "", item.order_detail_list),
                            console.log(item.order_detail_list)
                          )}
                        >
                          REPURCHASE
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
                              boxShadow: 10,
                              p: 4,
                            }}
                          >
                            <Typography variant="h6" component="h2">
                              Confirm Repurchase
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              Do you want to repurchase these products?
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
                                  handleRepurchase(selectedOrderDetails)
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
                        {!exchange.some(
                          (exchangeItem) => exchangeItem.order_id === item.id
                        ) &&
                          !refund.some(
                            (refundItem) => refundItem.order_id === item.id
                          ) && (
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
                              onClick={() => handleOpenExchange(item.id)}
                            >
                              EXCHANGE
                            </Button>
                          )}
                        {item.id === selectedOrderId && (
                          <Modal
                            open={openExchange}
                            onClose={handleCloseExchange}
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
                                width: 1080,
                                borderRadius: "20px",
                                backgroundColor: "#fff4fc",
                                border: "2px solid #ff469e",
                                boxShadow: 10,
                                p: 4,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="h2"
                                  sx={{ mt: 1 }}
                                >
                                  Exchange Request
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={handleCloseExchange}
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
                              <Box sx={{ mt: 2 }}>
                                <div style={{ margin: "1rem 0.25rem" }}>
                                  <span
                                    style={{
                                      fontSize: "1.05rem",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Reason:
                                  </span>
                                  <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Input your reason of exchange. E.g: This product is not good"
                                    size="small"
                                    variant="outlined"
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    InputProps={{
                                      sx: {
                                        padding: 1,
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
                                    {item.order_detail_list
                                      .filter((item) => item.unit_price > 0)
                                      .map((detail, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "flex",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          <CardMedia
                                            component="img"
                                            sx={{
                                              width: "70px",
                                              height: "70px",
                                              justifyContent: "center",
                                              alignSelf: "center",
                                              borderRadius: "10px",
                                            }}
                                            image={
                                              productMap[
                                                detail.product_id
                                              ][4]?.includes("Product_")
                                                ? `http://localhost:8080/mamababy/products/images/${
                                                    productMap[
                                                      detail.product_id
                                                    ][4]
                                                  }`
                                                : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                                            }
                                            onError={(e) => {
                                              e.target.src =
                                                "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                                            }}
                                            title={
                                              productMap[detail.product_id][0]
                                            }
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
                                                        productId:
                                                          detail.product_id,
                                                      },
                                                    },
                                                    window.scrollTo({
                                                      top: 0,
                                                      behavior: "smooth",
                                                    })
                                                  )
                                                }
                                              >
                                                {productMap[
                                                  detail.product_id
                                                ][0].length > 60
                                                  ? `${productMap[
                                                      detail.product_id
                                                    ][0].substring(0, 60)}...`
                                                  : productMap[
                                                      detail.product_id
                                                    ][0]}
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontWeight: "600",
                                                  fontSize: "1.15rem",
                                                }}
                                              >
                                                {formatCurrency(
                                                  // productMap[
                                                  //   detail.product_id
                                                  // ][3]
                                                  detail.unit_price
                                                )}
                                                <span
                                                  style={{
                                                    fontSize: "1.05rem",
                                                    opacity: 0.4,
                                                  }}
                                                >
                                                  {" "}
                                                  x{detail.quantity}
                                                </span>
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
                                                    productMap[
                                                      detail.product_id
                                                    ][1]
                                                  ]
                                                }{" "}
                                                |{" "}
                                                {
                                                  categoryMap[
                                                    productMap[
                                                      detail.product_id
                                                    ][2]
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
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mt: 1,
                                              }}
                                            >
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    sx={{
                                                      "&.Mui-checked": {
                                                        color: "#ff469e",
                                                      },
                                                      "&:hover": {
                                                        color: "#ff469e",
                                                      },
                                                      "&.Mui-checked + .MuiTypography-root, &:hover + .MuiTypography-root":
                                                        {
                                                          color: "#ff469e",
                                                        },
                                                    }}
                                                    onChange={(e) =>
                                                      handleItemChange(
                                                        detail.product_id,
                                                        e.target.checked ? 1 : 0
                                                      )
                                                    }
                                                  />
                                                }
                                                label={
                                                  <Typography
                                                    sx={{
                                                      fontWeight: "600",
                                                      "&:hover": {
                                                        color: "#ff469e",
                                                      },
                                                      ".MuiCheckbox-root:hover ~ &":
                                                        {
                                                          color: "#ff469e",
                                                        },
                                                    }}
                                                  >
                                                    Exchange
                                                  </Typography>
                                                }
                                              />
                                              <ButtonGroup
                                                variant="outlined"
                                                aria-label="outlined button group"
                                                style={{
                                                  height: "2rem",
                                                  marginLeft: "1rem",
                                                }}
                                                disabled={
                                                  !selectedItems.some(
                                                    (item) =>
                                                      item.product_id ===
                                                      detail.product_id
                                                  )
                                                }
                                              >
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) === 1
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (currentQuantity >= 10) {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        currentQuantity - 10
                                                      );
                                                    } else {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        1
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
                                                      color: "white",
                                                    },
                                                  }}
                                                >
                                                  --
                                                </Button>
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) === 1
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (currentQuantity >= 1) {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        currentQuantity - 1
                                                      );
                                                    } else {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        1
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
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
                                                    cursor: "default",
                                                    border: "1px solid #ff469e",
                                                    color: "black",
                                                  }}
                                                >
                                                  {Math.max(
                                                    1,
                                                    Math.min(
                                                      detail.quantity,
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity || 1
                                                    )
                                                  )}
                                                </Button>
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) ===
                                                      detail.quantity
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (
                                                      currentQuantity <=
                                                      detail.quantity
                                                    ) {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        currentQuantity + 1
                                                      );
                                                    } else {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        detail.quantity
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
                                                      color: "white",
                                                    },
                                                  }}
                                                >
                                                  +
                                                </Button>
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) ===
                                                      detail.quantity
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (
                                                      currentQuantity <=
                                                      detail.quantity - 10
                                                    ) {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        currentQuantity + 10
                                                      );
                                                    } else {
                                                      handleItemChange(
                                                        detail.product_id,
                                                        detail.quantity
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
                                                      color: "white",
                                                    },
                                                  }}
                                                >
                                                  ++
                                                </Button>
                                              </ButtonGroup>
                                            </Box>
                                          </CardContent>
                                        </div>
                                      ))}
                                  </Box>
                                </Card>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {/* <Box
                                    sx={{
                                      display: "flex",
                                      width: "45%",
                                      justifyContent: "space-between",
                                      mt: 1,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "1.45rem",
                                      }}
                                    >
                                      Total Exchange:
                                    </span>
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "1.5rem",
                                        color: "#ff469e",
                                      }}
                                    >
                                      {formatCurrency(
                                        selectedItems.reduce(
                                          (total, selectedItem) => {
                                            const product =
                                              item.order_detail_list.find(
                                                (detail) =>
                                                  detail.id ===
                                                  selectedItem.order_detail_id
                                              );
                                            if (product) {
                                              const productPrice =
                                                productMap[
                                                  product.product_id
                                                ][3];
                                              return (
                                                total +
                                                selectedItem.quantity *
                                                  productPrice
                                              );
                                            }
                                            return total;
                                          },
                                          0
                                        )
                                      )}
                                    </span>
                                  </Box> */}
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
                                    onClick={() => handleRequestExchange(item)}
                                  >
                                    Send
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Modal>
                        )}
                        {!exchange.some(
                          (exchangeItem) => exchangeItem.order_id === item.id
                        ) &&
                          !refund.some(
                            (refundItem) => refundItem.order_id === item.id
                          ) && (
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
                              onClick={() => handleOpenRefund(item.id)}
                            >
                              REFUND
                            </Button>
                          )}
                        {item.id === selectedOrderId && (
                          <Modal
                            open={openRefund}
                            onClose={handleCloseRefund}
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
                                width: 1100,
                                borderRadius: "20px",
                                backgroundColor: "#fff4fc",
                                border: "2px solid #ff469e",
                                boxShadow: 10,
                                p: 4,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  component="h2"
                                  sx={{ mt: 1, fontWeight: "bold" }}
                                >
                                  Refund Request
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={handleCloseRefund}
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
                              <Box sx={{ mt: 2 }}>
                                <div style={{ margin: "1rem 0.25rem" }}>
                                  <span
                                    style={{
                                      fontSize: "1.05rem",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Reason:
                                  </span>
                                  <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Input your reason of refund. E.g: This product is not good"
                                    size="small"
                                    variant="outlined"
                                    value={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    InputProps={{
                                      sx: {
                                        padding: 1,
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
                                    {item.order_detail_list
                                      .filter((item) => item.unit_price > 0)
                                      .map((detail, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "flex",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          <CardMedia
                                            component="img"
                                            sx={{
                                              width: "70px",
                                              height: "70px",
                                              justifyContent: "center",
                                              alignSelf: "center",
                                              borderRadius: "10px",
                                            }}
                                            image={
                                              productMap[
                                                detail.product_id
                                              ][4]?.includes("Product_")
                                                ? `http://localhost:8080/mamababy/products/images/${
                                                    productMap[
                                                      detail.product_id
                                                    ][4]
                                                  }`
                                                : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                                            }
                                            onError={(e) => {
                                              e.target.src =
                                                "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                                            }}
                                            title={
                                              productMap[detail.product_id][0]
                                            }
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
                                                        productId:
                                                          detail.product_id,
                                                      },
                                                    },
                                                    window.scrollTo({
                                                      top: 0,
                                                      behavior: "smooth",
                                                    })
                                                  )
                                                }
                                              >
                                                {productMap[
                                                  detail.product_id
                                                ][0].length > 60
                                                  ? `${productMap[
                                                      detail.product_id
                                                    ][0].substring(0, 60)}...`
                                                  : productMap[
                                                      detail.product_id
                                                    ][0]}
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontWeight: "600",
                                                  fontSize: "1.15rem",
                                                }}
                                              >
                                                {formatCurrency(
                                                  // productMap[
                                                  //   detail.product_id
                                                  // ][3]
                                                  detail.unit_price
                                                )}
                                                <span
                                                  style={{
                                                    fontSize: "1.05rem",
                                                    opacity: 0.4,
                                                  }}
                                                >
                                                  {" "}
                                                  x{detail.quantity}
                                                </span>
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
                                                    productMap[
                                                      detail.product_id
                                                    ][1]
                                                  ]
                                                }{" "}
                                                |{" "}
                                                {
                                                  categoryMap[
                                                    productMap[
                                                      detail.product_id
                                                    ][2]
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
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mt: 1,
                                              }}
                                            >
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    sx={{
                                                      "&.Mui-checked": {
                                                        color: "#ff469e",
                                                      },
                                                      "&:hover": {
                                                        color: "#ff469e",
                                                      },
                                                      "&.Mui-checked + .MuiTypography-root, &:hover + .MuiTypography-root":
                                                        {
                                                          color: "#ff469e",
                                                        },
                                                    }}
                                                    onChange={(e) =>
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        e.target.checked
                                                          ? 1
                                                          : 0,
                                                        detail.unit_price
                                                      )
                                                    }
                                                  />
                                                }
                                                label={
                                                  <Typography
                                                    sx={{
                                                      fontWeight: "600",
                                                      "&:hover": {
                                                        color: "#ff469e",
                                                      },
                                                      ".MuiCheckbox-root:hover ~ &":
                                                        {
                                                          color: "#ff469e",
                                                        },
                                                    }}
                                                  >
                                                    Refund
                                                  </Typography>
                                                }
                                              />
                                              <ButtonGroup
                                                variant="outlined"
                                                aria-label="outlined button group"
                                                style={{
                                                  height: "2rem",
                                                  marginLeft: "1rem",
                                                }}
                                                disabled={
                                                  !selectedItems.some(
                                                    (item) =>
                                                      item.product_id ===
                                                      detail.product_id
                                                  )
                                                }
                                              >
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) === 1
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (currentQuantity >= 10) {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        currentQuantity - 10,
                                                        detail.unit_price
                                                      );
                                                    } else {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        1,
                                                        detail.unit_price
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
                                                      color: "white",
                                                    },
                                                  }}
                                                >
                                                  --
                                                </Button>
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) === 1
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (currentQuantity >= 1) {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        currentQuantity - 1,
                                                        detail.unit_price
                                                      );
                                                    } else {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        1,
                                                        detail.unit_price
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
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
                                                    cursor: "default",
                                                    border: "1px solid #ff469e",
                                                    color: "black",
                                                  }}
                                                >
                                                  {Math.max(
                                                    1,
                                                    Math.min(
                                                      detail.quantity,
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity || 1
                                                    )
                                                  )}
                                                </Button>
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) ===
                                                      detail.quantity
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (
                                                      currentQuantity <=
                                                      detail.quantity
                                                    ) {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        currentQuantity + 1,
                                                        detail.unit_price
                                                      );
                                                    } else {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        detail.quantity,
                                                        detail.unit_price
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
                                                      color: "white",
                                                    },
                                                  }}
                                                >
                                                  +
                                                </Button>
                                                <Button
                                                  variant="contained"
                                                  disabled={
                                                    !selectedItems.some(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    ) ||
                                                    (selectedItems.find(
                                                      (item) =>
                                                        item.product_id ===
                                                        detail.product_id
                                                    )?.quantity ||
                                                      detail.quantity) ===
                                                      detail.quantity
                                                  }
                                                  onClick={() => {
                                                    const currentQuantity =
                                                      selectedItems.find(
                                                        (item) =>
                                                          item.product_id ===
                                                          detail.product_id
                                                      )?.quantity ||
                                                      detail.quantity;
                                                    if (
                                                      currentQuantity <=
                                                      detail.quantity - 10
                                                    ) {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        currentQuantity + 10,
                                                        detail.unit_price
                                                      );
                                                    } else {
                                                      handleItemChange2(
                                                        detail.product_id,
                                                        detail.quantity,
                                                        detail.unit_price
                                                      );
                                                    }
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
                                                      backgroundColor:
                                                        "#ff469e",
                                                      color: "white",
                                                    },
                                                  }}
                                                >
                                                  ++
                                                </Button>
                                              </ButtonGroup>
                                            </Box>
                                          </CardContent>
                                        </div>
                                      ))}
                                  </Box>
                                </Card>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      width: "35%",
                                      justifyContent: "space-between",
                                      mt: 1,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "1.45rem",
                                      }}
                                    >
                                      <Tooltip
                                        title="The total refund has been deducted for the discount."
                                        enterDelay={300}
                                        leaveDelay={100}
                                        placement="bottom-end"
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 250 }}
                                        componentsProps={{
                                          tooltip: {
                                            sx: {
                                              backgroundColor: "#fff4fc",
                                              boxShadow:
                                                "1px 1px 3px rgba(0, 0, 0, 0.16)",
                                              color: "#ff469e",
                                              borderRadius: "8px",
                                              border: "1px solid #ff469e",
                                              fontSize: "1rem",
                                            },
                                          },
                                        }}
                                      >
                                        <IconButton
                                          sx={{
                                            p: 0,
                                            mr: 1,
                                            mb: 0.5,
                                            color: "black",
                                            opacity: 0.3,
                                            "&:hover": {
                                              color: "#ff469e",
                                              opacity: 0.9,
                                            },
                                          }}
                                        >
                                          <Info sx={{ fontSize: "1.75rem" }} />
                                        </IconButton>
                                      </Tooltip>
                                      Total Refund:
                                    </span>
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "1.5rem",
                                        color: "#ff469e",
                                      }}
                                    >
                                      {formatCurrency(
                                        selectedItems.reduce(
                                          (total, selectedItem) => {
                                            const difference =
                                              item.final_amount - total;
                                            const itemAmount =
                                              selectedItem.unit_price *
                                              selectedItem.quantity;
                                            return (
                                              total +
                                              Math.min(difference, itemAmount)
                                            );
                                          },
                                          0
                                        )
                                      )}
                                      {/* {formatCurrency(
                                        selectedItems.reduce(
                                          (total, selectedItem) => {
                                            return (
                                              Math.min(total +
                                              selectedItem.unit_price *
                                                selectedItem.quantity
                                            ), item.final_amount);
                                          },
                                          0
                                        )
                                      )}{" "} */}
                                    </span>
                                  </Box>
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
                                    onClick={() => handleRequestRefund(item)}
                                  >
                                    Send
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Modal>
                        )}
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
    </div>
  );
}
