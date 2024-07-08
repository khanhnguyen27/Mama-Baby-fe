import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Typography,
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
  Tabs,
  Tab,
  Pagination,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  TableContainer,
  TableHead,
  Table,
} from "@mui/material";
import { refundByStoreIdApi, updateRefundApi } from "../../api/RefundAPI";
import { allProductByStoreApi } from "../../api/ProductAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { allOrderApi, getOrderByIdApi } from "../../api/OrderAPI";
import { useNavigate } from "react-router-dom";
import { Close, ExpandMore, KeyboardCapslock } from "@mui/icons-material";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";

export default function OrdersManagement() {
  window.document.title = "Orders Management";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [refund, setRefund] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [orderMap, setOrderMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openRefuse, setOpenRefuse] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log(productMap);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await storeByUserIdApi(userId);
        setStore(res?.data?.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStoreData();
  }, [userId]);

  const storeId = store?.id;

  useEffect(() => {
    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [refundRes, productRes, brandRes, categoryRes, orderRes] =
        await Promise.all([
          refundByStoreIdApi(storeId),
          allProductByStoreApi({ limit: 1000 }),
          allBrandApi(),
          allCategorytApi(),
          allOrderApi(),
        ]);

      setRefund(refundRes?.data?.data || []);

      const productData = productRes?.data?.data?.products || [];
      setProductMap(
        productData.reduce((x, item) => {
          x[item.id] = [item.name, item.brand_id, item.category_id, item.price];
          return x;
        }, {})
      );

      setBrandMap(
        brandRes?.data?.data.reduce((x, item) => {
          x[item.id] = item.name;
          return x;
        }, {})
      );

      setCategoryMap(
        categoryRes?.data?.data.reduce((x, item) => {
          x[item.id] = item.name;
          return x;
        }, {})
      );

      setOrderMap(
        orderRes?.data?.data.reduce((acc, item) => {
          acc[item.id] = [
            item.full_name,
            item.shipping_address,
            item.phone_number,
          ];
          return acc;
        }, {})
      );
    } catch (err) {
      console.log(err);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleAcceptRefund = async () => {
    if (selectedRefundId) {
      const selectedRefund = refund.find(
        (item) => item.id === selectedRefundId
      );
      console.log("slect", selectedRefund);
      if (selectedRefund) {
        try {
          await updateRefundApi(
            selectedRefund.id,
            selectedRefund.description,
            selectedRefund.store_id,
            selectedRefund.user_id,
            selectedRefund.order_id,
            "ACCEPT",
            selectedRefund.refund_detail_list
          );
          toast.success("Refund updated successfully!");
          fetchData();
          handleClose();
        } catch (error) {
          console.error("Error updating refund status:", error);
          toast.error("Failed to update refund status.");
        }
      } else {
        alert("Selected refund not found in the list");
      }
    } else {
      alert("Please select a refund to approve");
    }
  };

  const handleRefuseRefund = async () => {
    if (selectedRefundId) {
      const selectedRefund = refund.find(
        (item) => item.id === selectedRefundId
      );
      if (selectedRefund) {
        try {
          await updateRefundApi(
            selectedRefund.id,
            selectedRefund.description,
            selectedRefund.storeId,
            selectedRefund.userId,
            selectedRefund.orderId,
            "REFUSE",
            selectedRefund.cartItemsRefund
          );
          toast.success("Refund updated successfully!");
          fetchData();
          handleClose();
        } catch (error) {
          console.error("Error updating refund status:", error);
          toast.error("Failed to update refund status.");
        }
      } else {
        alert("Selected refund not found in the list");
      }
    } else {
      alert("Please select a refund to approve");
    }
  };

  const handleOpenAccept = (refundId) => {
    setSelectedRefundId(refundId);
    setOpenAccept(true);
  };

  const handleOpenRefuse = (refundId) => {
    setSelectedRefundId(refundId);
    setOpenRefuse(true);
  };

  const handleClose = () => {
    setOpenAccept(false);
    setOpenRefuse(false);
    setSelectedRefundId(null);
  };

  const handleOpenOrderDetail = async (order_id) => {
    try {
      const response = await getOrderByIdApi(order_id);
      setSelectedOrder(response.data.data);
      setOpenOrderDetail(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseOrderDetail = () => {
    setOpenOrderDetail(false);
    setTimeout(() => {
      setSelectedOrder(null);
    }, 500);
  };

  const handleTabChange = (e, newValue) => {
    setLoading(true);
    setTabValue(newValue);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatDateTime = (dateTime) => {
    try {
      const parsedDate = parseISO(dateTime);
      return format(parsedDate, "HH:mm dd-MM-yyyy");
    } catch (error) {
      console.error("Invalid date format:", dateTime, error);
      return "Invalid date";
    }
  };

  // Tạo bản sao của mảng refund để tránh thay đổi mảng gốc
  const refundCopy = [...refund];

  // Sắp xếp các mục refund theo createDate từ cũ nhất đến mới nhất
  const sortedRefunds = refundCopy.sort(
    (a, b) => new Date(b.create_date) - new Date(a.create_date)
  );

  // Lọc các mục theo tabValue
  const filteredRefunds = sortedRefunds.filter((item) => {
    if (tabValue === 0) {
      return item.status === "PROCESSING";
    } else if (tabValue === 1) {
      return item.status === "ACCEPT";
    } else if (tabValue === 2) {
      return item.status === "REFUSE";
    }
    return false;
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Tính toán các mục sẽ hiển thị trên trang hiện tại
  const paginatedRefunds = filteredRefunds.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
          <Tab
            key={"PROCESSING"}
            label={"PROCESSING"}
            sx={{
              backgroundColor: "#fff4fc",
              color: "#ff469e",
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
                backgroundColor: "#ff469e",
              },
            }}
          />
          <Tab
            key={"ACCEPT"}
            label={"ACCEPT"}
            sx={{
              backgroundColor: "#fff4fc",
              color: "#ff469e",
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
                backgroundColor: "#ff469e",
              },
            }}
          />
          <Tab
            key={"REFUSE"}
            label={"REFUSE"}
            sx={{
              backgroundColor: "#fff4fc",
              color: "#ff469e",
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
                backgroundColor: "#ff469e",
              },
            }}
          />
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
          ) : paginatedRefunds.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "75vh",
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
                There's no refund of this status
              </Typography>
            </Box>
          ) : (
            paginatedRefunds.map((item) => (
              <Card
                key={item.id}
                sx={{
                  mb: "16px",
                  padding: "16px",
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.16)",
                }}
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: "10px" }}
                >
                  <Grid item>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Refund No. {item.id}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mr: 1 }}
                      >
                        Order ID: {item.order_id}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          handleOpenOrderDetail(item.order_id);
                        }}
                        sx={{ "&:hover": { color: "#ff469e" } }}
                      >
                        <PlagiarismIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
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
                      Refund Date:{" "}
                      <span style={{ fontWeight: "600" }}>
                        {formatDateTime(item.create_date)}
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
                      <span style={{ fontWeight: "600" }}>{item.status}</span>
                    </Typography>
                  </Grid>
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
                        {item.refund_detail_list.length === 0
                          ? ""
                          : `(${item.refund_detail_list.length} ${
                              item.refund_detail_list.length === 1
                                ? "item"
                                : "items"
                            })`}
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
                              {item.refund_detail_list.map((detail, index) => {
                                const product = productMap[detail.product_id];
                                if (!product) {
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <Typography color="error">
                                        Product not found for product_id:{" "}
                                        {detail.product_id}
                                      </Typography>
                                    </div>
                                  );
                                }

                                return (
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
                                      title={product[0]}
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
                                              `/staff/products/${product[0]
                                                .toLowerCase()
                                                .replace(/\s/g, "-")}`,
                                              {
                                                state: {
                                                  productId: detail.product_id,
                                                  status: store?.is_active,
                                                },
                                              },
                                              window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                              })
                                            )
                                          }
                                        >
                                          {product[0].length > 60
                                            ? `${product[0].substring(
                                                0,
                                                60
                                              )}...`
                                            : product[0]}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontWeight: "600",
                                            fontSize: "1.15rem",
                                          }}
                                        >
                                          {formatCurrency(detail.unit_price)}{" "}
                                          <span
                                            style={{
                                              fontSize: "1.05rem",
                                              opacity: 0.4,
                                            }}
                                          >
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
                                          {brandMap[product[1]]} |{" "}
                                          {categoryMap[product[2]]}
                                        </Typography>
                                        <Typography sx={{ opacity: 0.8 }}>
                                          <span
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                            }}
                                          >
                                            = {formatCurrency(detail.amount)}
                                          </span>
                                        </Typography>
                                      </Box>
                                    </CardContent>
                                  </div>
                                );
                              })}
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
                      </span>
                      {}
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
                            {orderMap[item.order_id][0]}
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
                            {orderMap[item.order_id][1]}
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
                            {orderMap[item.order_id][2]}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "5px",
                        fontWeight: "medium",
                        fontSize: "1.25rem",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
                      {item.description}
                    </Typography>
                    <Typography
                      sx={{
                        mb: "5px",
                        fontWeight: "medium",
                        textAlign: "right",
                        fontSize: "1.25rem",
                      }}
                    >
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
                          Refund Amount:
                        </span>
                        <span
                          style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                        >
                          {formatCurrency(item.amount)}
                        </span>
                      </Box>
                    </Typography>
                    {item.status !== "ACCEPT" && item.status !== "REFUSE" && (
                      <Box sx={{ textAlign: "right" }}>
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
                          onClick={() => handleOpenAccept(item.id)}
                          disabled={!store?.is_active}
                        >
                          ACCEPT REFUND
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
                          onClick={() => handleOpenRefuse(item.id)}
                          disabled={!store?.is_active}
                        >
                          REFUSE REFUND
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Card>
            ))
          )}
          <Pagination
            count={Math.ceil(filteredRefunds.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            // sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2.5rem",
              p: 1,
              opacity: 0.9,
              borderRadius: "20px",
              "& .MuiPaginationItem-root": {
                backgroundColor: "white",
                borderRadius: "20px",
                border: "1px solid black",
                boxShadow: "0px 2px 3px rgba(0, 0, 0.16, 0.5)",
                mx: 1,
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    border: "1px solid #ff469e",
                  },
                },
                fontSize: "1.25rem",
              },
              "& .MuiPaginationItem-ellipsis": {
                mt: 2,
                fontSize: "1.25rem",
              },
            }}
          />
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
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <KeyboardCapslock />
          </IconButton>
        )}

        <Modal
          open={openAccept}
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
              Approve application
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to accept this refund?
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
                  handleAcceptRefund(selectedRefundId);
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
        <Modal
          open={openRefuse}
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
              Approve application
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to refuse this refund?
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
                  handleRefuseRefund(selectedRefundId);
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
      </Container>
      <Dialog open={openOrderDetail} onClose={handleCloseOrderDetail}>
        <Box sx={{ width: "100%", textAlign: "right", pt: 2, px: 2.5 }}>
          <Close
            fontSize="large"
            onClick={() => handleCloseOrderDetail()}
            sx={{
              cursor: "pointer",
              textAlign: "right",
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
        </Box>
        <DialogTitle
          sx={{
            fontSize: "2rem",
            color: "#323232",
            fontWeight: "bold",
            textAlign: "center",
            pt: 0,
          }}
        >
          Information order
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.25rem",
                          color: "#ff469e",
                          fontWeight: "bold",
                        }}
                      >
                        Order ID: {selectedOrder.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                        }}
                      >
                        Order Date:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {formatDateTime(selectedOrder.order_date)}
                        </span>
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Full name:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {selectedOrder.full_name}
                    </span>{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Phone:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {selectedOrder.phone_number}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Shipping Address:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {selectedOrder.shipping_address}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    Payment Method:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {selectedOrder.payment_method}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      color: "#ff469e",
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}
                  >
                    Order Details:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "600", width: "40%" }}>
                            Product Name
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "600" }}>
                            Unit Price
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "600" }}>
                            Quantity
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "600" }}>
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.order_detail_list.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell component="th" scope="row">
                              {productMap[detail.product_id][0]}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(detail.unit_price)}
                            </TableCell>
                            <TableCell align="right">
                              {detail.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(detail.amount_price)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={6}>
                  {" "}
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: "1rem" }}>
                        Total Amount:
                      </Typography>
                      <Typography>
                        {formatCurrency(selectedOrder.amount)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography sx={{ fontSize: "1rem" }}>
                        Total Discount:
                      </Typography>
                      <Typography>
                        - {formatCurrency(selectedOrder.total_discount)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        mt: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                        Final Amount:
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", color: "red" }}>
                        {formatCurrency(selectedOrder.final_amount)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        fontSize: "1.25rem",
                        color: "#ff469e",
                        fontWeight: "bold",
                        marginBottom: 2,
                      }}
                    >
                      Order Status:
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "600" }}>
                              Date
                            </TableCell>
                            <TableCell sx={{ fontWeight: "600" }}>
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.status_order_list.map(
                            (status, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {formatDateTime(status.date)}
                                </TableCell>
                                <TableCell>{status.status}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
