import React, { useState, useEffect } from "react";
import { KeyboardCapslock } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  Tabs,
  Container,
  Box,
  Tab,
  Typography,
  CircularProgress,
  Card,
  Grid,
  Divider,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { allPackageApi, updatePackageApi } from "../../api/PackagesAPI";
import { allStorePackageApi } from "../../api/StorePackageAPI";
import { allStoreByAdminApi } from "../../api/StoreAPI";

export default function PackageManagement() {
  window.document.title = "Package Management";
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openUpdatePackage, setOpenUpdatePackage] = useState(false);
  const [packages, setpackages] = useState([]);
  const [storePackages, setStorePackages] = useState([]);
  const [storeMap, setStoreMap] = useState();
  const [packagesPage, setPackagesPage] = useState("PACKAGES");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [monthsList, setMonthsList] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchMonths = async () => {
      const months = await fetchMonthsFromDatabase(storePackages);
      setMonthsList(months);

      if (months.length > 0 && !months.includes(selectedMonth)) {
        setSelectedMonth(months[0]);
      }
    };

    fetchMonths();
  }, [storePackages]);

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
    console.log("selectedMonth", selectedMonth);
  };

  const fetchMonthsFromDatabase = async (storePackageData) => {
    try {
      const monthsSet = new Set();

      storePackageData.forEach((storePackages) => {
        const date = new Date(storePackages.buy_date);
        const month = date.getMonth();
        monthsSet.add(month);
      });

      return Array.from(monthsSet).sort((a, b) => a - b);
    } catch (error) {
      console.error("Error fetching months:", error);
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const packageRes = await allPackageApi();
      const storePackagesRes = await allStorePackageApi();
      const storeRes = await allStoreByAdminApi();
      const packageData = packageRes.data.data || [];
      const storePackageData = storePackagesRes.data.data || [];
      const storeData = storeRes.data.data.stores || [];

      setpackages(packageData);
      setStorePackages(storePackageData);

      console.log("Package", packageData);
      console.log("storePackage", storePackageData);
      console.log("Store", storeData);

      const storeMap = storeData.reduce((x, item) => {
        x[item.id] = [
          item.address,
          item.description,
          item.phone,
          item.status,
          item.name_store,
          item.is_active,
          item.user_id,
          item.license_url,
        ];

        return x;
      }, {});
      console.log(storeData);

      setStoreMap(storeMap);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (e) => {
    setLoading(true);
    if (packagesPage != "PACKAGES") {
      setPackagesPage("PACKAGES");
    } else {
      setPackagesPage("COMPLETED");
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const openUpdate = (item) => {
    setOpenUpdatePackage(true);
    setSelectedPackage(item);
  };

  const closeUpdate = () => {
    setOpenUpdatePackage(false);
  };

  const handleChange = (field, value) => {
    setSelectedPackage((prevPackage) => ({
      ...prevPackage,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    const trimmedPackageName = selectedPackage.package_name.trim();
    const monthPackage = selectedPackage.month;

    if (
      packages.some(
        (packages) =>
          packages.package_name.toLowerCase() ===
          trimmedPackageName.toLowerCase() &&
          packages.id !== selectedPackage.id
      )
    ) {
      toast.error("Package name already exists.", { autoClose: 1500 });
      return;
    }

    if (!selectedPackage) {
      toast.warn("No package selected for editing.", { autoClose: 1500 });
      return;
    }

    if (selectedPackage.price <= 1000000) {
      toast.error("Price must be greater than 1,000,000 VND.", {
        autoClose: 1500,
      });
      return;
    }

    if (
      packages.some(
        (packages) =>
          packages.month == monthPackage && packages.id !== selectedPackage.id
      )
    ) {
      toast.error("A package with the same month already exists.", {
        autoClose: 1500,
      });
      return;
    }

    if (monthPackage == 0) {
      toast.error("Cannot be 0 month.", { autoClose: 1500 });
      return;
    }

    updatePackageApi(
      selectedPackage.id,
      trimmedPackageName,
      selectedPackage.price,
      monthPackage,
      selectedPackage.description
    )
      .then(() => {
        fetchData();
        closeUpdate();
        toast.success("Package updated successfully.", { autoClose: 1500 });
      })
      .catch((error) => {
        console.error("Error updating package:", error);
        toast.error("Failed to update package. Please try again later.", {
          autoClose: 1500,
        });
      });
  };

  const handlePageChange = (value) => {
    setPage(value - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const formatMonths = (months) => {
    return `${months} month${months > 1 ? "s" : ""}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const itemsPerPage = 5;

  const filteredPackages = storePackages.filter((item) => {
    const date = new Date(item.buy_date);
    return item.status === "PAID" && date.getMonth() === selectedMonth;
  });

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const paginatedPackages = filteredPackages.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const monthRevenue = filteredPackages.reduce((month, item) => {
    return month + item.price;
  }, 0);

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container sx={{ my: 4 }}>
        {packagesPage == "PACKAGES" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "60px",
              width: "100%",
            }}
          >
            <Tabs
              value={packagesPage}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                border: "1px solid #ff469e",
                backgroundColor: "white",
                borderRadius: "30px",
                opacity: 0.95,
              }}
            >
              <Tab
                label="PACKAGES"
                value="PACKAGES"
                sx={{
                  backgroundColor: packagesPage === "PACKAGES" ? "#ff469e" : "#fff4fc",
                  color: packagesPage === "PACKAGES" ? "white" : "#ff469e",
                  borderRadius: "20px",
                  minHeight: "30px",
                  minWidth: "100px",
                  m: 1,
                  fontWeight: "bold",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                  "&.Mui-selected": {
                    color: "white",
                  },
                }}
              />
              <Tab
                label="COMPLETED"
                value="COMPLETED"
                sx={{
                  backgroundColor:
                    packagesPage === "COMPLETED" ? "#ff469e" : "#fff4fc",
                  color: packagesPage === "COMPLETED" ? "white" : "#ff469e",
                  borderRadius: "20px",
                  minHeight: "30px",
                  minWidth: "100px",
                  m: 1,
                  fontWeight: "bold",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                  "&.Mui-selected": {
                    color: "white",
                  },
                }}
              />
            </Tabs>
          </Box>
        ) : packagesPage == "COMPLETED" && loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "60px",
              width: "100%",
            }}
          >
            <Tabs
              value={packagesPage}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                border: "1px solid #ff469e",
                backgroundColor: "white",
                borderRadius: "30px",
                opacity: 0.95,
              }}
            >
              <Tab
                label="PACKAGES"
                value="PACKAGES"
                sx={{
                  backgroundColor: packagesPage === "PACKAGES" ? "#ff469e" : "#fff4fc",
                  color: packagesPage === "PACKAGES" ? "white" : "#ff469e",
                  borderRadius: "20px",
                  minHeight: "30px",
                  minWidth: "100px",
                  m: 1,
                  fontWeight: "bold",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                  "&.Mui-selected": {
                    color: "white",
                  },
                }}
              />
              <Tab
                label="COMPLETED"
                value="COMPLETED"
                sx={{
                  backgroundColor:
                    packagesPage === "COMPLETED" ? "#ff469e" : "#fff4fc",
                  color: packagesPage === "COMPLETED" ? "white" : "#ff469e",
                  borderRadius: "20px",
                  minHeight: "30px",
                  minWidth: "100px",
                  m: 1,
                  fontWeight: "bold",
                  boxShadow: "none",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                  "&.Mui-selected": {
                    color: "white",
                  },
                }}
              />
            </Tabs>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "60px",
              width: "100%",
            }}
          >
            <Box>
              <Tabs
                value={packagesPage}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  border: "1px solid #ff469e",
                  backgroundColor: "white",
                  borderRadius: "30px",
                  opacity: 0.95,
                }}
              >
                <Tab
                  label="PACKAGES"
                  value="PACKAGES"
                  sx={{
                    backgroundColor:
                      packagesPage === "PACKAGES" ? "#ff469e" : "#fff4fc",
                    color: packagesPage === "PACKAGES" ? "white" : "#ff469e",
                    borderRadius: "20px",
                    minHeight: "30px",
                    minWidth: "100px",
                    m: 1,
                    fontWeight: "bold",
                    boxShadow: "none",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                    },
                    "&.Mui-selected": {
                      color: "white",
                    },
                  }}
                />
                <Tab
                  label="COMPLETED"
                  value="COMPLETED"
                  sx={{
                    backgroundColor:
                      packagesPage === "COMPLETED" ? "#ff469e" : "#fff4fc",
                    color: packagesPage === "COMPLETED" ? "white" : "#ff469e",
                    borderRadius: "20px",
                    minHeight: "30px",
                    minWidth: "100px",
                    m: 1,
                    fontWeight: "bold",
                    boxShadow: "none",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                    },
                    "&.Mui-selected": {
                      color: "white",
                    },
                  }}
                />
              </Tabs>
            </Box>
            <Box sx={{ display: "flex" }}>
              <FormControl
                sx={{
                  width: "170px",
                  border: "1px solid #ff469e",
                  borderRadius: "10px",
                  mr: 3,
                  backgroundColor: "white",
                  transition: "0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#ff469e",
                  },
                  "&:focus": {
                    backgroundColor: "#F8F8F8",
                  },
                  "&.Mui-focused": {
                    border: "1px solid #ff469e",
                    backgroundColor: "#F8F8F8",
                    boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.32)",
                    outline: "none",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiInputLabel-root": {
                    top: "-7px",
                  },
                }}
                size="medium"
              >
                <InputLabel
                  htmlFor="month-select"
                  shrink
                  style={{
                    fontWeight: "bold",
                    color: "#ff469e",
                    fontSize: "1.1rem",
                  }}
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
                  MenuProps={{
                    PaperProps: {
                      style: {
                        marginTop: '3px',
                      },
                    },
                  }}
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    },
                  }}
                >
                  {monthsList.map((month) => (
                    <MenuItem key={month} value={month}>
                      {new Date(currentYear, month).toLocaleString("en-US", {
                        month: "long",
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Card
                sx={{
                  border: "1px solid #ff469e",
                  backgroundColor: "white",
                  borderRadius: "30px",
                  opacity: 0.95,
                  width: "200px",
                  mb: "1px",
                  padding: "6px",
                  borderRadius: "10px",
                  boxShadow: "none"
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "17px",
                    marginBottom: "2px",
                    textAlign: "center",
                    color: "#ff469e",
                  }}
                >
                  Monthly Revenue
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "2px",
                    textAlign: "center",
                  }}
                >
                  {formatCurrency(monthRevenue)}
                </Typography>
              </Card>
            </Box>
          </Box>
        )}
        <Box sx={{ marginTop: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                maxWidth: "100vw",
                backgroundColor: "#f5f7fd",
              }}
            >
              <CircularProgress sx={{ color: "#ff469e" }} size={70} />
            </Box>
          ) : packages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  fontSize: "1.75rem",
                  textAlign: "center",
                }}
              >
                There's no packages in this tab
              </Typography>
            </Box>
          ) : packagesPage == "PACKAGES" ? (
            <Grid container spacing={2} direction="row">
              {packages.map((item) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={item.id}
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Card
                    sx={{
                      flexGrow: 1,
                      mb: "16px",
                      padding: "16px",
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: 4,
                      transition: "0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.02)",
                        border: "1px solid #ff469e",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ mb: "10px", fontWeight: "bold" }}
                    >
                      Package No. {item.id}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "5px",
                        mt: 2,
                        fontWeight: "small",
                        fontSize: "1.1rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Package Detail:
                      </span>
                      <Divider
                        sx={{
                          width: "90%",
                          my: 1,
                          borderColor: "rgba(0, 0, 0, 0.4)",
                          borderWidth: "1px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "90%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Package Name: </span>
                          <span style={{ fontWeight: "600" }}>
                            {item.package_name}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "90%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Price: </span>
                          <span style={{ fontWeight: "600" }}>
                            {formatCurrency(item.price)}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "90%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Month: </span>
                          <span style={{ fontWeight: "600" }}>
                            {formatMonths(item.month)}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "90%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Description:</span>
                          <span style={{ fontWeight: "600" }}>
                            {item.description}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
                    <Grid item xs={12} sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "10px",
                          fontSize: 14,
                          fontWeight: "bold",
                          my: 2,
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
                        onClick={() => openUpdate(item)}
                      >
                        Update
                      </Button>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : paginatedPackages.length == 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  fontSize: "1.75rem",
                  textAlign: "center",
                }}
              >
                There's no store packages in this tab
              </Typography>
            </Box>
          ) : (
            paginatedPackages.map((item) => (
              <Card
                sx={{
                  mb: "16px",
                  padding: "16px",
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <Typography
                      variant="h5"
                      sx={{ mb: "10px", fontWeight: "bold" }}
                    >
                      Store Package No. {item.id}{" "}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "5px",
                        mt: 1,
                        fontWeight: "small",
                        fontSize: "1.1rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Store Package Detail:
                      </span>{" "}
                      <Divider
                        sx={{
                          width: "70%",
                          my: 1,
                          borderColor: "rgba(0, 0, 0, 0.4)",
                          borderWidth: "1px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Package: </span>
                          <span style={{ fontWeight: "600" }}>
                            {item.package_id}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Price:</span>
                          <span style={{ fontWeight: "600" }}>
                            {formatCurrency(item.price)}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Buy Date:</span>
                          <span style={{ fontWeight: "600" }}>
                            {item.buy_date}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography
                      sx={{
                        mb: "5px",
                        mt: 2,
                        fontWeight: "small",
                        fontSize: "1.1rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Store Detail:
                      </span>{" "}
                      <Divider
                        sx={{
                          width: "70%",
                          my: 1,
                          borderColor: "rgba(0, 0, 0, 0.4)",
                          borderWidth: "1px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Store Name:</span>
                          <span style={{ fontWeight: "600" }}>
                            {storeMap[item.store_id][4]}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                            gap: "1rem",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Phone:</span>
                          <span style={{ fontWeight: "600" }}>
                            {storeMap[item.store_id][2]}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            ))
          )}
          {loading ? null : packagesPage == "PACKAGES" ? null : paginatedPackages.length !=
            0 ? (
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(event, value) => handlePageChange(value)}
              showFirstButton={totalPages > 1}
              showLastButton={totalPages > 1}
              hidePrevButton={page === 0}
              hideNextButton={page === totalPages - 1}
              size="large"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2.5rem",
                width: "100%",
                p: 1,
                opacity: 0.9,
                borderRadius: "20px",
                "& .MuiPaginationItem-root": {
                  backgroundColor: "white",
                  borderRadius: "20px",
                  border: "1px solid black",
                  boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.16, 0.5)",
                  mx: 1,
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    border: "1px solid #ff469e",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#ff469e",
                    color: "white",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      border: "1px solid #ff469e",
                    },
                  },
                  fontSize: "1.25rem",
                },
                "& .MuiPaginationItem-ellipsis": {
                  mt: 1.25,
                  fontSize: "1.25rem",
                },
              }}
              componentsProps={{
                previous: {
                  sx: {
                    fontSize: "1.5rem",
                    "&:hover": {
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      transition:
                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                    },
                  },
                },
                next: {
                  sx: {
                    fontSize: "1.5rem",
                    "&:hover": {
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      transition:
                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                    },
                  },
                },
              }}
            />
          ) : null}
        </Box>
        {selectedPackage && (
          <Dialog
            open={openUpdatePackage}
            onClose={closeUpdate}
            PaperProps={{
              style: {
                borderRadius: 7,
                boxShadow: "0px 2px 8px #ff469e",
              },
            }}
          >
            <DialogTitle
              style={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              Edit Package
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Package Name"
                value={selectedPackage.package_name}
                type="text"
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("package_name", e.target.value)}
              />
              <TextField
                label="Package Price"
                value={selectedPackage.price}
                type="number"
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("price", e.target.value)}
              />
              <TextField
                label="Package Month"
                value={selectedPackage.month}
                type="number"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: "#fffcfa",
                  },
                }}
                onChange={(e) => handleChange("month", e.target.value)}
              />
              <TextField
                label="Package Description"
                value={selectedPackage.description}
                type="text"
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={closeUpdate}
                sx={{
                  backgroundColor: "#F0F8FF",
                  color: "#757575",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  transition:
                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                  border: "1px solid #757575",
                  "&:hover": {
                    backgroundColor: "#757575",
                    color: "white",
                    border: "1px solid white",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                sx={{
                  backgroundColor: "#F0F8FF",
                  color: "#ff469e",
                  borderRadius: "30px",
                  fontWeight: "bold",
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
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}

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
