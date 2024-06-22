import React, { useState, useEffect } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import io from "socket.io-client";
import {
  MenuItem,
  InputLabel,
  FormControl,
  Select,
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
import { allOrderApi, allStatusOrderApi, orderByYearApi } from "../../api/OrderAPI";
import { allRefundApi, refundByYearApi } from "../../api/RefundAPI";

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusOrders, setStatusOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [BarChartData, setBarChartData] = useState([]);
  const [LineChartData, setLineChartData] = useState([]);
  const [cancelData, setCancelData] = useState(0);
  const [inProgressData, setInProgressData] = useState(0);
  const [completeData, setCompleteData] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompleteCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearsList, setYearsList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleBarChartData(selectedYear);
    calculateStatusPercentage();
    handleLineChartData();
  }, [orders, statusOrders, refunds, selectedYear]);

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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchYears = async () => {
      const years = await fetchYearsFromDatabase(orders);
      setYearsList(years);
      console.log("Years list:", years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    };

    fetchYears();
  }, [orders]);

  useEffect(() => {
    if (selectedYear !== null) {
      handleBarChartData(selectedYear);
    }
  }, [selectedYear, orders, refunds]);

  const fetchYearsFromDatabase = async (ordersData) => {
    try {
      const yearsSet = new Set();

      ordersData.forEach((order) => {
        const date = new Date(order.orderDate);
        const year = date.getFullYear();
        yearsSet.add(year);
      });

      const yearsArray = Array.from(yearsSet).sort();
      console.log("Years fetched:", yearsArray);
      return yearsArray;
    } catch (error) {
      console.error("Error fetching years:", error);
      return [];
    }
  };

  const handleBarChartData = async (year = selectedYear) => { 
    setLoading(true);
    try {
      let orderRes, refundRes;
  
      if (year) {
        orderRes = await orderByYearApi(year);
        refundRes = await refundByYearApi(year);
      }
  
      console.log("orderRes:", orderRes);
      console.log("refundRes:", refundRes);
  
      const ordersData = orderRes?.data?.data || [];
      const refundsData = refundRes?.data?.data || [];
  
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
  
      ordersData.forEach((order) => {
        const date = new Date(order.orderDate);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyData[month].Revenue += order.amount || 0; // Ensure amount exists and is a number
        totalRev += order.amount || 0; // Accumulate total revenue
      });
  
      refundsData.forEach((refund) => {
        const date = new Date(refund.createDate);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyData[month].Refund += refund.amount || 0; // Ensure amount exists and is a number
        totalRef += refund.amount || 0; // Accumulate total refund
      });
  
      const BarData = Object.keys(monthlyData).map((month) => ({
        month,
        Revenue: monthlyData[month].Revenue,
        Refund: monthlyData[month].Refund,
      }));
  
      setBarChartData(BarData);
      setTotalRevenue(totalRev); // Set total revenue state
      setTotalRefund(totalRef); // Set total refund state
  
      console.log("ordersData", ordersData);
      console.log("refundsData", refundsData);
      console.log("totalRev", totalRev);
      console.log("totalRef", totalRef);
      console.log("BarData:", BarData);
    } catch (error) {
      console.error("Error fetching order and refund data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);
    console.log("selectedYear", selectedYear);
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

  const handleLineChartData = async () => {
    try {
      const yearlyRevenue = orders.reduce((acc, order) => {
        const date = new Date(order.orderDate);
        const year = date.getFullYear();
        if (!acc[year]) {
          acc[year] = 0;
        }
        acc[year] += order.amount;
        return acc;
      }, {});

      const refundRes = await allRefundApi();
      const refundsData = refundRes.data.data.refunds || [];

      const yearlyRefund = refundsData.reduce((acc, refund) => {
        const date = new Date(refund.createDate);
        const year = date.getFullYear();
        if (!acc[year]) {
          acc[year] = 0;
        }
        acc[year] += refund.amount;
        return acc;
      }, {});

      const years = Object.keys(yearlyRevenue).concat(Object.keys(yearlyRefund));
      const uniqueYears = Array.from(new Set(years)).sort();

      const LineData = uniqueYears.map((year) => ({
        year,
        label: year.toString(),
        Revenue: yearlyRevenue[year] || 0,
        Refund: yearlyRefund[year] || 0,
      }));

      setLineChartData(LineData);
    } catch (error) {
      console.error("Error handling line chart data:", error);
    }
  };

  const valueFormatter = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(0)}bn`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(0)}mm`;
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
          <Grid item xs={3}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} md={12}>
                <Card>
                  <CardContent style={{ height: "192px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold", color: '#228B22', marginBottom: "10px", alignItems: "center" }}>
                      <AttachMoneyIcon /> Total Revenue: <span style={{ color: "black" }}>{valueFormatter(totalRevenue)}</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card>
                  <CardContent style={{ height: "193px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold", color: "rgb(2, 178, 175)", marginBottom: "20px", alignItems: "center" }}>
                      <CurrencyExchangeIcon /> Total Refund: <span style={{ color: "black" }}>{valueFormatter(totalRefund)}</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9} md={9} sx={{ position: 'relative' }}>
            <Card>
              <CardContent style={{ height: "400px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" style={{ fontWeight: "bold", color: "#ff469e", marginBottom: "30px", position: 'absolute', top: 24, left: 32 }}>
                  Overall Milk Profit
                </Typography>

                <FormControl fullWidth style={{ width: 150, position: 'absolute', top: 15, right: 0 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {yearsList.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <BarChart
                  dataset={BarChartData}
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
                <Typography variant="h6" style={{ fontWeight: "bold", color: "#ff469e", marginBottom: "20px", paddingBottom: "20px" }}>Order Status Percentage</Typography>
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
                      },
                    ]}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent style={{ height: "350px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" color="#ff469e" textAlign="center" fontWeight="bold" style={{ width: 150, position: 'absolute', top: 500, right: 30 }}>Profit Each Year</Typography>
                <LineChart
                  xAxis={[
                    {
                      fontWeight: "bold", label: 'Year',
                      dataKey: 'year',
                      valueFormatter: (year) => year.toString(),
                      min: 2020,
                      max: 2030,
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
                  dataset={LineChartData}
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