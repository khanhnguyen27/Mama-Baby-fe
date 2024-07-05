import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  allOrderApi,
  changeStatusOrderApi,
  orderByStoreIdApi,
} from "../../api/OrderAPI";
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
} from "@mui/material";
import { toast } from "react-toastify";
import { allProductByStoreApi } from "../../api/ProductAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { useNavigate } from "react-router-dom";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { allVoucherApi } from "../../api/VoucherAPI";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function OrdersManagement() {
  window.document.title = "Orders Management";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [ordersByStatus, setOrdersByStatus] = useState({
    PENDING: [],
    PREPARING: [],
    DELIVERING: [],
    COMPLETED: [],
    CANCELLED: [],
    // RETURNED: [],
  });
  const [productMap, setProductMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [voucherMap, setVoucherMap] = useState({});
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    storeByUserIdApi(userId)
      .then((res) => {
        setStore(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const storeId = store.id;
  // useEffect(() => {
  //   storeByUserIdApi(userId)
  //     .then((res) => {
  //       setStore(res?.data?.data);
  //       const storeId = res?.data?.data?.id;
  //       console.log(storeId);
  //       return storeId;
  //     })
  //     .then((storeId) => {
  //       fetchData(storeId);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const fetchData = async () => {
    try {
      const [orderRes, productRes, brandRes, categoryRes, voucherRes] =
        await Promise.all([
          orderByStoreIdApi(storeId),
          allProductByStoreApi({ limit: 1000 }),
          allBrandApi(),
          allCategorytApi(),
          allVoucherApi(),
        ]);

      const orderData = orderRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const voucherData = voucherRes?.data?.data || [];

      const categorizedOrders = {
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
  }, [storeId]);

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

  // const handleAccept = (orderId, status) => {
  //   changeStatusOrderApi(orderId, status)
  //     .then((res) => {
  //       console.log(res.data);
  //       toast.success("Order Accepted!", {
  //         autoClose: 1500,
  //       });
  //       handleClose();
  //       setLoading(true);
  //       setTimeout(() => {
  //         navigate("/staff/orders");
  //       }, 1500);
  //       setTimeout(() => {
  //         fetchData();
  //         setLoading(false);
  //       }, 2500);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // const handleReject = (orderId, status) => {
  //   changeStatusOrderApi(orderId, status)
  //     .then((res) => {
  //       console.log(res.data);
  //       toast.success("Order Rejected!", {
  //         autoClose: 1500,
  //       });
  //       handleClose();
  //       setLoading(true);
  //       setTimeout(() => {
  //         navigate("/staff/orders");
  //       }, 1500);
  //       setTimeout(() => {
  //         fetchData();
  //         setLoading(false);
  //       }, 2500);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // const handleDeliver = (orderId, status) => {
  //   changeStatusOrderApi(orderId, status)
  //     .then((res) => {
  //       console.log(res.data);
  //       toast.success("Order Is Now Delivering!", {
  //         autoClose: 1500,
  //       });
  //       handleClose();
  //       setLoading(true);
  //       setTimeout(() => {
  //         navigate("/staff/orders");
  //       }, 1500);
  //       setTimeout(() => {
  //         fetchData();
  //         setLoading(false);
  //       }, 2500);
  //     })
  //     .catch((error) => console.log(error));
  // };

  const handleAccept = (orderId, newStatus) => {
    changeStatusOrderApi(orderId, newStatus)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Accepted!", { autoClose: 1500 });
        updateOrderStatus(orderId, newStatus);
      })
      .catch((error) => console.log(error));
  };

  const handleReject = (orderId, newStatus) => {
    changeStatusOrderApi(orderId, newStatus)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Rejected!", { autoClose: 1500 });
        updateOrderStatus(orderId, newStatus);
      })
      .catch((error) => console.log(error));
  };

  const handleDeliver = (orderId, newStatus) => {
    changeStatusOrderApi(orderId, newStatus)
      .then((res) => {
        console.log(res.data);
        toast.success("Order Is Now Delivering!", { autoClose: 1500 });
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
      navigate("/staff/orders");
      setLoading(false);
    }, 1500);
  };

  const handleOpen = (type, orderId) => {
    setActionType(type);
    setSelectedOrderId(orderId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrderId(null);
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
                minHeight: "75vh",
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
                height: "75vh",
                maxWidth: 1000,
                maxHeight: "90vh",
                overflowY: "auto",
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
                        <Grid container spacing={4}>
                          <Grid
                            item
                            xs={8.5}
                            sm={9.5}
                            md={10.5}
                            lg={11.5}
                            xl={12}
                          >
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
                                              `/staff/products/${productMap[
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
                                          {productMap[detail.product_id][0]
                                            .length > 60
                                            ? `${productMap[
                                                detail.product_id
                                              ][0].substring(0, 60)}...`
                                            : productMap[detail.product_id][0]}
                                        </Typography>
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
                                        <Typography sx={{ opacity: 0.8 }}>
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              display: "flex",
                                              alignItems: "center",
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
                        <Divider sx={{ width: "70%", my: 1 }} />
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
                            <span style={{ opacity: 0.7 }}>Address:</span>
                            <span style={{ fontWeight: "600" }}>
                              {item.shipping_address}
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
                          onClick={() => handleOpen("Reject", item.id)}
                        >
                          REJECT ORDER
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
                          onClick={() => handleOpen("Accept", item.id)}
                        >
                          ACCEPT ORDER
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
                              {actionType === "Accept"
                                ? "Accept Order"
                                : "Reject Order"}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              {actionType === "Accept"
                                ? "Are you sure you want to accept this order?"
                                : "Are you sure you want to reject this order?"}
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
                                onClick={() => {
                                  {
                                    actionType === "Accept"
                                      ? handleAccept(
                                          selectedOrderId,
                                          "PREPARING"
                                        )
                                      : handleReject(
                                          selectedOrderId,
                                          "CANCELLED"
                                        );
                                  }
                                }}
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
                      .status === "PREPARING" && (
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
                          onClick={() => handleOpen("Deliver", item.id)}
                        >
                          READY TO DELIVER
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
                              Ready to deliver
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              Are you sure to deliver this order?
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
                                onClick={() => {
                                  handleDeliver(selectedOrderId, "DELIVERING");
                                }}
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
