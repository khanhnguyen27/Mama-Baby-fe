import React, { useState, useEffect } from "react";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
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
  Paper
} from "@mui/material";
import {
  BarChart,
  PieChart,
  pieArcLabelClasses,
  LineChart
} from "@mui/x-charts";
import { allOrderApi, orderByYearApi } from "../../api/OrderAPI";
import { allRefundApi, refundByYearApi } from "../../api/RefundAPI";
import { allStoreApi, StoreByMonthApi } from "../../api/StoreAPI";

export default function AdminHome() {
  window.document.title = "AdminHome";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
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
  const [yearsList, setYearsList] = useState([]);
  const [monthsList, setMonthsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);;
  const [minYear, setMinYear] = useState(new Date().getFullYear() - 15);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchData();

    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("ordersUpdate", (newOrders) => {
      console.log("Received orders update:", newOrders);
      setOrders(prevOrders => [...prevOrders, newOrders]);
    });

    socket.on("refundsUpdate", (newRefunds) => {
      console.log("Received refunds update:", newRefunds);
      setRefunds(prevRefunds => [...prevRefunds, newRefunds]);
    });

    socket.on("storesUpdate", (newStores) => {
      console.log("Received store update:", newStores);
      setStores(prevStores => [...prevStores, newStores]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orderRes = await allOrderApi();
      const storeRes = await allStoreApi();
      const refundRes = await allRefundApi();

      setOrders(orderRes.data.data || []);
      console.log("orderRes", orderRes)
      setStores(storeRes.data.data.stores || []);
      console.log("storeRes", storeRes)
      setRefunds(refundRes.data.data.refunds || []);
      console.log("refundRes", refundRes)
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

      if (years.length > 0 && !years.includes(selectedYear)) {
        setSelectedYear(years[0]);
      }
    };

    fetchYears();
  }, [orders]);

  useEffect(() => {
    const fetchMonths = async () => {
      const months = await fetchMonthsFromDatabase(stores);
      setMonthsList(months);

      if (months.length > 0 && !months.includes(selectedMonth)) {
        setSelectedMonth(months[0]);
      }
    };

    fetchMonths();
  }, [stores]);

  useEffect(() => {
    fetchMinMaxYears();
  }, []);

  useEffect(() => {
    if (selectedYear !== null) {
      handleBarChartData(selectedYear);
    }
  }, [selectedYear, orders, refunds]);

  useEffect(() => {
    calculatePercentage(selectedMonth);
  }, [selectedMonth, stores]);

  useEffect(() => {
    handleLineChartData();
  }, [orders, refunds]);

  const fetchYearsFromDatabase = async (ordersData) => {
    try {
      const yearsSet = new Set();

      ordersData.forEach((order) => {
        const date = new Date(order.order_date);
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

  const fetchMonthsFromDatabase = async (storesData) => {
    try {
      const monthsSet = new Set();

      storesData.forEach((store) => {
        const date = new Date(store.request_date);
        const month = date.getMonth() + 1;
        monthsSet.add(month);
      });

      return Array.from(monthsSet).sort((a, b) => a - b);
    } catch (error) {
      console.error("Error fetching months:", error);
      return [];
    }
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);
    console.log("selectedYear", selectedYear);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
    console.log("selectedMonth", selectedMonth);
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
        const date = new Date(order.order_date);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyData[month].Revenue += order.amount || 0; // Ensure amount exists and is a number
        totalRev += order.amount || 0; // Accumulate total revenue
      });

      refundsData.forEach((refund) => {
        const date = new Date(refund.create_date);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyData[month].Refund += refund.amount || 0;
        totalRef += refund.amount || 0;
      });

      const BarData = Object.keys(monthlyData).map((month) => ({
        month,
        Revenue: monthlyData[month].Revenue,
        Refund: monthlyData[month].Refund,
      }));

      setBarChartData(BarData);
      setTotalRevenue(totalRev);
      setTotalRefund(totalRef);

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

  const calculatePercentage = async (month = selectedMonth) => {
    setLoading(true);
    try {
      if (!Array.isArray(stores) || stores.length === 0) {
        setCancelData(0);
        setCompleteData(0);
        setInProgressData(0);
        return;
      }

      let storeMonth;

      if (month) {
        storeMonth = await StoreByMonthApi(month);
      }

      console.log("storeMonth:", storeMonth);

      const storeData = storeMonth?.data?.data || [];

      let cancelledCount = 0;
      let completedCount = 0;
      let inProgressCount = 0;

      storeData.forEach((store) => {
        switch (store.status.trim().toUpperCase()) {
          case "REFUSE":
            cancelledCount++;
            break;
          case "APPROVED":
            completedCount++;
            break;
          case "PROCESSING":
            inProgressCount++;
            break;
          default:
            break;
        }
      });

      const totalCount = cancelledCount + completedCount + inProgressCount;

      if (totalCount > 0) {
        const cancelPercentage = ((cancelledCount / totalCount) * 100).toFixed(2);
        const completePercentage = ((completedCount / totalCount) * 100).toFixed(2);
        const inProgressPercentage = ((inProgressCount / totalCount) * 100).toFixed(2);

        setCancelledCount(cancelledCount);
        setCompleteCount(completedCount);
        setInProgressCount(inProgressCount);

        setCancelData(parseFloat(cancelPercentage));
        setCompleteData(parseFloat(completePercentage));
        setInProgressData(parseFloat(inProgressPercentage));
      } else {
        setCancelData(0);
        setCompleteData(0);
        setInProgressData(0);
      }
    } catch (error) {
      console.error("Error fetching order and refund data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const data = [
    { value: cancelData, label: 'Refuse', color: '#FF8042' },
    { value: inProgressData, label: 'Processing', color: '#FFBB28' },
    { value: completeData, label: 'Approved', color: '#00C49F' },
  ];

  const handlePieChartClick = () => {
    navigate('/admin/requeststore');
  };

  const handleLineChartData = async () => {
    try {
      const yearlyRevenue = orders.reduce((acc, order) => {
        const date = new Date(order.order_date);
        const year = date.getFullYear();
        if (!acc[year]) {
          acc[year] = 0;
        }
        acc[year] += order.amount;
        return acc;
      }, {});

      const yearlyRefund = refunds.reduce((acc, refund) => {
        const date = new Date(refund.create_date);
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

  const fetchMinMaxYears = async () => {
    try {
      const orderRes = await orderByYearApi();
      const ordersData = orderRes.data.data || [];
      const years = ordersData.map((order) => new Date(order.orderDate).getFullYear());
      const min = Math.min(...years);
      setMinYear(min);
      setMaxYear(min + 15);
    } catch (error) {
      console.error("Error fetching min and max years:", error);
    }
  };

  const valueFormatter = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}bil`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}mil`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k`;
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
  };

  const customize = {
    height: 400,
    legend: { hidden: false },
    margin: { top: 5 },
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ position: "sticky", marginTop: "20px", padding: "16px", border: "1px solid #ff469e", borderRadius: "10px", backgroundColor: "white" }}>
        <Typography sx={{ padding: "8px", background: "#ff469e", color: "white", fontWeight: "bold", fontSize: "18px", borderRadius: "4px", textAlign: "center", marginBottom: "16px" }}>
          Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} md={12}>
                <Card>
                  <CardContent style={{ height: "242px" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold", color: "#E9967A", marginBottom: "20px", paddingBottom: "20px" }}>
                      Total Revenue Year (VND)
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "30px",
                        paddingRight: "10px",
                        fontSize: "45px"
                      }}
                    >
                      <ArrowDropUpIcon fontSize="medium" style={{ fontSize: "35px", color: "#228B22" }} />
                      <span style={{ color: "#228B22" }}>{valueFormatter(totalRevenue)}</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card>
                  <CardContent style={{ height: "243px" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold", color: "#E9967A", marginBottom: "20px", paddingBottom: "20px" }}>
                      Total Refund Year (VND)
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "30px",
                        paddingRight: "10px",
                        fontSize: "45px"
                      }}
                    >
                      <ArrowDropDownIcon fontSize="medium" style={{ fontSize: "35px", color: "rgb(2, 178, 175)", marginTop: "30px" }} />
                      <span style={{ color: "rgb(2, 178, 175)" }}>{valueFormatter(totalRefund)}</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9} md={9} sx={{ position: 'relative' }}>
            <Card>
              <CardContent style={{ height: "500px", display: "flex", flexDirection: "column" }}>
                <Grid>
                  <Typography variant="h6" style={{ fontSize: "25px", fontWeight: "bold", color: "#ff469e", marginBottom: "20px", paddingBottom: "20px" }}>
                    Overall Milk Profit
                  </Typography>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: 90,
                      position: 'absolute',
                      top: 22,
                      left: 250,
                    }}
                  >
                    <InputLabel htmlFor="year-select" shrink style={{ fontWeight: "bold", color: "#E9967A" }} >Year</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={handleYearChange}
                      label="Year"
                      inputProps={{
                        name: "Year",
                        id: "year-select",
                      }}
                      displayEmpty
                    >
                      {yearsList.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <BarChart
                  dataset={BarChartData}
                  yAxis={[{ fontWeight: "bold", paddingBottom: "20px", valueFormatter }]}
                  xAxis={[{ scaleType: 'band', dataKey: 'month', label: 'Month' }]}
                  series={[
                    { dataKey: 'Revenue', label: 'Revenue', valueFormatter: (value) => valueFormatter(value) + " VND", color: '#228B22' },
                    { dataKey: 'Refund', label: 'Refund', valueFormatter: (value) => valueFormatter(value) + " VND", color: "rgb(2, 178, 175)" }
                  ]} valueFormatter
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={10} md={10}>
            <Card>
              <CardContent style={{ height: "420px", display: "flex" }}>
                <Grid marginTop={"90px"}>
                  <Typography variant="h6" style={{ fontSize: "25px", fontWeight: "bold", color: "#ff469e", textAlign: "center", paddingTop: "10px", paddingLeft: "25px", paddingBottom: "20px" }}>
                    Monthly Stores Status
                    <span style={{ color: "#D2B48C" }}> {currentYear}</span>
                  </Typography>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: 120,
                      marginTop: 5,
                      marginLeft: 78,
                    }}
                  >
                    <InputLabel htmlFor="month-select" shrink style={{ fontWeight: "bold", color: "#D2B48C" }}>Month</InputLabel>
                    <Select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      label="Month"
                      inputProps={{
                        name: "Month",
                        id: "month-select",
                      }}
                      displayEmpty
                    >
                      {monthsList.map((month) => (
                        <MenuItem key={month} value={month}>
                          {new Date(currentYear, month - 1).toLocaleString('en-US', {
                            month: 'long',
                          })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => `${item.value}%`,
                      arcLabelMinAngle: 45,
                      data,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                />
                {/* <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: cancelData, label: `Refuse\n(${cancelData}%)`, color: "#FF6347" },
                        { id: 1, value: completeData, label: `Approved\n(${completeData}%)`, color: "#66CDAA" },
                        { id: 2, value: inProgressData, label: `Pending\n(${inProgressData}%)`, color: "#FFD700" },
                      ],
                    },
                  ]}
                /> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={2} md={2}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} md={12}>
                <Card onClick={handlePieChartClick} sx={{ ":hover": { backgroundColor: '#FFFAF0' } }}>
                  <CardContent style={{ height: "129px" }}>
                    <Grid>
                      <Typography variant="body1" style={{ fontWeight: "bold", fontSize: "20px", color: '#FF8042' }}>
                        Refuse
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px"
                        }}
                      >
                        <span>{valueFormatter(cancelledCount)}</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card onClick={handlePieChartClick} sx={{ ":hover": { backgroundColor: '#FFFAF0' } }}>
                  <CardContent style={{ height: "130px" }}>
                    <Grid>
                      <Typography variant="body1" style={{ fontWeight: "bold", fontSize: "20px", color: '#FFBB28'}}>
                        Processing
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px"
                        }}
                      >
                        <span>{valueFormatter(inProgressCount)}</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card onClick={handlePieChartClick} sx={{ ":hover": { backgroundColor: '#FFFAF0' } }}>
                  <CardContent style={{ height: "130px" }}>
                    <Grid>
                      <Typography variant="body1" style={{ fontWeight: "bold", fontSize: "20px", color: '#00C49F' }}>
                        Approved
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          fontSize: "30px"
                        }}
                      >
                        <span>{valueFormatter(completedCount)}</span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent style={{ height: "500px", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" style={{ fontSize: "25px", fontWeight: "bold", textAlign: "center", color: "#ff469e", marginBottom: "40px", marginLeft: "10px" }}>Profit Milk Each Year</Typography>
                <LineChart
                  xAxis={[
                    {
                      fontWeight: "bold", label: 'Year',
                      dataKey: 'year',
                      valueFormatter: (year) => year.toString(),
                      min: minYear,
                      max: maxYear,
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
  );
}