import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
  Button,
  Menu,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import MenuIcon from "@mui/icons-material/Menu";
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
import { orderByStoreIdApi } from "../../api/OrderAPI";
import { refundByStoreIdApi } from "../../api/RefundAPI";
import { exchangeByStoreIdApi } from "../../api/ExchangeAPI";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { allProductApi } from "../../api/ProductAPI";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [monthlyData, setMonthlyData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [store, setStore] = useState(null);
  const [productMap, setProductMap] = useState({});
  const [yearOptions, setYearOptions] = useState([]);

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

  const fetchData = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const orderRes = await orderByStoreIdApi(storeId);
      const exchangeRes = await exchangeByStoreIdApi(storeId);
      const refundRes = await refundByStoreIdApi(storeId);
      const productRes = await allProductApi({ limit: 1000 });

      console.log("Orders:", orderRes.data.data);
      console.log("Exchanges:", exchangeRes.data.data);
      console.log("Refunds:", refundRes.data.data);
      const ordersData = orderRes.data.data || [];
      const refundsData = refundRes.data.data.refunds || [];

      calculateYearlyData(ordersData, refundsData);
      calculateMonthlyData(ordersData, refundsData, selectedYear);

      setOrders(ordersData);
      setExchanges(exchangeRes.data.data.exchanges || []);
      setRefunds(refundsData);

      const years = [
        ...new Set(
          ordersData.map((order) => new Date(order.order_date).getFullYear())
        ),
      ];
      setYearOptions(years);
      if (!years.includes(selectedYear)) {
        setSelectedYear(years[0] || new Date().getFullYear());
      }

      const productData = productRes?.data?.data?.products || [];
      setProductMap(
        productData.reduce((x, item) => {
          x[item.id] = [item.name, item.description];
          return x;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchData();
      calculatePercentage(selectedMonth, selectedYear);
    }
  }, [storeId, selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
    calculatePercentage(selectedMonth, selectedYear);
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);
    calculatePercentage(selectedMonth, selectedYear);
    calculateMonthlyData(orders, refunds, selectedYear);
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

  const calculateMonthlyData = (ordersData, refundsData, year) => {
    const data = {};
    for (let i = 0; i < 12; i++) {
      data[i] = { orders: 0, refunds: 0 };
    }
    ordersData.forEach((order) => {
      const isCompleted = order.status_order_list.some(
        (status) => status.status === "COMPLETED"
      );
      const orderYear = new Date(order.order_date).getFullYear();
      const orderMonth = new Date(order.order_date).getMonth();
      if (isCompleted && orderYear === year) {
        data[orderMonth].orders += order.final_amount || 0;
      }
    });
    refundsData.forEach((refund) => {
      const refundYear = new Date(refund.create_date).getFullYear();
      const refundMonth = new Date(refund.create_date).getMonth();
      if (refundYear === year) {
        data[refundMonth].refunds += refund.amount || 0;
      }
    });
    setMonthlyData(data);
  };

  const calculatePercentage = async (
    month = selectedMonth,
    year = selectedYear
  ) => {
    if (!storeId) return;
    setLoading(true);
    try {
      const orderRes = await orderByStoreIdApi(storeId);
      const exchangeRes = await exchangeByStoreIdApi(storeId);
      const refundRes = await refundByStoreIdApi(storeId);

      const ordersData = (orderRes.data.data || []).filter(
        (order) =>
          new Date(order.order_date).getMonth() + 1 === month &&
          new Date(order.order_date).getFullYear() === year
      );

      const exchangesData = (exchangeRes.data.data || []).filter(
        (exchange) =>
          new Date(exchange.create_date).getMonth() + 1 === month &&
          new Date(exchange.create_date).getFullYear() === year
      );

      const refundsData = (refundRes.data.data || []).filter(
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

  const handleExportPDF = async () => {
    const input = document.getElementById("dashboard");
    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("Dashboard.pdf");
    } else {
      console.error("Element not found: #dashboard");
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePieChartClick = () => {
    navigate("/staff/orders");
  };

  function extractMonths(data, dateField) {
    const uniqueMonths = new Set();
    data.forEach((item) => {
      const date = new Date(item[dateField]);
      const month = date.getMonth() + 1; // getMonth() trả về giá trị từ 0-11 nên cần +1
      const year = date.getFullYear();
      uniqueMonths.add(`${month}-${year}`);
    });
    return uniqueMonths;
  }

  // Hàm nhóm các tháng từ nhiều danh sách dữ liệu
  function groupMonths(orders, refunds, exchanges) {
    const orderMonths = extractMonths(orders, "order_date");
    const refundMonths = extractMonths(refunds, "create_date");
    const exchangeMonths = extractMonths(exchanges, "create_date"); // Giả sử 'create_date' cũng dùng cho exchanges

    const allMonths = new Set([
      ...orderMonths,
      ...refundMonths,
      ...exchangeMonths,
    ]);
    return Array.from(allMonths).sort((a, b) => {
      const [monthA, yearA] = a.split("-").map(Number);
      const [monthB, yearB] = b.split("-").map(Number);
      return yearB - yearA || monthB - monthA;
    });
  }
  const months = groupMonths(orders, refunds, exchanges);

  const addDataToWorksheet1 = (
    worksheet,
    orders,
    refunds,
    exchanges,
    months
  ) => {
    const headerRow1 = [
      "Order",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Exchange",
      "",
      "",
      "",
      "",
      "Refund",
      "",
      "",
      "",
      "",
      "",
    ];

    const headerRow2 = [
      "Month",
      "Order Id",
      "Customer Name",
      "Phone",
      "Shipping Address",
      "Order Date",
      "Total Amount (VND)",
      "Discount (VND)",
      "Final Amount (VND)",
      "Payment Method",
      "",
      "Exchange Id",
      "Description",
      "Create Date",
      "Exchange of Order Id",
      "",
      "Refund Id",
      "Description",
      "Create Date",
      "Amount",
      "Refund of Order Id",
    ];

    worksheet.addRow(headerRow1);
    worksheet.addRow(headerRow2);

    // Create a map to keep track of order row indices
    const orderRowMap = new Map();

    let currentRow = 3; // Starting row index (accounting for header rows)

    months.forEach((month) => {
      // Filter and sort data by month
      const monthOrders = orders
        .filter((order) => {
          const orderDate = new Date(order.order_date);
          const monthYear = `${
            orderDate.getMonth() + 1
          }-${orderDate.getFullYear()}`;
          return monthYear === month;
        })
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      const monthRefunds = refunds
        .filter((refund) => {
          const refundDate = new Date(refund.create_date);
          const monthYear = `${
            refundDate.getMonth() + 1
          }-${refundDate.getFullYear()}`;
          return monthYear === month;
        })
        .sort((a, b) => new Date(b.create_date) - new Date(a.create_date));

      const monthExchanges = exchanges
        .filter((exchange) => {
          const exchangeDate = new Date(exchange.create_date);
          const monthYear = `${
            exchangeDate.getMonth() + 1
          }-${exchangeDate.getFullYear()}`;
          return monthYear === month;
        })
        .sort((a, b) => new Date(b.create_date) - new Date(a.create_date));

      const maxRows = Math.max(
        monthOrders.length,
        monthRefunds.length,
        monthExchanges.length
      );

      for (let i = 0; i < maxRows; i++) {
        const order = monthOrders[i] || {};
        const refund = monthRefunds[i] || {};
        const exchange = monthExchanges[i] || {};

        worksheet.addRow([
          month,
          order.id || "",
          order.full_name || "",
          order.phone_number || "",
          order.shipping_address || "",
          order.order_date || "",
          order.amount || "",
          order.total_discount || "",
          order.final_amount || "",
          order.payment_method || "",
          "",
          exchange.id || "",
          exchange.description || "",
          exchange.create_date || "",
          exchange.order_id || "",
          "",
          refund.id || "",
          refund.description || "",
          refund.create_date || "",
          refund.amount || "",
          refund.order_id || "",
        ]);

        if (order.id) {
          orderRowMap.set(order.id, currentRow);
        }

        currentRow++;
      }
    });

    // Add hyperlinks for exchange and refund order IDs
    worksheet.eachRow((row, rowNumber) => {
      const exchangeOrderIdCell = row.getCell(15); // Exchange of Order Id column
      const exchangeOrderId = exchangeOrderIdCell.value;
      if (exchangeOrderId && orderRowMap.has(exchangeOrderId)) {
        const targetRow = orderRowMap.get(exchangeOrderId);
        exchangeOrderIdCell.value = {
          text: exchangeOrderId,
          hyperlink: `#Sheet1!B${targetRow}`, // Link to the order ID cell in the corresponding row
        };
        exchangeOrderIdCell.font = {
          color: { argb: "FF0000FF" },
          underline: true,
        };
      }

      const refundOrderIdCell = row.getCell(21); // Refund of Order Id column
      const refundOrderId = refundOrderIdCell.value;
      if (refundOrderId && orderRowMap.has(refundOrderId)) {
        const targetRow = orderRowMap.get(refundOrderId);
        refundOrderIdCell.value = {
          text: refundOrderId,
          hyperlink: `#Sheet1!B${targetRow}`, // Link to the order ID cell in the corresponding row
        };
        refundOrderIdCell.font = {
          color: { argb: "FF0000FF" },
          underline: true,
        };
      }
    });
  };

  const addOrderDetailsToWorksheet = (
    worksheet2,
    orders,
    exchanges,
    refunds,
    worksheet1
  ) => {
    // Create a map to keep track of order row indices
    const orderRowMap = new Map();

    const headerRow1 = [
      "Order",
      "",
      "",
      "",
      "",
      "",
      "",
      "Exchange",
      "",
      "",
      "",
      "",
      "Refund",
      "",
      "",
      "",
      "",
    ];
    const headerRow2 = [
      "Order Id",
      "Product Name",
      "Description",
      "Quantity",
      "Price",
      "Point",
      "",
      "Exchange Id",
      "Product Name",
      "Quantity",
      "Exchange of Order Id",
      "",
      "Refund Id",
      "Product Name",
      "Quantity",
      "Price",
      "Refund of Order Id",
    ];
    worksheet2.addRow(headerRow1);
    worksheet2.addRow(headerRow2);

    orders
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      .forEach((order) => {
        const orderDetails = order.order_detail_list;
        const exchangeDetails =
          exchanges.find((exchange) => exchange.order_id === order.id)
            ?.exchange_detail_list || [];
        const refundDetails =
          refunds.find((refund) => refund.order_id === order.id)
            ?.refund_detail_list || [];

        const maxDetailsRows = Math.max(
          orderDetails.length,
          exchangeDetails.length,
          refundDetails.length
        );

        let currentRow = worksheet2.rowCount + 1; // Starting row index (accounting for header rows)

        for (let i = 0; i < maxDetailsRows; i++) {
          const orderDetail = orderDetails[i] || {};
          const exchangeDetail = exchangeDetails[i] || {};
          const refundDetail = refundDetails[i] || {};

          const orderProduct = productMap[orderDetail.product_id] || ["", ""];
          const exchangeProduct = productMap[exchangeDetail.product_id] || [
            "",
            "",
          ];
          const refundProduct = productMap[refundDetail.product_id] || ["", ""];

          worksheet2.addRow([
            order.id,
            orderProduct[0] || "",
            orderProduct[1] || "",
            orderDetail.quantity || "",
            orderDetail.unit_price || "",
            orderDetail.point || "",
            "",
            exchangeDetail.id || "",
            exchangeProduct[0] || "",
            exchangeDetail.quantity || "",
            exchangeDetail.id ? order.id : "",
            "",
            refundDetail.id || "",
            refundProduct[0] || "",
            refundDetail.quantity || "",
            refundDetail.unit_price || "",
            refundDetail.id ? order.id : "",
          ]);

          if (order.id) {
            orderRowMap.set(order.id, currentRow);
          }

          currentRow++;
        }
      });

    // Add hyperlinks for order, exchange, and refund order IDs
    worksheet1.eachRow((row, rowNumber) => {
      const orderIdCell = row.getCell(2); // Order Id column
      const orderId = orderIdCell.value;
      if (orderId && orderRowMap.has(orderId)) {
        orderIdCell.value = {
          text: orderId,
          hyperlink: `#Sheet2!A${orderRowMap.get(orderId)}`, // Link to the order ID cell in the corresponding row in Sheet2
        };
        orderIdCell.font = { color: { argb: "FF0000FF" }, underline: true };
      }
    });
  };

  const groupProductSalesByMonth = (orders) => {
    const productSales = {};

    orders.forEach((order) => {
      const orderMonth = new Date(order.order_date)
        .toISOString()
        .substring(0, 7); // YYYY-MM

      order.order_detail_list.forEach((detail) => {
        const productId = detail.product_id;
        const productName = productMap[productId][0];
        const productDescription = productMap[productId][1];
        const totalAmount = detail.unit_price * detail.quantity;

        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            description: productDescription,
            monthlySales: {},
          };
        }

        if (!productSales[productId].monthlySales[orderMonth]) {
          productSales[productId].monthlySales[orderMonth] = {
            quantity: 0,
            totalAmount: 0,
          };
        }

        productSales[productId].monthlySales[orderMonth].quantity +=
          detail.quantity;
        productSales[productId].monthlySales[orderMonth].totalAmount +=
          totalAmount;
      });
    });

    return productSales;
  };

  const addProductSalesToWorksheet = (worksheet, productSales) => {
    const headerRow = [
      "Month",
      "Product Id",
      "Product Name",
      "Description",
      "Quantity Sold",
      "Average price (VND)",
      "Total Revenue (VND)",
    ];
    worksheet.addRow(headerRow);

    const sortedProductSales = Object.keys(productSales)
      .flatMap((productId) => {
        const product = productSales[productId];
        const productName = product.name;
        const productDescription = product.description;

        return Object.keys(product.monthlySales).map((month) => ({
          month,
          productId,
          productName,
          productDescription,
          quantitySold: product.monthlySales[month].quantity,
          totalAmount: product.monthlySales[month].totalAmount,
        }));
      })
      .sort((a, b) => new Date(b.month) - new Date(a.month));

    sortedProductSales.forEach((sale) => {
      const averagePrice = sale.totalAmount / sale.quantitySold;
      worksheet.addRow([
        sale.month,
        sale.productId,
        sale.productName,
        sale.productDescription,
        sale.quantitySold,
        averagePrice,
        sale.totalAmount,
      ]);
    });
  };

  const handleExportReport = () => {
    if (!orders || !refunds || !exchanges) {
      console.error("Orders, refunds, or exchanges data is not available.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet1 = workbook.addWorksheet("Sheet1");
    const worksheet2 = workbook.addWorksheet("Sheet2");
    const worksheet3 = workbook.addWorksheet("Sheet3");

    // Nhóm orders theo tháng
    const months = groupMonths(orders, refunds, exchanges);

    // Thêm dữ liệu vào worksheet1
    addDataToWorksheet1(worksheet1, orders, refunds, exchanges, months);

    // Thêm dữ liệu vào worksheet2
    addOrderDetailsToWorksheet(
      worksheet2,
      orders,
      refunds,
      exchanges,
      worksheet1
    );

    // Nhóm dữ liệu bán hàng theo sản phẩm và tháng
    const productSales = groupProductSalesByMonth(orders);

    // Thêm dữ liệu vào worksheet3
    addProductSalesToWorksheet(worksheet3, productSales);

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        saveAs(new Blob([buffer]), "Report_order_refund_store_monthly.xlsx");
      })
      .catch((err) => {
        console.error("Error writing Excel file:", err);
      });
  };

  return (
    <Container
      id="dashboard"
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
        <IconButton
          style={{ position: "absolute", top: 18, right: 15, color: "white" }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleExportReport();
              handleMenuClose();
            }}
          >
            Export Report
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleExportPDF();
              handleMenuClose();
            }}
          >
            Export PDF
          </MenuItem>
        </Menu>
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
            <Card
              sx={{
                marginLeft: "25px",
                boxShadow: 5,
              }}
            >
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
