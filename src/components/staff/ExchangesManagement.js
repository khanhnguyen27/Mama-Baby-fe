import {
  ArrowDownward,
  ArrowUpward,
  KeyboardCapslock,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { allExchangeApi, exchangeByStoreIdApi } from "../../api/ExchangeAPI";
import { allProductApi } from "../../api/ProductAPI";
import { allOrderDetailApi } from "../../api/OrderAPI";
import { jwtDecode } from "jwt-decode";
import { storeByUserIdApi } from "../../api/StoreAPI";

export default function ExchangeManagement() {
  window.document.title = "Exchanges Management";
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [store, setStore] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [productMap, setProductMap] = useState({});

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

  const fetchData = async () => {
    try {
      const [exchangesRes, orderDetailsRes, productRes] = await Promise.all([
        allExchangeApi({ store_id: storeId }),
        allOrderDetailApi(),
        allProductApi(),
      ]);

      const exchangesData = exchangesRes?.data?.data?.exchanges || [];
      const orderDetailsData = orderDetailsRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];

      setExchanges(exchangesData);

      const orderDetailsMap = orderDetailsData.reduce((x, item) => {
        x[item.id] = item.product_id;
        return x;
      }, {});
      setOrderDetailsMap(orderDetailsMap);

      const productMap = productData.reduce((x, item) => {
        x[item.id] = [item.name, item.price];
        return x;
      }, {});
      setProductMap(productMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const [isReversed, setIsReversed] = useState(false);

  const handleSortToggle = () => {
    setIsReversed((prev) => !prev);
  };

  const sortedExchanges = isReversed ? [...exchanges].reverse() : exchanges;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleSortToggle}
            startIcon={!isReversed ? <ArrowUpward /> : <ArrowDownward />}
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
          >
            Sort by Date
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={3}>
            {sortedExchanges?.map((item) => (
              <Grid item xs={6} md={4} lg={3} key={item.id}>
                <Card
                  key={item.id}
                  sx={{
                    px: 1.5,
                    py: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "auto",
                    borderColor: "#ff469e",
                    borderWidth: 1,
                    borderStyle: "solid",
                    border: "1px solid #f5f7fd",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                    transition: "border 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      border: "1px solid #ff469e",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#ff469e" }}
                    gutterBottom
                  >
                    Request No. {item.id}
                  </Typography>
                  <Divider />
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "16px", color: "black" }}
                    >
                      <strong>Reason:</strong> {item.description}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{ color: "black" }}
                    >
                      <strong>Detail:</strong>
                      <br />
                      {item?.exchange_detail_list?.map((detail) => {
                        return (
                          <Typography
                            variant="body2"
                            component="span"
                            key={detail.id}
                          >
                            <strong>{productMap[detail.product_id][0]}</strong> - {formatCurrency(productMap[detail.product_id][1])} x{" "}
                            {detail.quantity}
                            <br />
                          </Typography>
                        );
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
