import React, { useState, useEffect } from "react";
import { KeyboardCapslock } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import io from "socket.io-client";
import {
  Box,
  Menu,
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
import {
  BarChart,
  PieChart,
  pieArcLabelClasses,
  LineChart,
} from "@mui/x-charts";
import { allOrderApi, orderByYearApi } from "../../api/OrderAPI";
import { allRefundApi, refundByYearApi } from "../../api/RefundAPI";
import { allStoreByAdminApi, StoreByMonthApi } from "../../api/StoreAPI";
import { allUserForAdApi, userByYearApi } from "../../api/UserAPI";
import { allStatusOrderApi } from "../../api/OrderAPI";

export default function AdminHome() {
  window.document.title = "AdminHome";
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const PreviousMonth = (month) => (month === 1 ? 12 : month - 1);
  const currentYear = currentDate.getFullYear();
  const PreviousYear = (year = currentYear()) => year - 1;

  const [visible, setVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [months, setMonths] = useState([]);
  const [BarChartData, setBarChartData] = useState([]);
  const [ReLineChartData, setReLineChartData] = useState([]);
  const [AccountLineChartData, setAccountLineChartData] = useState([]);
  const [inProgressData, setInProgressData] = useState(0);
  const [completeData, setCompleteData] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompleteCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);
  const [yearsListOrder, setYearsListOrder] = useState([]);
  const [YearsListAccount, setYearsListAccount] = useState([]);
  const [monthsList, setMonthsList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYearOrder, setSelectedYearOrder] = useState(currentYear);
  const [selectedYearAccount, setSelectedYearAccount] = useState(currentYear);
  const [minYear, setMinYear] = useState(new Date().getFullYear() - 15);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());
  const [totalAccountYear, setTotalAccountYear] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortedMonths, setSortedMonths] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateSortedMonths = (months) => {
    const updatedSortedMonths = months
      .filter(monthYear => {
        const [month, year] = monthYear.split("-").map(Number);
        return year === selectedYearOrder; // Filter by selected year
      })
      .sort((a, b) => {
        const [monthA, yearA] = a.split("-").map(Number);
        const [monthB, yearB] = b.split("-").map(Number);

        const dateA = new Date(yearA, monthA - 1);
        const dateB = new Date(yearB, monthB - 1);

        return dateB - dateA; // Sort from newest to oldest
      });

    setSortedMonths(updatedSortedMonths);
  };

  useEffect(() => {
    fetchData();

    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("ordersUpdate", (newOrders) => {
      console.log("Received orders update:", newOrders);
      setOrders((prevOrders) => [...prevOrders, newOrders]);
      updateSortedMonths(newOrders); // Update sorted months based on new orders
    });

    socket.on("refundsUpdate", (newRefunds) => {
      console.log("Received refunds update:", newRefunds);
      setRefunds((prevRefunds) => [...prevRefunds, newRefunds]);
      updateSortedMonths(newRefunds); // Update sorted months based on new refunds
    });

    socket.on("accountsUpdate", (newAccounts) => {
      console.log("Received accounts update:", newAccounts);
      setAccounts((prevAccounts) => [...prevAccounts, newAccounts]);
      updateSortedMonths(newAccounts); // Update sorted months based on new accounts
    });

    socket.on("storesUpdate", (newStores) => {
      console.log("Received store update:", newStores);
      setStores((prevStores) => [...prevStores, newStores]);
      updateSortedMonths(newStores); // Update sorted months based on new stores
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
  }, [selectedYearOrder]);

  const fetchData = async () => {
    try {
      const orderRes = await allOrderApi();
      const storeRes = await allStoreByAdminApi();
      const refundRes = await allRefundApi();
      const accountRes = await allUserForAdApi();

      setOrders(orderRes.data.data || []);
      console.log("orderRes", orderRes);
      setStores(storeRes.data.data.stores || []);
      console.log("storeRes", storeRes);
      setRefunds(refundRes.data.data.refunds || []);
      console.log("refundRes", refundRes);
      setAccounts(accountRes.data.data || []);
      console.log("accountRes", accountRes);

      const userRes = await allUserForAdApi();
      const ordersData = orderRes.data.data || [];
      const refundData = refundRes.data.data.refunds || [];
      const userData = userRes?.data?.data || [];
      const userMap = userData.reduce((x, item) => {
        x[item.id] = [item.full_name, item.phone_number, item.address];
        return x;
      }, {});
      setUserMap(userMap);

      // Group months available
      const uniqueMonths = new Set();
      // Xử lý dữ liệu đơn hàng
      console.log("order data: ", ordersData);
      ordersData.forEach((order) => {
        const orderDate = new Date(order.order_date);
        const month = orderDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11 nên cần +1
        const year = orderDate.getFullYear();
        uniqueMonths.add(`${month}-${year}`);
        console.log(
          `Order Date: ${order.order_date}, Month-Year: ${month}-${year}`
        );
      });

      // Xử lý dữ liệu hoàn tiền
      console.log("refund data: ", refundData);
      refundData.forEach((refundItem) => {
        const refundDate = new Date(refundItem.create_date);
        const month = refundDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11 nên cần +1
        const year = refundDate.getFullYear();
        uniqueMonths.add(`${month}-${year}`);
        console.log(
          `Refund Date: ${refundItem.create_date}, Month-Year: ${month}-${year}`
        );
      });
      setMonths(Array.from(uniqueMonths));
      console.log("Month Unique:", Array.from(uniqueMonths));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchYears = async () => {
      const years = await fetchYearsOrderFromDatabase(orders);
      setYearsListOrder(years);
      console.log("Years list Order:", years);

      if (years.length > 0 && !years.includes(selectedYearOrder)) {
        setSelectedYearOrder(years[0]);
      }
    };

    fetchYears();
  }, [orders]);

  useEffect(() => {
    const fetchYears = async () => {
      const years = await fetchYearsAccountFromDatabase(accounts);
      setYearsListAccount(years);
      console.log("Years list Account:", years);

      if (years.length > 0 && !years.includes(selectedYearAccount)) {
        setSelectedYearAccount(years[0]);
      }
    };

    fetchYears();
  }, [accounts]);

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
    if (selectedYearOrder !== null) {
      handleBarChartData(selectedYearOrder);
    }
  }, [selectedYearOrder, orders, refunds]);

  useEffect(() => {
    calculatePercentage(selectedMonth);
  }, [selectedMonth, stores]);

  useEffect(() => {
    if (selectedYearAccount !== null) {
      handleLineAccountData(selectedYearAccount);
    }
  }, [selectedYearAccount, accounts]);

  useEffect(() => {
    calculateTotalAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    fetchMinMaxYears();
  }, []);

  useEffect(() => {
    handleLineOrderData();
  }, [orders, refunds]);

  const fetchYearsOrderFromDatabase = async (ordersData) => {
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

  const fetchYearsAccountFromDatabase = async (accountsData) => {
    try {
      const yearsSet = new Set();

      accountsData.forEach((account) => {
        const date = new Date(account.create_at);
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

  const handleYearOrderChange = (event) => {
    const selectedYearOrder = parseInt(event.target.value);
    setSelectedYearOrder(selectedYearOrder);
    console.log("selectedYearOrder", selectedYearOrder);
  };

  const handleYearAccountChange = (event) => {
    const selectedYearAccount = parseInt(event.target.value);
    setSelectedYearAccount(selectedYearAccount);
    console.log("selectedYearAccount", selectedYearAccount);
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
    console.log("selectedMonth", selectedMonth);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Export report revenue, refund

  // Lọc danh sách các store có trạng thái "APPROVED"
  const approvedStores = stores.filter((store) => store.status === "APPROVED");

  const calculateMonthlyData = (storeId, month, year) => {
    let revenue = 0;
    let refund = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.order_date);
      const orderMonth = orderDate.getMonth() + 1;
      const orderYear = orderDate.getFullYear();

      if (
        order.store_id === storeId &&
        orderMonth === month &&
        orderYear === year
      ) {
        if (
          order.status_order_list.some(
            (status) => status.status === "COMPLETED"
          ) ||
          (order.payment_method === "VNPAY" &&
            order.status_order_list.some(
              (status) => status.status === "CANCELLED"
            ))
        ) {
          revenue += order.final_amount; // Giả sử final_amount là doanh thu
        }
      }
    });

    refunds.forEach((refundItem) => {
      const refundDate = new Date(refundItem.create_date);
      const refundMonth = refundDate.getMonth() + 1;
      const refundYear = refundDate.getFullYear();

      if (
        refundItem.store_id === storeId &&
        refundMonth === month &&
        refundYear === year
      ) {
        if (refundItem.status == "ACCEPT") {
          refund += refundItem.amount;
        }
      }
    });

    return { revenue, refund };
  };

  const handleExportCSV = () => {
    setMonths(sortedMonths);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Define styles
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const headerStyle = {
      font: { bold: true, color: { argb: "FF000000" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB8CCE4" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
      border: borderStyle,
    };

    const monthStyle = {
      font: { bold: true, color: { argb: "FF000000" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB8CCE4" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
      border: borderStyle,
    };

    const headerRevenueStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC4D79B" },
      },
      border: borderStyle,
    };

    const headerRefundStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFABF8F" },
      },
      border: borderStyle,
    };

    const revenueStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEBF1DE" },
      },
      border: borderStyle,
    };

    const refundStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFDE9D9" },
      },
      border: borderStyle,
    };

    const infoStoreStyle1 = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEEECE1" },
      },
      border: borderStyle,
    };

    const infoStoreStyle2 = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD6D0B7" },
      },
      border: borderStyle,
    };

    const totalRowStyle = {
      font: { bold: true },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE57D" },
      },
      border: borderStyle,
    };

    // Add headers
    const headerRow1 = [
      "No.",
      "Store name",
      "Store phone",
      "Store address",
      "Owner full name",
      "Owner phone",
      "Owner address",
    ];
    const headerRow2 = ["", "", "", "", "", "", ""];

    sortedMonths.forEach((monthYear) => {
      const [month, year] = monthYear.split("-");
      headerRow1.push(`${month}-${year}`, "");
      headerRow2.push("Revenue (VND)", "Refund (VND)");
    });

    worksheet.addRow(headerRow1);
    worksheet.addRow(headerRow2);

    // Style header rows
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    worksheet.getRow(2).eachCell((cell) => {
      cell.style = headerStyle;
    });

    for (let i = 0; i < sortedMonths.length; i++) {
      // Style month cells
      const cell1 = worksheet.getCell(`${String.fromCharCode(72 + 2 * i)}1`);
      cell1.style = { ...cell1.style, ...monthStyle };

      // Style revenue cells
      const cell2 = worksheet.getCell(`${String.fromCharCode(72 + 2 * i)}2`);
      cell2.style = { ...cell2.style, ...headerRevenueStyle };

      // Style refund cells
      const cell3 = worksheet.getCell(
        `${String.fromCharCode(72 + 2 * i + 1)}2`
      );
      cell3.style = { ...cell2.style, ...headerRefundStyle };
    }

    // Add data rows
    approvedStores.forEach((store, index) => {
      const row = [
        index + 1,
        store.name_store,
        store.phone,
        store.address,
        userMap[store.user_id][0],
        userMap[store.user_id][1],
        userMap[store.user_id][2],
      ];

      sortedMonths.forEach((monthYear) => {
        const [month, year] = monthYear.split("-");
        const { revenue, refund } = calculateMonthlyData(
          store.id,
          parseInt(month),
          parseInt(year)
        );
        row.push(revenue, refund);
      });

      worksheet.addRow(row);
    });

    // Style all cells
    for (let row = 1; row <= worksheet.rowCount; row++) {
      for (let col = 1; col <= worksheet.columnCount; col++) {
        const cell = worksheet.getCell(row, col);
        if (row > 2) {
          if (col < 8) {
            if (row % 2 === 0) {
              cell.style = { ...cell.style, ...infoStoreStyle2 };
            } else {
              cell.style = { ...cell.style, ...infoStoreStyle1 };
            }
          } else if (col % 2 === 0) {
            cell.style = { ...cell.style, ...revenueStyle };
          } else {
            cell.style = { ...cell.style, ...refundStyle };
          }
        }
      }
    }

    // Add total row
    const totalRow = ["", "", "", "", "TOTAL MONTHLY AMOUNT:", "", ""];
    sortedMonths.forEach((_, index) => {
      const revenueCol = worksheet.getColumn(8 + 2 * index).letter;
      const refundCol = worksheet.getColumn(9 + 2 * index).letter;
      totalRow.push({
        formula: `SUM(${revenueCol}3:${revenueCol}${approvedStores.length + 2
          })`,
      });
      totalRow.push({
        formula: `SUM(${refundCol}3:${refundCol}${approvedStores.length + 2})`,
      });
    });
    const totalRowNumber = worksheet.addRow(totalRow).number;

    // Style total row
    worksheet.getRow(totalRowNumber).eachCell((cell) => {
      cell.style = totalRowStyle;
    });

    // Set column widths
    const columnWidths = [5, 20, 15, 30, 20, 15, 30];
    for (let i = 8; i <= worksheet.columnCount; i++) {
      columnWidths.push(15);
    }
    worksheet.columns.forEach((column, index) => {
      column.width = columnWidths[index];
    });

    // Merge cells
    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells("B1:B2");
    worksheet.mergeCells("C1:C2");
    worksheet.mergeCells("D1:D2");
    worksheet.mergeCells("E1:E2");
    worksheet.mergeCells("F1:F2");
    worksheet.mergeCells("G1:G2");
    worksheet.mergeCells(`E${totalRowNumber}:G${totalRowNumber}`);

    sortedMonths.forEach((_, index) => {
      const col = 8 + 2 * index;
      worksheet.mergeCells(1, col, 1, col + 1);
    });

    // Set number format for revenue and refund columns
    for (let col = 8; col <= worksheet.columnCount; col++) {
      worksheet.getColumn(col).numFmt = "#,##0";
    }

    // Generate Excel file
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        saveAs(new Blob([buffer]), "Report_revenue_refund_store_monthly.xlsx");
      })
      .catch((err) => {
        console.error("Error writing Excel file:", err);
      });
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
      let position = 15;

      while (heightLeft >= 0) {
        if (position !== 15) {
          pdf.addPage(); // Add a new page only if it's not the first page
        }
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
      }

      pdf.save("Dashboard.pdf");
    } else {
      console.error("Element not found: #dashboard");
    }
  };

  const handleBarChartData = async (year = selectedYearOrder) => {
    try {
      let orderRes, refundRes, statusOrderRes;

      if (year) {
        orderRes = await orderByYearApi(year);
        refundRes = await refundByYearApi(year);
        statusOrderRes = await allStatusOrderApi();
      }

      // Fallback to the previous year if no data is available for the selected year
      if (!orderRes?.data?.data.length && !refundRes?.data?.data.length) {
        const previousYear = PreviousYear(year);
        orderRes = await orderByYearApi(previousYear);
        refundRes = await refundByYearApi(previousYear);
        statusOrderRes = await allStatusOrderApi();
        setSelectedYearOrder(previousYear);
      }

      console.log("orderRes:", orderRes);
      console.log("refundRes:", refundRes);
      console.log("statusOrderRes:", statusOrderRes);

      const ordersData = orderRes?.data?.data || [];
      const refundsData = refundRes?.data?.data || [];
      const statusOrders = statusOrderRes?.data?.data || [];

      const orderIdsWithCancelStatus = statusOrders
        .filter(
          (statusOrder) => statusOrder.status.toUpperCase() === "CANCELLED"
        )
        .map((statusOrder) => statusOrder.order_id);

      const orderIdsWithCompleteStatus = statusOrders
        .filter(
          (statusOrder) => statusOrder.status.toUpperCase() === "COMPLETED"
        )
        .map((statusOrder) => statusOrder.order_id);

      console.log("BarOrderIdsWithCancelStatus:", orderIdsWithCancelStatus);
      console.log("BarOrderIdsWithCompleteStatus:", orderIdsWithCompleteStatus);

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

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      ordersData.forEach((order) => {
        if (order.type.toUpperCase() === "ORDER") {
          if (
            !(
              order.payment_method.toUpperCase() === "COD" &&
              orderIdsWithCancelStatus.includes(order.id)
            )
          ) {
            if (orderIdsWithCompleteStatus.includes(order.id)) {
              const date = new Date(order.order_date);
              const month = monthNames[date.getMonth()];
              monthlyData[month].Revenue += order.final_amount || 0;
              totalRev += order.final_amount || 0;
            }
          }
        }
      });

      refundsData.forEach((refund) => {
        if (refund.status.toUpperCase() === "ACCEPT") {
          const date = new Date(refund.create_date);
          const month = monthNames[date.getMonth()];
          monthlyData[month].Refund += refund.amount || 0;
          totalRef += refund.amount || 0;
        }
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
    }
  };

  const calculatePercentage = async (month = selectedMonth) => {
    try {
      if (!Array.isArray(stores) || stores.length === 0) {
        setCompleteData(0);
        setInProgressData(0);
        return;
      }

      let storeMonth;
      try {
        storeMonth = await StoreByMonthApi(month);
      } catch (error) {
        console.error(`Error fetching data for month ${month}:`, error);

        // Fallback to the previous month if no data is available for the selected month
        const previousMonth = PreviousMonth(month);
        try {
          storeMonth = await StoreByMonthApi(previousMonth);
          setSelectedMonth(previousMonth);
        } catch (prevMonthError) {
          console.error(
            `Error fetching data for month ${previousMonth}:`,
            prevMonthError
          );
          setCompleteData(0);
          setInProgressData(0);
          return;
        }
      }

      console.log("storeMonth:", storeMonth);

      const storeData = storeMonth?.data?.data || [];

      let completedCount = 0;
      let inProgressCount = 0;

      storeData.forEach((store) => {
        switch (store.status.trim().toUpperCase()) {
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

      const totalCount = completedCount + inProgressCount;

      if (totalCount > 0) {
        const completePercentage = (
          (completedCount / totalCount) *
          100
        ).toFixed(2);
        const inProgressPercentage = (
          (inProgressCount / totalCount) *
          100
        ).toFixed(2);

        setCompleteCount(completedCount);
        setInProgressCount(inProgressCount);

        setCompleteData(parseFloat(completePercentage));
        setInProgressData(parseFloat(inProgressPercentage));
      } else {
        setCompleteData(0);
        setInProgressData(0);
      }
    } catch (error) {
      console.error("Error fetching order and refund data:", error);
    }
  };

  const data = [
    { value: inProgressData, label: "Processing", color: "#FFBB28" },
    { value: completeData, label: "Approved", color: "#00C49F" },
  ];

  const calculateTotalAccounts = (accounts) => {
    if (accounts && Array.isArray(accounts)) {
      const filteredAccounts = accounts.filter(
        (account) => account.role_id.id !== 3
      );

      const total = filteredAccounts.length;

      setTotalAccounts(total);
    } else {
      setTotalAccounts(0);
    }
  };

  const handleLineAccountData = async (year = selectedYearAccount) => {
    try {
      let accountRes;

      if (year) {
        accountRes = await userByYearApi(year);
      }

      // Fallback to the previous year if no data is available for the selected year
      if (!accountRes?.data?.data.length) {
        const previousYear = PreviousYear(year);
        accountRes = await userByYearApi(previousYear);
        setSelectedYearAccount(previousYear);
      }

      console.log("accountRes:", accountRes);

      const accountsData = accountRes?.data?.data || [];
      console.log("accountsData:", accountsData);

      const totalAccountsYear = accountsData.reduce((sum, account) => {
        if (account.role_id.id !== 3) {
          return sum + 1;
        }
        return sum;
      }, 0);
      setTotalAccountYear(totalAccountsYear);

      const monthlyData = Array(12).fill(0);

      accountsData.forEach((account) => {
        const accountDate = new Date(account.create_at);
        const month = accountDate.getMonth(); // 0-indexed, Jan is 0, Dec is 11
        if (account.role_id.id !== 3) {
          monthlyData[month]++;
        }
      });

      const lineChartAccountsData = monthlyData.map((Account, index) => ({
        month: index + 1,
        Account,
      }));

      console.log("lineChartAccountsData:", lineChartAccountsData);

      setAccountLineChartData(lineChartAccountsData);
    } catch (error) {
      console.error("Error handling Account line chart data:", error);
    }
  };
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const xAxisConfig = [
    {
      fontWeight: "bold",
      label: "Month",
      dataKey: "month",
      valueFormatter: (month) => monthNames[month - 1], // Convert month number to month name
      min: 1, // January
      max: 12, // December
    },
  ];

  const fetchMinMaxYears = async () => {
    try {
      const orderRes = await orderByYearApi();
      const ordersData = orderRes.data.data || [];
      const years = ordersData.map((order) =>
        new Date(order.order_date).getFullYear()
      );
      const min = Math.min(...years);
      setMinYear(min);
      setMaxYear(min + 15);
    } catch (error) {
      console.error("Error fetching min and max years:", error);
    }
  };

  const handleLineOrderData = async () => {
    try {
      const statusOrderRes = await allStatusOrderApi();

      console.log("statusOrderRes:", statusOrderRes);

      const statusOrders = statusOrderRes?.data?.data || [];

      const orderIdsWithCancelStatus = statusOrders
        .filter(
          (statusOrder) => statusOrder.status.toUpperCase() === "CANCELLED"
        )
        .map((statusOrder) => statusOrder.order_id);

      const orderIdsWithCompleteStatus = statusOrders
        .filter(
          (statusOrder) => statusOrder.status.toUpperCase() === "COMPLETED"
        )
        .map((statusOrder) => statusOrder.order_id);

      console.log("LineOrderIdsWithCancelStatus:", orderIdsWithCancelStatus);
      console.log(
        "LineOrderIdsWithCompleteStatus:",
        orderIdsWithCompleteStatus
      );

      const yearlyRevenue = orders.reduce((acc, order) => {
        if (
          order.type.toUpperCase() === "ORDER" &&
          !(
            order.payment_method.toUpperCase() === "COD" &&
            orderIdsWithCancelStatus.includes(order.id)
          )
        ) {
          if (orderIdsWithCompleteStatus.includes(order.id)) {
            const date = new Date(order.order_date);
            const year = date.getFullYear();
            acc[year] = (acc[year] || 0) + order.final_amount;
          }
        }
        return acc;
      }, {});

      const yearlyRefund = refunds.reduce((acc, refund) => {
        if (refund.status.toUpperCase() === "ACCEPT") {
          const date = new Date(refund.create_date);
          const year = date.getFullYear();
          acc[year] = (acc[year] || 0) + refund.amount;
        }
        return acc;
      }, {});

      const years = [
        ...new Set([
          ...Object.keys(yearlyRevenue),
          ...Object.keys(yearlyRefund),
        ]),
      ].sort();

      const LineChartReData = years.map((year) => ({
        year,
        label: year.toString(),
        Revenue: yearlyRevenue[year] || 0,
        Refund: yearlyRefund[year] || 0,
      }));

      console.log("LineChartReData:", LineChartReData);
      setReLineChartData(LineChartReData);
    } catch (error) {
      console.error("Error handling line chart data:", error);
    }
  };

  const valueFormatter = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(0)} Bil`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(0)} Mil`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    } else {
      return value;
    }
  };

  const FormatNumber = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)} Bil`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} Mil`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    } else {
      return value;
    }
  };

  const handleStorePieClick = () => {
    navigate("/admin/requeststore");
  };

  const handleAcountLineClick = () => {
    navigate("/admin/accounts");
  };

  const keyToLabelOrder = {
    Revenue: "Revenue (VND)",
    Refund: "Refund (VND)",
  };

  const keyToLabelAccount = {
    Account: "Account",
  };

  const colorsOrder = {
    Revenue: "#228B22",
    Refund: "rgb(2, 178, 175)",
  };

  const colorsAccount = {
    Account: "#008080",
  };

  const stackStrategyOrder = {
    stack: "total",
    area: true,
  };

  const stackStrategyAccount = {
    area: false,
  };

  const customizeOrder = {
    height: 400,
    legend: {
      hidden: false,
    },
  };

  const customizeAccount = {
    height: 400,
    legend: {
      hidden: false,
    },
    flexDirection: "column",
  };

  return (
    <Container id="dashboard">
      <Paper
        elevation={3}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#ff469e",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              color: "white",
              padding: "11px",
              fontWeight: "bold",
              fontSize: "20px",
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            Dashboard
          </Typography>
          <IconButton
            style={{
              color: "white",
              Size: "medium",
            }}
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
                handleExportCSV();
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
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4} md={3}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} md={12}>
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "242px" }}>
                    <Typography
                      variant="body1"
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: "bold",
                        color: "#E9967A",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                      }}
                    >
                      Total Revenue Year (VND)
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "30px",
                        paddingRight: "10px",
                        fontSize: "2.25rem",
                      }}
                    >
                      <ArrowDropUpIcon
                        fontSize="medium"
                        style={{ fontSize: "35px", color: "#228B22" }}
                      />
                      <span style={{ color: "#228B22" }}>
                        {FormatNumber(totalRevenue)}
                      </span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "243px" }}>
                    <Typography
                      variant="body1"
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: "bold",
                        color: "#E9967A",
                        marginBottom: "20px",
                        paddingBottom: "20px",
                      }}
                    >
                      Total Refund Year (VND)
                    </Typography>
                    <Typography
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "30px",
                        paddingRight: "10px",
                        fontSize: "2.25rem",
                      }}
                    >
                      <ArrowDropDownIcon
                        fontSize="medium"
                        style={{
                          fontSize: "35px",
                          color: "rgb(2, 178, 175)",
                          marginTop: "30px",
                        }}
                      />
                      <span style={{ color: "rgb(2, 178, 175)" }}>
                        {FormatNumber(totalRefund)}
                      </span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} md={9}>
            <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <CardContent
                style={{
                  height: "500px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h6"
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      color: "#ff469e",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                    }}
                  >
                    Overall Profit
                  </Typography>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: 90,
                    }}
                  >
                    <InputLabel
                      htmlFor="year-select"
                      shrink
                      style={{ fontWeight: "bold", color: "#E9967A" }}
                    >
                      Year
                    </InputLabel>
                    <Select
                      value={selectedYearOrder}
                      onChange={handleYearOrderChange}
                      label="Year"
                      inputProps={{
                        name: "Year",
                        id: "year-select",
                      }}
                      displayEmpty
                    >
                      {yearsListOrder.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <BarChart
                  dataset={BarChartData}
                  yAxis={[
                    {
                      fontWeight: "bold",
                      paddingBottom: "20px",
                      valueFormatter,
                    },
                  ]}
                  xAxis={[
                    { scaleType: "band", dataKey: "month", label: "Month" },
                  ]}
                  series={[
                    {
                      dataKey: "Revenue",
                      label: "Revenue (VND)",
                      FormatNumber: (value) => FormatNumber(value) + " VND",
                      color: "#228B22",
                    },
                    {
                      dataKey: "Refund",
                      label: "Refund (VND)",
                      FormatNumber: (value) => FormatNumber(value) + " VND",
                      color: "rgb(2, 178, 175)",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} md={9}>
            <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <CardContent style={{ height: "420px", display: "flex" }}>
                <Grid marginTop={"90px"}>
                  <Typography
                    sx={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      color: "#ff469e",
                      textAlign: "center",
                      paddingTop: "10px",
                      paddingLeft: "25px",
                      paddingBottom: "20px",
                      "&:hover": {
                        cursor: "pointer",
                        color: "#E9967A",
                      },
                    }}
                    variant="h6"
                    onClick={handleStorePieClick}
                  >
                    Monthly Stores Status {currentYear}
                  </Typography>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: 120,
                      marginTop: 10,
                      marginLeft: 74,
                    }}
                  >
                    <InputLabel
                      htmlFor="month-select"
                      shrink
                      style={{ fontWeight: "bold", color: "#E9967A" }}
                    >
                      Month
                    </InputLabel>
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
                          {new Date(currentYear, month - 1).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                            }
                          )}
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
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} md={3}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} md={12}>
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "202px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#FFBB28",
                        }}
                      >
                        Processing
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "40px",
                          fontSize: "40px",
                        }}
                      >
                        <span style={{ color: "#696969" }}>
                          {FormatNumber(inProgressCount)}
                        </span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "201px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#00C49F",
                        }}
                      >
                        Approved
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "40px",
                          fontSize: "40px",
                        }}
                      >
                        <span style={{ color: "#696969" }}>
                          {FormatNumber(completedCount)}
                        </span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} md={3}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12} md={12}>
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "243px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#E9967A",
                          marginBottom: "20px",
                          paddingBottom: "20px",
                        }}
                      >
                        Total Accounts Year
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "30px",
                          paddingRight: "10px",
                          fontSize: "40px",
                        }}
                      >
                        <span style={{ color: "#696969" }}>
                          {FormatNumber(totalAccountYear)}
                        </span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
                  <CardContent style={{ height: "242px" }}>
                    <Grid>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#E9967A",
                          marginBottom: "20px",
                          paddingBottom: "20px",
                        }}
                      >
                        Overall Total Accounts
                      </Typography>
                      <Typography
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "30px",
                          paddingRight: "10px",
                          fontSize: "40px",
                        }}
                      >
                        <span style={{ color: "#696969" }}>
                          {FormatNumber(totalAccounts)}
                        </span>
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} md={9}>
            <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <CardContent
                style={{
                  height: "500px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{
                      fontSize: "26px",
                      fontWeight: "bold",
                      color: "#ff469e",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                      "&:hover": {
                        cursor: "pointer",
                        color: "#E9967A",
                      },
                    }}
                    variant="h6"
                    onClick={handleAcountLineClick}
                  >
                    Yearly Account Analysis
                  </Typography>
                  <FormControl
                    variant="outlined"
                    style={{
                      width: 90,
                      position: "relative",
                    }}
                  >
                    <InputLabel
                      htmlFor="year-select"
                      shrink
                      style={{ fontWeight: "bold", color: "#E9967A" }}
                    >
                      Year
                    </InputLabel>
                    <Select
                      value={selectedYearAccount}
                      onChange={handleYearAccountChange}
                      label="Year"
                      inputProps={{
                        name: "Year",
                        id: "year-select",
                      }}
                      displayEmpty
                    >
                      {YearsListAccount.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <LineChart
                  xAxis={xAxisConfig}
                  yAxis={[{ valueFormatter: (value) => value.toString() }]}
                  series={Object.keys(keyToLabelAccount).map((key) => ({
                    dataKey: key,
                    label: keyToLabelAccount[key],
                    color: colorsAccount[key],
                    showMark: false,
                    FormatNumber,
                    ...stackStrategyAccount,
                  }))}
                  dataset={AccountLineChartData}
                  {...customizeAccount}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <CardContent
                style={{
                  height: "500px",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "50px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "25px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#ff469e",
                    marginTop: "10px",
                    marginRight: "20px",
                  }}
                >
                  Profit Each Year
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      fontWeight: "bold",
                      label: "Year",
                      dataKey: "year",
                      valueFormatter: (year) => year.toString(),
                      min: minYear,
                      max: maxYear,
                    },
                  ]}
                  yAxis={[{ valueFormatter }]}
                  series={Object.keys(keyToLabelOrder).map((key) => ({
                    dataKey: key,
                    label: keyToLabelOrder[key],
                    color: colorsOrder[key],
                    showMark: false,
                    FormatNumber,
                    ...stackStrategyOrder,
                  }))}
                  dataset={ReLineChartData}
                  {...customizeOrder}
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
