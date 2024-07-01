import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { allOrderApi } from "../../api/OrderAPI";
import { allRefundApi } from "../../api/RefundAPI";
import { allExchangeApi } from "../../api/ExchangeAPI";

// Register the required components with ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

export default function Dashboard() {
  window.document.title = "Dashboard";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [orderCompletedData, setOrderCompletedData] = useState(0);
  const [refundData, setRefundData] = useState(0);
  const [exchangeData, setExchangeData] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [refundCount, setRefundCount] = useState(0);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [orderTotalAmount, setOrderTotalAmount] = useState(0);
  const [refundTotalAmount, setRefundTotalAmount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearlyData, setYearlyData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const orderRes = await allOrderApi();
      const exchangeRes = await allExchangeApi();
      const refundRes = await allRefundApi();

      console.log("Orders:", orderRes.data.data);
      console.log("Exchanges:", exchangeRes.data.data);
      console.log("Refunds:", refundRes.data.data);
      calculateYearlyData(
        orderRes.data.data || [],
        refundRes.data.data.refunds || []
      );

      setOrders(orderRes.data.data || []);
      setExchanges(exchangeRes.data.data.exchanges || []);
      setRefunds(refundRes.data.data.refunds || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    calculatePercentage(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
    calculatePercentage(selectedMonth, selectedYear);
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);
    calculatePercentage(selectedMonth, selectedYear);
  };
  const calculateYearlyData = (ordersData, refundsData) => {
    const data = {};
    ordersData.forEach((order) => {
      const isCompleted = order.status_order_list.some(
        (status) => status.status === "COMPLETED"
      );
      if (isCompleted) {
        const year = new Date(order.order_date).getFullYear();
        if (!data[year]) data[year] = { orders: 0, refunds: 0 };
        data[year].orders += order.final_amount || 0;
      }
    });
    refundsData.forEach((refund) => {
      const year = new Date(refund.create_date).getFullYear();
      if (!data[year]) data[year] = { orders: 0, refunds: 0 };
      data[year].refunds += refund.amount || 0;
    });
    setYearlyData(data);
  };

  const calculatePercentage = async (
    month = selectedMonth,
    year = selectedYear
  ) => {
    setLoading(true);
    try {
      const orderRes = await allOrderApi();
      const exchangeRes = await allExchangeApi();
      const refundRes = await allRefundApi();

      const ordersData = (orderRes.data.data || []).filter(
        (order) =>
          new Date(order.order_date).getMonth() + 1 === month &&
          new Date(order.order_date).getFullYear() === year
      );

      const exchangesData = (exchangeRes.data.data.exchanges || []).filter(
        (exchange) =>
          new Date(exchange.create_date).getMonth() + 1 === month &&
          new Date(exchange.create_date).getFullYear() === year
      );

      const refundsData = (refundRes.data.data.refunds || []).filter(
        (refund) =>
          new Date(refund.create_date).getMonth() + 1 === month &&
          new Date(refund.create_date).getFullYear() === year
      );

      const completedOrders = ordersData.filter((order) =>
        order.status_order_list.some((status) => status.status === "COMPLETED")
      );

      const totalCount =
        completedOrders.length + exchangesData.length + refundsData.length;

      if (totalCount > 0) {
        const refundPercentage = (
          (refundsData.length / totalCount) *
          100
        ).toFixed(2);
        const orderPercentage = (
          (completedOrders.length / totalCount) *
          100
        ).toFixed(2);
        const exchangePercentage = (
          (exchangesData.length / totalCount) *
          100
        ).toFixed(2);

        setOrderCompletedData(orderPercentage);
        setRefundData(refundPercentage);
        setExchangeData(exchangePercentage);

        setOrderCount(completedOrders.length);
        setRefundCount(refundsData.length);
        setExchangeCount(exchangesData.length);

        const orderTotalAmount = completedOrders.reduce(
          (sum, order) => sum + (order.final_amount || 0),
          0
        );
        const refundTotalAmount = refundsData.reduce(
          (sum, refund) => sum + (refund.amount || 0),
          0
        );
        const totalRevenue = orderTotalAmount - refundTotalAmount;

        setOrderTotalAmount(orderTotalAmount);
        setRefundTotalAmount(refundTotalAmount);
        setTotalRevenue(totalRevenue);
      } else {
        setOrderCompletedData(0);
        setRefundData(0);
        setExchangeData(0);

        setOrderCount(0);
        setRefundCount(0);
        setExchangeCount(0);

        setOrderTotalAmount(0);
        setRefundTotalAmount(0);
        setTotalRevenue(0);
      }
    } catch (error) {
      console.error("Error fetching order and refund data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const pieData = {
    labels: ["Completed", "Refund", "Exchange"],
    datasets: [
      {
        data: [
          Number(orderCompletedData),
          Number(refundData),
          Number(exchangeData),
        ],
        backgroundColor: ["#FFBB28", "#FF8042", "#00C49F"],
        borderColor: ["#FFBB28", "#FF8042", "#00C49F"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.forEach((data) => {
            sum += data;
          });
          let percentage = ((value / sum) * 100).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 16,
        },
      },
    },
  };

  const barData = {
    labels: ["Order Completed", "Refund"],
    datasets: [
      {
        label: "Amount",
        data: [orderTotalAmount, refundTotalAmount],
        backgroundColor: ["#FFBB28", "#FF8042"],
        borderColor: ["#FFBB28", "#FF8042"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const yearlyBarData = {
    labels: Object.keys(yearlyData),
    datasets: [
      {
        label: "Order Completed",
        data: Object.values(yearlyData).map((data) => data.orders),
        backgroundColor: "#FFBB28",
        borderColor: "#FFBB28",
        borderWidth: 1,
      },
      {
        label: "Refund",
        data: Object.values(yearlyData).map((data) => data.refunds),
        backgroundColor: "#FF8042",
        borderColor: "#FF8042",
        borderWidth: 1,
      },
    ],
  };
  const yearlyBarOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handlePieChartClick = () => {
    navigate("/staff/orders");
  };

  return (
    <Container
      sx={{
        backgroundColor: "#white",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: "sticky",
          marginTop: "20px",
          padding: "16px",
          border: "1px solid #ff469e",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <Typography
          sx={{
            padding: "8px",
            background: "#ff469e",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            borderRadius: "4px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={handleMonthChange}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {new Date(0, index).toLocaleString("en-US", {
                      month: "long",
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={handleYearChange}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={8}>
            <Card sx={{ marginLeft: "25px",
              boxShadow: 5,
             }}>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "25px",
                    fontWeight: "bold",
                    color: "#ff469e",
                    textAlign: "center",
                    paddingTop: "10px",
                  }}
                >
                  Orders
                </Typography>
                <Grid container justifyContent="center">
                  <Pie
                    data={pieData}
                    options={{
                      plugins: {
                        legend: {
                          display: true,
                          position: "right",
                        },
                        datalabels: {
                          formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.forEach((data) => {
                              sum += data;
                            });
                            let percentage =
                              ((value / sum) * 100).toFixed(2) + "%";
                            return percentage;
                          },
                          color: "#fff",
                          font: {
                            weight: "bold",
                            size: 16,
                          },
                        },
                      },
                      elements: {
                        arc: {
                          borderWidth: 0,
                        },
                      },
                    }}
                    width={400}
                    height={300}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <Card
                  onClick={handlePieChartClick}
                  sx={{ ":hover": { backgroundColor: "#FFFAF0" } }}
                >
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#FFBB28",
                        }}
                      >
                        Order Completed
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px",
                        }}
                      >
                        <span>{orderCount}</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  onClick={handlePieChartClick}
                  sx={{ ":hover": { backgroundColor: "#FFFAF0" } }}
                >
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#FF8042",
                        }}
                      >
                        Refund
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px",
                        }}
                      >
                        <span>{refundCount}</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  onClick={handlePieChartClick}
                  sx={{ ":hover": { backgroundColor: "#FFFAF0" } }}
                >
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#00C49F",
                        }}
                      >
                        Exchange
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px",
                        }}
                      >
                        <span>{exchangeCount}</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Financial Summary */}
        <Grid container spacing={2} sx={{ marginTop: "20px" }}>
          <Grid item xs={8}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "25px",
                    fontWeight: "bold",
                    color: "#ff469e",
                    textAlign: "center",
                    paddingTop: "10px",
                  }}
                >
                  Financial Summary
                </Typography>
                <Grid container justifyContent="center">
                  <Bar
                    data={barData}
                    options={barOptions}
                    width={400}
                    height={300}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* New Financial Cards on the right */}
          <Grid item xs={4}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <Card sx={{ ":hover": { backgroundColor: "#FFFAF0" } }}>
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#FFBB28",
                        }}
                      >
                        Order Completed Amount
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px",
                        }}
                      >
                        <span>
                          {orderTotalAmount.toLocaleString("vi-VN")} VND
                        </span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ ":hover": { backgroundColor: "#FFFAF0" } }}>
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#FF8042",
                        }}
                      >
                        Refund Amount
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px",
                        }}
                      >
                        <span>
                          {refundTotalAmount.toLocaleString("vi-VN")} VND
                        </span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ ":hover": { backgroundColor: "#FFFAF0" } }}>
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#ff469e",
                        }}
                      >
                        Total Revenue
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px",
                        }}
                      >
                        <span>{totalRevenue.toLocaleString("vi-VN")} VND</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    textAlign: "center",
                    color: "#ff469e",
                    fontSize: "25px",
                  }}
                >
                  Yearly Data
                </Typography>
                <Bar data={yearlyBarData} options={yearlyBarOptions} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
