import React, { useState, useEffect } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import io from "socket.io-client";
import {
  Stack,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper
} from "@mui/material";
import {
  BarChart,
  PieChart,
  LineChart
} from "@mui/x-charts";
import { allOrderApi, allStatusOrderApi } from "../../api/OrderAPI";
import { allRefundApi } from "../../api/RefundAPI";

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusOrders, setStatusOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [cancelData, setCancelData] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [inProgressData, setInProgressData] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completeData, setCompleteData] = useState(0);
  const [completedCount, setCompleteCount] = useState(0);
  const [revenueLineChartData, setRevenueLineChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu
  const [totalRefund, setTotalRefund] = useState(0);

  useEffect(() => {
    fetchData();

    const socket = io("http://localhost:3000");

    socket.on("orderUpdate", (newOrder) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    socket.on("statusOrderUpdate", (newStatusOrder) => {
      setStatusOrders((prevOrders) => [...prevOrders, newStatusOrder]);
    });

    socket.on("RefundUpdate", (newRefund) => {
      setRefunds((prevRefunds) => [...prevRefunds, newRefund]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    handleRevenueChartData();
    calculateStatusPercentage();
    handleRevenueLineChartData();
  }, [orders, statusOrders, refunds]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orderRes = await allOrderApi();
      const statusOrderRes = await allStatusOrderApi();
      const refundRes = await allRefundApi();
      setOrders(orderRes.data.data || []);
      setStatusOrders(statusOrderRes.data.data || []);
      setRefunds(refundRes.data.data || []);
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueChartData = () => {
    // Khởi tạo đối tượng lưu trữ doanh thu và hoàn lại theo từng tháng
    const monthlyData = {
      Jan: { Revenue: 0, Refund: 0 },
      Feb: { Revenue: 0, Refund: 0 },
      Mar: { Revenue: 0, Refund: 0 },
      Apr: { Revenue: 0, Refund: 0 },
      May: { Revenue: 0, Refund: 0 },
      Jun: { Revenue: 0, Refund: 0 },
      Jul: { Revenue: 0, Refund: 0 },
      Aug: { Revenue: 0, Refund: 0 },
      Sep: { Revenue: 0, Refund: 0 },
      Oct: { Revenue: 0, Refund: 0 },
      Nov: { Revenue: 0, Refund: 0 },
      Dec: { Revenue: 0, Refund: 0 },
    };

    let totalRev = 0;
    let totalRef = 0;

    // Tính toán doanh thu từ các đơn hàng
    orders.forEach((order) => {
      const date = new Date(order.order_date);
      const year = date.getFullYear();
      if (year === 2024) {
        const month = date.toLocaleString("default", { month: "short" });
        monthlyData[month].Revenue += order.amount;
        totalRev += order.amount;
      }
    });

    // Tính toán số tiền hoàn lại từ các đơn hoàn trả
    refunds.forEach((refund) => {
      const date = new Date(refund.createDate);
      const year = date.getFullYear();
      if (year === 2024) {
        const month = date.toLocaleString("default", { month: "short" });
        monthlyData[month].Refund += refund.amount;
        totalRef += refund.amount;
      }
    });

    // Chuyển đổi dữ liệu thành mảng để đưa vào state và hiển thị
    const revenueData = Object.keys(monthlyData).map((month) => ({
      month,
      Revenue: monthlyData[month]?.Revenue,
      Refund: monthlyData[month].Refund
    }));

    console.log(revenueData);
    console.log(totalRev);
    console.log(totalRef);
    setRevenueChartData(revenueData);
    setTotalRevenue(totalRev);
    setTotalRefund(totalRef);
  };

  const calculateStatusPercentage = () => {
    if (!statusOrders) {
      setCancelData(0);
      setCompleteData(0);
      setInProgressData(0);
      return;
    }

    let cancelledCount = 0;
    let completedCount = 0;
    let inProgressCount = 0;

    statusOrders.forEach(statusOrder => {
      switch (statusOrder.status.trim().toUpperCase()) {
        case "CANCELLED":
          cancelledCount++;
          break;
        case "COMPLETED":
          completedCount++;
          break;
        case "PENDING":
          inProgressCount++;
          break;
        default:
          break;
      }
    });

    const totalCount = cancelledCount + completedCount + inProgressCount;

    const cancelPercentage = ((cancelledCount / totalCount) * 100).toFixed(2);
    const completePercentage = ((completedCount / totalCount) * 100).toFixed(2);
    const inProgressPercentage = ((inProgressCount / totalCount) * 100).toFixed(2);

    setCancelledCount(cancelledCount);
    setCompleteCount(completedCount);
    setInProgressCount(inProgressCount);

    setCancelData(parseFloat(cancelPercentage));
    setCompleteData(parseFloat(completePercentage));
    setInProgressData(parseFloat(inProgressPercentage));
  };

  const handleRevenueLineChartData = () => {
    const yearlyRevenue = orders.reduce((acc, order) => {
      const date = new Date(order.orderDate);
      const year = date.getFullYear(); // Lấy năm từ ngày đặt hàng
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += order.amount;
      return acc;
    }, {});

    const yearlyRefund = refunds.reduce((acc, refund) => {
      const date = new Date(refund.createDate);
      const year = date.getFullYear(); // Lấy năm từ ngày hoàn trả
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += refund.amount;
      return acc;
    }, {});

    const years = Object.keys(yearlyRevenue).concat(Object.keys(yearlyRefund));
    const uniqueYears = Array.from(new Set(years)).sort();

    const revenueLineData = uniqueYears.map((year) => ({
      year,
      label: year.toString(),
      Revenue: yearlyRevenue[year] || 0,
      Refund: yearlyRefund[year] || 0,
    }));

    console.log(revenueLineData)
    setRevenueLineChartData(revenueLineData);
  };

  const valueFormatter = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}bn`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}mm`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}k`;
    } else {
      return value;
    }
  };

  const keyToLabel = {
    Revenue: 'Revenue (VND)',
    Refund: 'Refund (VND)',
  };

  const colors = {
    Revenue: '#228B22',
    Refund: 'rgb(2, 178, 175)',
  };

  const stackStrategy = {
    stack: 'total',
    area: true,
    stackOffset: 'none',
  };

  const customize = {
    height: 300,
    legend: { hidden: true },
    margin: { top: 5 },
    stackingOrder: 'descending',
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ position: "sticky", top: "80px", padding: "16px", border: "1px solid #ff469e", borderRadius: "10px", backgroundColor: "white" }}>
        <Typography sx={{ padding: "8px", background: "#ff469e", color: "white", fontWeight: "bold", fontSize: "18px", borderRadius: "4px", textAlign: "center", marginBottom: "16px" }}>
          Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent style={{ height: "700px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" style={{ fontWeight: "bold", color: "black", marginBottom: "30px" }}>Total Revenue && Refund 2024</Typography>
                <Typography variant="body1" style={{ fontWeight: "bold", color: '#228B22', marginBottom: "10px", alignItems: "center" }}>
                  <AttachMoneyIcon /> Total Revenue: <span style={{ color: "black" }}>{valueFormatter(totalRevenue)}</span>
                </Typography>
                <Typography variant="body1" style={{ fontWeight: "bold", color: "rgb(2, 178, 175)", marginBottom: "20px", alignItems: "center" }}>
                  <CurrencyExchangeIcon /> Total Refund: <span style={{ color: "black" }}>{valueFormatter(totalRefund)}</span>
                </Typography>
                <BarChart
                  dataset={revenueChartData}
                  yAxis={[{ fontWeight: "bold", paddingBottom: "20px", valueFormatter }]}
                  xAxis={[{ scaleType: 'band', dataKey: 'month', label: 'Month' }]}
                  series={[
                    { dataKey: 'Revenue', label: 'Revenue', valueFormatter: (value) => valueFormatter(value) + " VND", color: '#228B22' },
                    { dataKey: 'Refund', label: 'Refund', valueFormatter: (value) => valueFormatter(value) + " VND", color: "rgb(2, 178, 175)" }
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent style={{ height: "350px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" style={{ fontWeight: "bold", color: "black", marginBottom: "20px", paddingBottom: "20px" }}>Order Status Percentage</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" paddingTop="20px">
                  <Stack spacing={1} direction="column" >
                    <Typography variant="body1" style={{ fontWeight: "bold", color: "rgb(2, 178, 175)" }}>
                      Canceled Orders: <span style={{ color: "black", }}>{valueFormatter(cancelledCount)}</span>
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: "bold", color: "rgb(46, 150, 255)" }}>
                      Complete Orders: <span style={{ color: "black", }}>{valueFormatter(completedCount)}</span>
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: "bold", color: "rgb(184, 0, 216)" }}>
                      Pending Orders: <span style={{ color: "black", }}>{valueFormatter(inProgressCount)}</span>
                    </Typography>
                  </Stack>

                  <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: cancelData, label: `Cancelled\n(${cancelData}%)` },
                          { id: 1, value: completeData, label: `Completed\n(${completeData}%)` },
                          { id: 2, value: inProgressData, label: `Pending\n(${inProgressData}%)` },
                        ],
                        highlightScope: { highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      },
                    ]}
                  />

                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} >
            <Card>
              <CardContent style={{ height: "350px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" textAlign="center" fontWeight="bold">Revenue && Refund Each Year</Typography>
                <LineChart
                  xAxis={[
                    {
                      fontWeight: "bold", label: 'Year',
                      dataKey: 'year',
                      valueFormatter: (year) => year.toString(),
                      min: 2011,
                      max: 2035,
                    },
                  ]}

                  yAxis={[{ valueFormatter }]}
                  series={Object.keys(keyToLabel).map((key) => ({
                    dataKey: key,
                    label: keyToLabel[key],
                    color: colors[key],
                    showMark: false,
                    valueFormatter,
                    ...stackStrategy,
                  }))}
                  dataset={revenueLineChartData}
                  {...customize}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
// export default function AdminHome() {}