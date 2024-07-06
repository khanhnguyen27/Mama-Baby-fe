import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allProductByStoreApi } from "../../api/ProductAPI";
import { exchangeByUserIdApi } from "../../api/ExchangeAPI";
import { refundByUserIdApi } from "../../api/RefundAPI";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";
import { allStoreApi } from "../../api/StoreAPI";

export default function Requests() {
  const navigate = useNavigate();
  window.document.title = "Your Requests";
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productMap, setProductMap] = useState({});
  const [storeMap, setStoreMap] = useState({});
  const [exchange, setExchange] = useState([]);
  const [refund, setRefund] = useState([]);
  const [view, setView] = useState("all");
  const [filterStatus, setFilterStatus] = useState("-");


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
      const [productRes, storeRes, exchangeRes, refundRes] = await Promise.all([
        allProductByStoreApi({ limit: 1000 }),
        allStoreApi({ limit: 1000 }),
        exchangeByUserIdApi(userId),
        refundByUserIdApi(userId),
      ]);

      const productData = productRes?.data?.data?.products || [];
      const storeData = storeRes?.data?.data?.stores || [];
      const exchangeData = exchangeRes?.data?.data || [];
      const refundData = refundRes?.data?.data || [];

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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleStatusFilterChange = () => {
    const statusOrder = ["-", "P", "A", "R"];
    const currentIndex = statusOrder.indexOf(filterStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    setFilterStatus(statusOrder[nextIndex]);
  };

  const filteredExchanges = exchange.filter(
    (item) =>
      filterStatus === "-" || item.status.startsWith(filterStatus)
  );

  const filteredRefunds = refund.filter(
    (item) =>
      filterStatus === "-" || item.status.startsWith(filterStatus)
  );

  const handleViewChange = (e, newView) => {
    setLoading(true);
    if (newView !== null) {
      setView(newView);
    }
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "77vh",
          maxWidth: "100vw",
          backgroundColor: "#f5f7fd",
        }}
      >
        <CircularProgress sx={{ color: "#ff469e" }} size={90} />
      </Box>
    );
  }

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container
        sx={{
          my: 4,
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: 4,
          paddingBottom: "10px"
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            pt: 2,
            color: "#ff469e",
            fontWeight: "bold",
          }}
        >
          Your Requests
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            variant="outlined"
            sx={{
              mb: 4,
              height: "40px",
              "& .MuiToggleButton-root": {
                color: "black",
                border: "1px solid #ff469e",
                fontSize: "1rem",
                fontWeight: "bold",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
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
              },
            }}
          >
            <ToggleButton
              value="all"
              sx={{
                backgroundColor: "white",
                color: "#ff469e",
                borderRadius: "20px",
                fontSize: "1rem",
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
              All
            </ToggleButton>
            <ToggleButton
              value="exchange"
              sx={{
                backgroundColor: "white",
                color: "#ff469e",
                borderLeft: "1px solid #ff469e",
                borderRight: "1px solid #ff469e",
                fontSize: "1rem",
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
              Exchanges
            </ToggleButton>
            <ToggleButton
              value="refund"
              sx={{
                backgroundColor: "white",
                color: "#ff469e",
                borderRadius: "20px",
                fontSize: "1rem",
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
              Refunds
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: "white",
              color: "#ff469e",
              borderRadius: "10px",
              fontSize: "1rem",
              height: "36px",
              width: "40px",
              padding: "4px 12px",
              fontWeight: "bold",
              mx: 0.25,
              transition:
                "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
              border: "1px solid #ff469e",
              "&:hover": {
                backgroundColor: "#ff469e",
                color: "white",
                border: "1px solid white",
              },
            }}
            onClick={handleStatusFilterChange}
          >
            {filterStatus === "-" ? "-" : filterStatus}
          </IconButton>
        </Box>
        <Grid container spacing={4}>
          {(view === "all" || view === "exchange") && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#ff469e" }}
                >
                  Exchange Requests ({filteredExchanges.length})
                </Typography>
              </Grid>
              {filteredExchanges?.reverse().map((item) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={item.id}
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Card
                    sx={{
                      mb: "16px",
                      padding: "16px",
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: 4,
                      flexGrow: 1,
                      border: "1px solid white",
                      transition: "0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.02)",
                        border: "1px solid #ff469e",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Reason: </span>
                        {item.description}
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Status:</span>{" "}
                        <span style={{ fontWeight: "bold", color: "#ff469e" }}>{item.status}</span>
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Created Date:</span>{" "}
                        {item.create_date}
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Order No:</span>{" "}
                        {item.order_id}
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Sent To:</span>{" "}
                        {storeMap[item.store_id]}
                      </Typography>
                      <Accordion
                        sx={{
                          minWidth: "10vw",
                          width: "100%",
                          border: "none",
                          boxShadow: "none",
                          p: 0,
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore sx={{ color: "#ff469e" }} />}
                          sx={{
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 0,
                            mt: 0.25,
                            width: "100%",
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <Typography variant="h6">
                            <span
                              style={{ fontWeight: "600", color: "#ff469e" }}
                            >
                              Exchange Details:
                            </span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            p: 0.25,
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                        >
                          {item.exchange_detail_list.map((detail) => (
                            <div
                              key={detail.id}
                              style={{ marginLeft: "4px", marginBottom: "6px" }}
                            >
                              <Typography sx={{ fontSize: "1.2rem" }}>
                                <span style={{ fontWeight: "600" }}>
                                  - {productMap[detail.product_id][0]}
                                </span>{" "}
                                <span
                                  style={{
                                    fontSize: "1.05rem",
                                    opacity: 0.6,
                                    marginLeft: "2px",
                                  }}
                                >
                                  x{detail.quantity}
                                </span>
                              </Typography>
                              <Divider sx={{ my: 0.75 }} />
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </>
          )}
          {(view === "all" || view === "refund") && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#ff469e" }}
                >
                  Refund Requests ({filteredRefunds.length})
                </Typography>
              </Grid>
              {filteredRefunds?.reverse().map((item) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={item.id}
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Card
                    sx={{
                      mb: "16px",
                      padding: "16px",
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: 4,
                      flexGrow: 1,
                      border: "1px solid white",
                      transition: "0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.02)",
                        border: "1px solid #ff469e",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Reason: </span>
                        {item.description}
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Status:</span>{" "}
                        <span style={{ fontWeight: "bold", color: "#ff469e" }}>{item.status}</span>
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Created Date:</span>{" "}
                        {item.create_date}
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Order No:</span>{" "}
                        {item.order_id}
                      </Typography>
                      <Typography variant="h6">
                        <span style={{ fontWeight: "600" }}>Sent To:</span>{" "}
                        {storeMap[item.store_id]}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "600" }}>
                        <span>Amount:</span>{" "}
                        <span style={{ color: "#ff469e" }}>
                          {" "}
                          {formatCurrency(item.amount)}
                        </span>
                      </Typography>
                      <Accordion
                        sx={{
                          minWidth: "10vw",
                          width: "100%",
                          border: "none",
                          boxShadow: "none",
                          p: 0,
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore sx={{ color: "#ff469e" }} />}
                          sx={{
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 0,
                            mt: 0.25,
                            width: "100%",
                            border: "none",
                            boxShadow: "none",
                          }}
                        >
                          <Typography variant="h6">
                            <span
                              style={{ fontWeight: "600", color: "#ff469e" }}
                            >
                              Refund Details:
                            </span>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            p: 0.25,
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                        >
                          {item.refund_detail_list.map((detail) => (
                            <div
                              key={detail.id}
                              style={{
                                marginLeft: "16px",
                                marginBottom: "8px",
                              }}
                            >
                              <Typography sx={{ fontSize: "1.2rem" }}>
                                <span style={{ fontWeight: "600" }}>
                                  - {productMap[detail.product_id][0]}
                                </span>{" "}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "1.1rem", textAlign: "right" }}
                              >
                                <span style={{ fontWeight: "600" }}>
                                  {formatCurrency(detail.unit_price)}
                                </span>
                                <span
                                  style={{
                                    fontSize: "1.05rem",
                                    opacity: 0.6,
                                    marginLeft: "2px",
                                  }}
                                >
                                  {" "}
                                  x{detail.quantity}
                                </span>
                                {/* <span style={{ fontWeight: "600" }}>
                                  {" "}={" "}{formatCurrency(detail.amount)}
                                </span> */}
                              </Typography>
                              <Divider sx={{ my: 0.75 }} />
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </>
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
