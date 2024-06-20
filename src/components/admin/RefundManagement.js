import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import DescriptionIcon from '@mui/icons-material/Description';
import { allRefundApi } from "../../api/RefundAPI";
import { allUserApi } from "../../api/UserAPI";
import { getOrderByIdApi } from "../../api/OrderAPI"; // Ensure this API is available

export default function Refund() {
  window.document.title = "Refunds";
  const [loading, setLoading] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [totalAmountByUser, setTotalAmountByUser] = useState({});
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [openExchangeDetail, setOpenExchangeDetail] = useState(false);
  const isEmptyRefund = !refunds.length;

  const fetchData = async () => {
    try {
      const [refundRes, userRes] = await Promise.all([
        allRefundApi(),
        allUserApi(),
      ]);

      const refundData = refundRes?.data?.data || [];
      const userData = userRes?.data?.data || [];

      setRefunds(refundData);

      const userMap = userData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setUsersMap(userMap);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const totals = refunds.reduce((acc, refund) => {
      const date = new Date(refund.createDate);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      if (selectedMonthYear === "" || selectedMonthYear === monthYear) {
        acc[refund.user_id] = (acc[refund.user_id] || 0) + parseFloat(refund.amount);
      }
      return acc;
    }, {});
    setTotalAmountByUser(totals);
  }, [refunds, selectedMonthYear]);

  const groupedRefunds = refunds.reduce((acc, item) => {
    const date = new Date(item.createDate);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

    if (!acc[item.user_id]) acc[item.user_id] = {};
    if (!acc[item.user_id][monthYear]) acc[item.user_id][monthYear] = [];

    acc[item.user_id][monthYear].push(item);
    return acc;
  }, {});

  const allMonthYears = Array.from(
    new Set(refunds.map((item) => {
      const date = new Date(item.createDate);
      return `${date.getMonth() + 1}-${date.getFullYear()}`;
    }))
  );

  const toggleExpand = (userId) => {
    setExpandedUsers((prevExpandedUsers) => ({
      ...prevExpandedUsers,
      [userId]: !prevExpandedUsers[userId],
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const formatDate = (date) => {
    return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
  };

  const handleMonthYearChange = (event) => {
    setSelectedMonthYear(event.target.value);
  };

  const handleOpenOrderDetail = async (item) => {
    try {
      const response = await getOrderByIdApi(item.order_id);
      setSelectedOrder(response.data.data);
      setOpenOrderDetail(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseOrderDetail = () => {
    setOpenOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleOpenExchangeDetail = () => {
    setOpenExchangeDetail(true);
  };

  const handleCloseExchangeDetail = () => {
    setOpenExchangeDetail(false);
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
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                backgroundColor: "#fff",
                border: "1px solid #ff469e",
                borderRadius: "8px",
                marginBottom: "36px",
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography
                    sx={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      color: "#ff469e",
                    }}
                  >
                    Select month
                  </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                  <FormControl fullWidth>
                    <InputLabel id="month-year-select-label">Month-Year</InputLabel>
                    <Select
                      labelId="month-year-select-label"
                      value={selectedMonthYear}
                      label="Month-Year"
                      onChange={handleMonthYearChange}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Set the max height of the dropdown
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {allMonthYears.map((monthYear) => (
                        <MenuItem key={monthYear} value={monthYear}>
                          {monthYear}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {!isEmptyRefund ? (
            Object.keys(groupedRefunds).map((userId, index) => {
              const userRefunds = groupedRefunds[userId];
              const filteredRefunds = selectedMonthYear
                ? { [selectedMonthYear]: userRefunds[selectedMonthYear] }
                : userRefunds;

              // Skip users with no refunds in the selected month
              if (selectedMonthYear && !filteredRefunds[selectedMonthYear]) return null;

              return (
                <Grid item xs={12} key={userId}>
                  <Paper elevation={3} sx={{ padding: "16px", marginBottom: "0px", border: "1px solid #ff469e", borderRadius: "10px", backgroundColor: "white" }}>
                    <Grid container alignItems="center" spacing={2} sx={{ marginBottom: "16px" }}>
                      <Grid item xs={12} md={4}>
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            color: "#ff469e",
                            fontWeight: "bold",
                            marginLeft: "1.25rem",
                          }}
                        >
                          {usersMap[userId]?.full_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            color: "#323232",
                            marginLeft: "1.25rem",
                          }}
                        >
                          Phone: {usersMap[userId]?.phone_number}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            color: "#323232",
                            marginRight: "1.25rem",
                            paddingTop: "6px",
                          }}
                        >
                          Total: {formatCurrency(totalAmountByUser[userId] || 0)}
                        </Typography>
                        <IconButton onClick={() => toggleExpand(userId)}>
                          {expandedUsers[userId] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Grid>
                    </Grid>
                    {expandedUsers[userId] && filteredRefunds && (
                      Object.keys(filteredRefunds).map((monthYear) => (
                        <div key={monthYear}>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "blue",
                              fontWeight: "bold",
                              marginLeft: "1.25rem",
                              marginTop: "1rem"
                            }}
                          >
                            {`Month: ${monthYear}`}
                          </Typography>
                          {filteredRefunds[monthYear] && filteredRefunds[monthYear].map((item) => (
                            <Card key={item.id} sx={{ marginBottom: "16px" }}>
                              <CardContent>
                                <Grid container alignItems="center" spacing={2}>
                                  <Grid item xs={6} md={3}>
                                    <Typography variant="body1">Refund ID: {item.id}</Typography>
                                  </Grid>
                                  <Grid item xs={6} md={3}>
                                    <Box display="flex" alignItems="center">
                                      <Typography variant="body1" style={{ marginRight: '8px' }}>
                                        {item.order_id !== 0
                                          ? `Order ID: ${item.order_id}`
                                          : `Exchange ID: ${item.exchange_id}`}
                                      </Typography>
                                      <IconButton onClick={() => {
                                        item.order_id !== 0
                                          ? handleOpenOrderDetail(item)
                                          : handleOpenExchangeDetail(item)
                                      }}>
                                        <DescriptionIcon />
                                      </IconButton>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={6} md={4}>
                                    <Typography variant="body1">Create Date: {formatDate(item.createDate)}</Typography>
                                  </Grid>
                                  <Grid item xs={6} md={2}>
                                    <Typography variant="body1">Amount: {formatCurrency(item.amount)}</Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ))
                    )}
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  fontSize: "1.25rem",
                  textAlign: "center",
                  my: 3,
                }}
              >
                List refund is currently empty.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Dialog for Order Detail */}
      <Dialog open={openOrderDetail} onClose={handleCloseOrderDetail}>
        <DialogTitle
          sx={{
            fontSize: "2rem",
            color: "#323232",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Information order
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6"
                    sx={{
                      fontSize: "1.25rem",
                      color: "#ff469e",
                      fontWeight: "bold",
                    }}
                  >
                    Order ID: {selectedOrder.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Shipping Address: {selectedOrder.shippingAddress}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Order Date: {formatDate(selectedOrder.orderDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Amount: {formatCurrency(selectedOrder.amount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Total Discount: {formatCurrency(selectedOrder.total_discount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography>Final Amount: {formatCurrency(selectedOrder.final_amount)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Payment Method: {selectedOrder.payment_method}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      color: "#ff469e",
                      fontWeight: "bold",
                    }}
                  >
                    Order Details:
                  </Typography>
                  <List>
                    {selectedOrder.order_detail_list.map((detail) => (
                      <ListItem key={detail.id}>
                        <ListItemText
                          primary={`Product ID: ${detail.product_id}`}
                          secondary={`Quantity: ${detail.quantity}, Unit Price: ${formatCurrency(detail.unit_price)}, Amount Price: ${formatCurrency(detail.amount_price)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      color: "#ff469e",
                      fontWeight: "bold",
                    }}
                  >Status History:
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedOrder.status_order_list.map((status, index) => (
                      <Grid item xs={6} key={index}>
                        <ListItem>
                          <ListItemText
                            primary={`Status: ${status.status}`}
                            secondary={`Date: ${formatDate(status.date)}`}
                          />
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Exchange Detail */}
      <Dialog open={openExchangeDetail} onClose={handleCloseExchangeDetail}>
        <DialogTitle>Exchange detail</DialogTitle>
        <DialogContent>
          {/* Add exchange details here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
