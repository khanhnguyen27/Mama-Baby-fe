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
  Menu,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { KeyboardCapslock } from "@mui/icons-material";
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
import { allProductByStoreApi } from "../../api/ProductAPI";
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
  const [visible, setVisible] = useState(false);
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
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

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

  const fetchData = async () => {
    if (!storeId) return;
    try {
      const orderRes = await orderByStoreIdApi(storeId);
      const exchangeRes = await exchangeByStoreIdApi(storeId);
      const refundRes = await refundByStoreIdApi(storeId);
      const productRes = await allProductByStoreApi({ limit: 1000 });

      const ordersData = orderRes.data.data || [];
      const refundsData = refundRes.data.data || [];

      calculateYearlyData(ordersData, refundsData);
      calculateMonthlyData(ordersData, refundsData, selectedYear);

      setOrders(ordersData);
      setExchanges(exchangeRes.data.data || []);
      setRefunds(refundRes.data.data || []);

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
          x[item.id] = [item.name, item.description, item.type];
          return x;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching data:", error);
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
    }
  };
  useEffect(() => {
    calculateMonthlyRevenueData();
  }, [orders]);

  const calculateMonthlyRevenueData = () => {
    // Lọc các đơn hàng đã hoàn thành
    const completedOrders = orders.filter((order) =>
      order.status_order_list.some((status) => status.status === "COMPLETED")
    );

    // Lọc các đơn hoàn trả đã được chấp nhận
    const acceptedRefunds = refunds.filter(
      (refund) => refund.status === "ACCEPT"
    );

    // Tạo mảng để lưu trữ doanh thu theo từng tháng
    const revenueData = Array(12).fill(0);

    // Tính tổng doanh thu theo từng tháng từ các đơn hàng đã hoàn thành và các đơn hoàn trả đã được chấp nhận
    completedOrders.forEach((order) => {
      const orderMonth = new Date(order.order_date).getMonth();
      revenueData[orderMonth] += order.final_amount || 0;
    });

    acceptedRefunds.forEach((refund) => {
      const refundMonth = new Date(refund.create_date).getMonth();
      revenueData[refundMonth] -= refund.amount || 0;
    });

    // Cập nhật state với dữ liệu tổng doanh thu theo từng tháng
    setMonthlyRevenueData(revenueData);
  };

  const MonthlyDataChart
    = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenueData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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

  const borderStyle = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const header1Style = {
    font: { bold: true },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF9BC2E6" } },
    height: 40,
    border: borderStyle,
  };

  const header2Style = {
    font: { bold: true },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } },
    height: 40,
    border: borderStyle,
  };
  const brattle = {
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE7E6E6" } },
    border: borderStyle,
  };

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

    // Merge header row 1 cells
    worksheet.mergeCells("A1:J1");
    worksheet.mergeCells("L1:O1");
    worksheet.mergeCells("Q1:U1");

    worksheet.getRow(1).eachCell((cell) => {
      cell.style = header1Style;
    });
    worksheet.getRow(2).eachCell((cell) => {
      cell.style = header2Style;
    });

    worksheet.getRow(1).height = 30; // Height for header row 1
    worksheet.getRow(2).height = 30; // Height for header row 2
    // Set column widths
    worksheet.getColumn("A").width = 15; // Month
    worksheet.getColumn("B").width = 15; // Order Id
    worksheet.getColumn("C").width = 30; // Customer Name
    worksheet.getColumn("D").width = 15; // Phone
    worksheet.getColumn("E").width = 40; // Shipping Address
    worksheet.getColumn("F").width = 20; // Order Date
    worksheet.getColumn("G").width = 20; // Total Amount
    worksheet.getColumn("H").width = 20; // Discount
    worksheet.getColumn("I").width = 20; // Final Amount
    worksheet.getColumn("J").width = 20; // Payment Method
    worksheet.getColumn("K").width = 4; // Empty column
    worksheet.getColumn("L").width = 15; // Exchange Id
    worksheet.getColumn("M").width = 30; // Exchange Description
    worksheet.getColumn("N").width = 20; // Exchange Create Date
    worksheet.getColumn("O").width = 20; // Exchange of Order Id
    worksheet.getColumn("P").width = 4; // Empty column
    worksheet.getColumn("Q").width = 15; // Refund Id
    worksheet.getColumn("R").width = 30; // Refund Description
    worksheet.getColumn("S").width = 20; // Refund Create Date
    worksheet.getColumn("T").width = 20; // Refund Amount
    worksheet.getColumn("U").width = 20; // Refund of Order Id

    // Create a map to keep track of order row indices
    const orderRowMap = new Map();

    let currentRow = 3; // Starting row index (accounting for header rows)

    months.forEach((month) => {
      // Filter and sort data by month
      const monthOrders = orders
        .filter((order) => {
          const orderDate = new Date(order.order_date);
          const monthYear = `${orderDate.getMonth() + 1
            }-${orderDate.getFullYear()}`;
          return monthYear === month;
        })
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      const monthRefunds = refunds
        .filter((refund) => {
          const refundDate = new Date(refund.create_date);
          const monthYear = `${refundDate.getMonth() + 1
            }-${refundDate.getFullYear()}`;
          return monthYear === month;
        })
        .sort((a, b) => new Date(b.create_date) - new Date(a.create_date));

      const monthExchanges = exchanges
        .filter((exchange) => {
          const exchangeDate = new Date(exchange.create_date);
          const monthYear = `${exchangeDate.getMonth() + 1
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

        const row = worksheet.addRow([
          month,
          order.id || "",
          order.full_name || "",
          order.phone_number || "",
          order.shipping_address || "",
          order.order_date || "",
          order.amount || "",
          order.total_discount || 0,
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

        // Apply styles to the row
        row.height = 20; // Set row height
        row.eachCell((cell, colNumber) => {
          // Add borders to all cells
          cell.border = borderStyle;

          // Apply number formats
          if ([7, 8, 9, 20].includes(colNumber)) {
            cell.numFmt = "#,##0"; // Use thousands separator
          }

          // Apply currency format to amount columns
          if ([7, 8, 9, 20].includes(colNumber)) {
            cell.numFmt = "#,##0 [$VND]"; // Add VND currency symbol
          }

          // Apply date format
          if ([6, 14, 19].includes(colNumber)) {
            cell.numFmt = "yyyy-mm-dd hh:mm:ss";
          }
        });

        // Apply alternating row styles
        const isEvenRow = currentRow % 2 === 0;
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: isEvenRow ? "FFFCE4D6" : "FFFFFFFF" },
          };
        });

        currentRow++;
      }
    });

    // Get the last row of the worksheet
    const lastRow = worksheet.rowCount;
    // Merge empty columns G and L for the full range
    worksheet.mergeCells(`K1:K${lastRow}`);
    worksheet.mergeCells(`P1:P${lastRow}`);

    worksheet.getCell(`K1`).style = brattle;
    worksheet.getCell(`P1`).style = brattle;

    // Add hyperlinks for exchange and refund order IDs
    worksheet.eachRow((row, rowNumber) => {
      const exchangeOrderIdCell = row.getCell(15); // Exchange of Order Id column
      const exchangeOrderId = exchangeOrderIdCell.value;
      if (exchangeOrderId && orderRowMap.has(exchangeOrderId)) {
        const targetRow = orderRowMap.get(exchangeOrderId);
        exchangeOrderIdCell.value = {
          text: exchangeOrderId,
          hyperlink: `#LIST_OER!B${targetRow}`, // Link to the order ID cell in the corresponding row
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
          hyperlink: `#LIST_OER!B${targetRow}`, // Link to the order ID cell in the corresponding row
        };
        refundOrderIdCell.font = {
          color: { argb: "FF0000FF" },
          underline: true,
        };
      }
    });
  };

  const addDetailsToWorksheet2 = (
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

    // Merge header row 1 cells
    worksheet2.mergeCells("A1:F1");
    worksheet2.mergeCells("H1:K1");
    worksheet2.mergeCells("M1:Q1");

    worksheet2.getRow(1).eachCell((cell) => {
      cell.style = header1Style;
    });
    worksheet2.getRow(2).eachCell((cell) => {
      cell.style = header2Style;
    });

    worksheet2.getRow(1).height = 30; // Height for header row 1
    worksheet2.getRow(2).height = 30; // Height for header row 2
    // Set column widths
    worksheet2.getColumn("A").width = 15; // Order Id
    worksheet2.getColumn("B").width = 30; // Product Name
    worksheet2.getColumn("C").width = 40; // Description
    worksheet2.getColumn("D").width = 15; // Quantity
    worksheet2.getColumn("E").width = 20; // Price
    worksheet2.getColumn("F").width = 15; // Point
    worksheet2.getColumn("G").width = 4; // Empty column
    worksheet2.getColumn("H").width = 15; // Exchange Id
    worksheet2.getColumn("I").width = 30; // Exchange Product Name
    worksheet2.getColumn("J").width = 15; // Exchange Quantity
    worksheet2.getColumn("K").width = 20; // Exchange of Order Id
    worksheet2.getColumn("L").width = 4; // Empty column
    worksheet2.getColumn("M").width = 15; // Refund Id
    worksheet2.getColumn("N").width = 30; // Refund Product Name
    worksheet2.getColumn("O").width = 15; // Refund Quantity
    worksheet2.getColumn("P").width = 20; // Refund Price
    worksheet2.getColumn("Q").width = 20; // Refund of Order Id

    orders
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      .forEach((order) => {
        const orderDetails = order.order_detail_list || [];

        const exchangeDetailList = exchanges
          .filter((exchange) => exchange.order_id === order.id)
          .flatMap((exchange) => exchange.exchange_detail_list || []);
        const refundDetailList = refunds
          .filter((refund) => refund.order_id === order.id)
          .flatMap((refund) => refund.refund_detail_list || []);

        const maxDetailsRows = Math.max(
          orderDetails.length,
          exchangeDetailList.length,
          refundDetailList.length
        );

        let currentRow = worksheet2.rowCount + 1;

        for (let i = 0; i < maxDetailsRows; i++) {
          const orderDetail = orderDetails[i] || {};
          const exchangeDetail = exchangeDetailList[i] || {};
          const refundDetail = refundDetailList[i] || {};

          const orderProduct = productMap[orderDetail.product_id] || ["", ""];
          const exchangeProduct = productMap[exchangeDetail.product_id] || [
            "",
            "",
          ];
          const refundProduct = productMap[refundDetail.product_id] || ["", ""];

          const row = worksheet2.addRow([
            order.id,
            orderProduct[0] || "",
            orderProduct[1] || "",
            orderDetail.quantity || "",
            orderDetail.unit_price || "",
            orderDetail.point || 0,
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

          // Apply styles to the row
          row.height = 20; // Set row height
          row.eachCell((cell, colNumber) => {
            // Add borders to all cells
            cell.border = borderStyle;

            // Apply number formats
            if ([4, 5, 6, 10, 15, 16].includes(colNumber)) {
              cell.numFmt = "#,##0"; // Use thousands separator
            }

            // Apply currency format to price columns
            if ([5, 16].includes(colNumber)) {
              cell.numFmt = "#,##0 [$VND]"; // Add VND currency symbol
            }

            // Center-align quantity and point columns
            if ([4, 6, 10, 15].includes(colNumber)) {
              cell.alignment = { horizontal: "center" };
            }
          });

          // Apply alternating row styles
          const isEvenRow = currentRow % 2 === 0;
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: isEvenRow ? "FFFCE4D6" : "FFFFFFFF" },
            };
          });

          row.getCell(1).font = { bold: true };
          row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
          row.getCell(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2EFDA" },
          };
          currentRow++;
        }
      });
    // Get the last row of the worksheet
    const lastRow = worksheet2.rowCount;
    // Merge empty columns G and L for the full range
    worksheet2.mergeCells(`G1:G${lastRow}`);
    worksheet2.mergeCells(`L1:L${lastRow}`);

    worksheet2.getCell(`G1`).style = brattle;
    worksheet2.getCell(`L1`).style = brattle;

    // Add hyperlinks for order, exchange, and refund order IDs
    worksheet1.eachRow((row, rowNumber) => {
      const orderIdCell = row.getCell(2); // Order Id column
      const orderId = orderIdCell.value;
      if (orderId && orderRowMap.has(orderId)) {
        orderIdCell.value = {
          text: orderId,
          hyperlink: `#OER_DETAILS!A${orderRowMap.get(orderId)}`,
        };
        orderIdCell.font = { color: { argb: "FF0000FF" }, underline: true };
      }
    });

    // Merge Order Id cells with the same value
    let previousOrderId = null;
    let mergeStartRow = null;

    worksheet2.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        // Skip header rows
        const currentOrderId = row.getCell(1).value;
        if (currentOrderId !== previousOrderId) {
          if (mergeStartRow && rowNumber - mergeStartRow > 1) {
            worksheet2.mergeCells(`A${mergeStartRow}:A${rowNumber - 1}`);
          }
          previousOrderId = currentOrderId;
          mergeStartRow = rowNumber;
        }
      }
    });

    // Handle the last group of merged cells
    if (mergeStartRow && worksheet2.rowCount - mergeStartRow > 0) {
      worksheet2.mergeCells(`A${mergeStartRow}:A${worksheet2.rowCount}`);
    }
  };

  const groupProductSalesByMonth = (orders, refunds) => {
    const productSales = {};

    // Process orders
    orders.forEach((order) => {
      const orderMonth = new Date(order.order_date)
        .toISOString()
        .substring(0, 7); // YYYY-MM

      order.order_detail_list.forEach((detail) => {
        const productId = detail.product_id;
        const productName = productMap[productId][0];
        const productDescription = productMap[productId][1];
        const productType = productMap[productId][2];
        const totalAmount = detail.amount_price;

        if (productType !== "WHOLESALE") {
          return; // Skip products that are not "wholesales"
        }

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
            refundQuantity: 0, // Initialize refund quantity
            refundAmount: 0, // Initialize refund amount
          };
        }

        productSales[productId].monthlySales[orderMonth].quantity +=
          detail.quantity;
        productSales[productId].monthlySales[orderMonth].totalAmount +=
          totalAmount;
      });
    });

    // Process refunds
    refunds.forEach((refund) => {
      const refundMonth = new Date(refund.create_date)
        .toISOString()
        .substring(0, 7); // YYYY-MM

      refund.refund_detail_list.forEach((detail) => {
        const productId = detail.product_id;
        const totalAmount = detail.amount;

        if (!productSales[productId]) {
          const productName = productMap[productId][0];
          const productDescription = productMap[productId][1];
          productSales[productId] = {
            name: productName,
            description: productDescription,
            monthlySales: {},
          };
        }

        if (!productSales[productId].monthlySales[refundMonth]) {
          productSales[productId].monthlySales[refundMonth] = {
            quantity: 0,
            totalAmount: 0,
            refundQuantity: 0,
            refundAmount: 0,
          };
        }

        productSales[productId].monthlySales[refundMonth].refundQuantity +=
          detail.quantity;
        productSales[productId].monthlySales[refundMonth].refundAmount +=
          totalAmount;
      });
    });

    return productSales;
  };

  const addProductSalesToWorksheet3 = (worksheet, productSales) => {
    const headerRow1 = ["Order", "", "", "", "", "", "", "", "Refund", "", ""];
    const headerRow2 = [
      "Month",
      "Product Id",
      "Product Name",
      "Description",
      "Quantity Sold",
      "Average price (VND)",
      "Total Revenue (VND)",
      "",
      "Quantity Refunded",
      "Average Refund Price (VND)",
      "Total Refund Amount (VND)",
    ];
    worksheet.addRow(headerRow1);
    worksheet.addRow(headerRow2);

    // Merge header row 1 cells
    worksheet.mergeCells("A1:G1");
    worksheet.mergeCells("I1:K1");

    worksheet.getRow(1).eachCell((cell) => {
      cell.style = header1Style;
    });
    worksheet.getRow(2).eachCell((cell) => {
      cell.style = header2Style;
    });

    worksheet.getRow(1).height = 30; // Height for header row 1
    worksheet.getRow(2).height = 30; // Height for header row 2
    // Set column widths
    worksheet.getColumn("A").width = 15; // Month
    worksheet.getColumn("B").width = 15; // Product Id
    worksheet.getColumn("C").width = 30; // Product Name
    worksheet.getColumn("D").width = 40; // Description
    worksheet.getColumn("E").width = 15; // Quantity Sold
    worksheet.getColumn("F").width = 20; // Average price
    worksheet.getColumn("G").width = 20; // Total Revenue
    worksheet.getColumn("H").width = 4; // Empty column
    worksheet.getColumn("I").width = 20; // Quantity Refunded
    worksheet.getColumn("J").width = 25; // Average Refund Price
    worksheet.getColumn("K").width = 25; // Total Refund Amount

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
          refundQuantity: product.monthlySales[month].refundQuantity,
          refundAmount: product.monthlySales[month].refundAmount,
        }));
      })
      .sort((a, b) => new Date(b.month) - new Date(a.month));

    sortedProductSales.forEach((sale, index) => {
      const averagePrice = sale.totalAmount / sale.quantitySold;
      const averageRefundPrice = sale.refundAmount / sale.refundQuantity;
      const row = worksheet.addRow([
        sale.month,
        sale.productId,
        sale.productName,
        sale.productDescription,
        sale.quantitySold,
        isNaN(averagePrice) ? 0 : averagePrice,
        sale.totalAmount,
        "",
        sale.refundQuantity,
        isNaN(averageRefundPrice) ? 0 : averageRefundPrice,
        sale.refundAmount,
      ]);

      // Apply styles to the row
      row.height = 20; // Set row height
      row.eachCell((cell, colNumber) => {
        // Add borders to all cells
        cell.border = borderStyle;

        // Apply number formats
        if ([5, 6, 7, 9, 10, 11].includes(colNumber)) {
          cell.numFmt = "#,##0"; // Use thousands separator
        }

        // Apply currency format to price and amount columns
        if ([6, 7, 10, 11].includes(colNumber)) {
          cell.numFmt = "#,##0 [$VND]"; // Add VND currency symbol
        }

        // Center-align quantity columns
        if ([5, 9].includes(colNumber)) {
          cell.alignment = { horizontal: "center" };
        }
      });

      // Apply alternating row styles
      if (index % 2 !== 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFCE4D6" },
          };
        });
      }
    });
    const lastRow = worksheet.rowCount;
    // Merge empty columns G and L for the full range
    worksheet.mergeCells(`H1:H${lastRow}`);
    worksheet.getCell(`H1`).style = brattle;
  };

  const handleExportReport = () => {
    if (!orders || !refunds || !exchanges) {
      console.error("Orders, refunds, or exchanges data is not available.");
      return;
    }

    // Sử dụng selectedYear từ state
    const year = selectedYear;

    // Lọc dữ liệu
    const filteredOrders = orders.filter(
      (order) =>
        (new Date(order.order_date).getFullYear() === year) &&
        (order.status_order_list.some(
          (status) => status.status === "COMPLETED"
        ) ||
          (order.payment_method === "VNPAY" &&
            order.status_order_list.some(
              (status) => status.status === "CANCELLED"
            )))
    );
    const filteredRefunds = refunds.filter(
      (refund) =>
        (new Date(refund.create_date).getFullYear() === year) &&
        refund.status === "ACCEPT"
    );
    const filteredExchanges = exchanges.filter(
      (exchange) =>
        (new Date(exchange.create_date).getFullYear() === year) &&
        exchange.status === "ACCEPT"
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet1 = workbook.addWorksheet("LIST_OER");
    const worksheet2 = workbook.addWorksheet("OER_DETAILS");
    const worksheet3 = workbook.addWorksheet("PRODUCT");

    // Nhóm orders theo tháng
    const months = groupMonths(
      filteredOrders,
      filteredRefunds,
      filteredExchanges
    );

    // Thêm dữ liệu vào worksheet1
    addDataToWorksheet1(
      worksheet1,
      filteredOrders,
      filteredRefunds,
      filteredExchanges,
      months
    );

    // Thêm dữ liệu vào worksheet2
    addDetailsToWorksheet2(
      worksheet2,
      filteredOrders,
      filteredExchanges,
      filteredRefunds,
      worksheet1
    );

    // Nhóm dữ liệu bán hàng theo sản phẩm và tháng
    const productSales = groupProductSalesByMonth(
      filteredOrders || [],
      filteredRefunds || []
    );

    // Thêm dữ liệu vào worksheet3
    addProductSalesToWorksheet3(worksheet3, productSales);

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        saveAs(
          new Blob([buffer]),
          "ReportStore_order_refund_store_monthly.xlsx"
        );
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
        elevation={2}
        sx={{
          position: "sticky",
          marginTop: "20px",
          marginBottom: "20px",
          padding: "16px",
          border: "1px solid #ff469e",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <Typography
          sx={{
            padding: "11px",
            background: "#ff469e",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
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
          <SummarizeIcon />
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
          <Grid item xs={8} md={8}>
            <Card
              style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
            >
              <CardContent style={{ height: "780px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "25px",
                    fontWeight: "bold",
                    color: "#ff469e",
                    textAlign: "center",
                    paddingTop: "10px",
                    "&:hover": {
                      cursor: "pointer",
                      color: "#E9967A",
                    },
                  }}
                  onClick={handlePieChartClick}
                >
                  Orders of Store
                </Typography>
                <Pie
                  data={pieData}
                  options={{
                    plugins: {
                      datalabels: {
                        formatter: (value, ctx) => {
                          if (value === 0) {
                            return '';
                          }
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
                      legend: {
                        display: true,
                        position: "right",
                      },
                    },
                    elements: {
                      arc: {
                        borderWidth: 0,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} md={4}>
            <Grid container spacing={2} direction="row">
              <Grid item xs={6} md={6}>
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
              <Grid item xs={6} md={6}>
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
              <Grid item xs={12}>
                <Card
                  style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                >
                  <CardContent style={{ height: "225px" }}>
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
                          paddingTop: "40px",
                          fontSize: "35px",
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
                  style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                >
                  <CardContent style={{ height: "225px" }}>
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
                          paddingTop: "40px",
                          fontSize: "35px",
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
                  style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
                >
                  <CardContent style={{ height: "225px" }}>
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
                          paddingTop: "40px",
                          fontSize: "35px",
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

          {/* Financial Summary */}
          <Grid item xs={8}>
            <Card
              style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
            >
              <Typography
                variant="h6"
                style={{
                  textAlign: "center",
                  color: "#ff469e",
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                Financial Summary
              </Typography>
              <CardContent style={{ height: "595px", display: "flex" }}>
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
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "201px" }}>
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
                          paddingTop: "40px",
                          fontSize: "35px",
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
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "201px" }}>
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
                          paddingTop: "40px",
                          fontSize: "35px",
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
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "201px" }}>
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
                          paddingTop: "40px",
                          fontSize: "35px",
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
            <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    textAlign: "center",
                    color: "#ff469e",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  Monthly Profit
                </Typography>
                <Bar
                  data={MonthlyDataChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Months",
                        },
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Revenue",
                        },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    textAlign: "center",
                    color: "#ff469e",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  Yearly Profit
                </Typography>
                <Bar data={yearlyBarData} options={yearlyBarOptions} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      {
        visible && (
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
        )
      }
    </Container >
  );
}
