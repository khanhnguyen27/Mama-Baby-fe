import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { orderByUserIdApi } from "../../api/OrderAPI";
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
} from "@mui/material";
import { makePaymentApi } from "../../api/VNPayAPI";
import { toast } from "react-toastify";
import { allProductApi } from "../../api/ProductAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { useNavigate } from "react-router-dom";
import { ExpandMore } from "@mui/icons-material";

export default function Orders() {
  window.document.title = "Your Orders";
  const navigate = useNavigate();
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
  const [productMap, setProductMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [tabValue, setTabValue] = useState(0);

  const fetchData = async () => {
    try {
      const [orderRes, productRes, brandRes, categoryRes] = await Promise.all([
        orderByUserIdApi(userId),
        allProductApi(),
        allBrandApi(),
        allCategorytApi(),
      ]);
      const orderData = orderRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];

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
      setOrdersByStatus(categorizedOrders);

      const productMap = productData.reduce((x, item) => {
        x[item.id] = [item.name, item.brand_id, item.category_id];
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
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
          {ordersByStatus[Object.keys(ordersByStatus)[tabValue]].map((item) => (
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
              <Typography variant="h5" sx={{ mb: "10px", fontWeight: "bold" }}>
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
                    <span style={{ fontWeight: "600" }}>{item.orderDate}</span>
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
                  sx={{ minWidth: "75vw", border: "none", boxShadow: "none" }}
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
                    <Card
                      sx={{
                        px: 2,
                        border: "1px solid #ff469e",
                        borderRadius: "20px",
                        my: 2,
                        minHeight: "120px",
                      }}
                    >
                      {item.order_detail_list.map((detail, index) => (
                        <div key={index} style={{ display: "flex" }}>
                          <CardMedia
                            sx={{
                              width: "70px",
                              height: "70px",
                              justifyContent: "center",
                              alignSelf: "center",
                            }}
                            image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                            title={productMap[detail.product_id][0]}
                          />
                          <CardContent sx={{ flex: "1 0 auto", ml: 2 }}>
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
                                    { state: { productId: detail.product_id } },
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
                                  fontWeight: "bold",
                                  fontSize: "1.25rem",
                                }}
                              >
                                {formatCurrency(detail.amount_price)}
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
                                {brandMap[productMap[detail.product_id][1]]} |{" "}
                                {categoryMap[productMap[detail.product_id][2]]}
                              </Typography>
                              <Typography sx={{ opacity: 0.8 }}>
                                Quantity: {detail.quantity}
                              </Typography>
                            </Box>                            
                          </CardContent>
                        </div>
                      ))}
                    </Card>
                  </AccordionDetails>
                </Accordion>

                <Grid item xs={12} md={8}>
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
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>Address</span>
                      <span style={{ display: "block", fontWeight: "600" }}>
                        {item.shippingAddress}
                      </span>
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>Contact</span>
                      <span style={{ display: "block", fontWeight: "600" }}>
                        {item.phone_number}
                      </span>
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      mb: "5px",
                      fontWeight: "medium",
                      textAlign: "right",
                      fontSize: "1.25rem",
                    }}
                  >
                    <span style={{ display: "block", fontWeight: "bold" }}>
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
                      <span>Discount:</span>
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
                      <span style={{ fontWeight: "bold", fontSize: "1.35rem" }}>Total:</span>
                      <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
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
                        handleCheckout(item.final_amount, "VNBANK", item.id)
                      }
                    >
                      COMPLETE PAYMENT
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Card>
          ))}
        </Box>
      </Container>
    </div>
  );
}
