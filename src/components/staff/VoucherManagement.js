import React, { useState, useEffect } from "react";
import { KeyboardCapslock } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  InputAdornment,
  TableContainer,
} from "@mui/material";
import { storeByUserIdApi } from "../../api/StoreAPI";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  getVoucherByStoreIdApi,
  updateVoucherApi,
  addVoucherApi,
} from "../../api/VoucherAPI";

export default function Vouchers() {
  window.document.title = "Vouchers";
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [openUpdateVoucher, setOpenUpdateVoucher] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [store, setStore] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingStatus, setSortingStatus] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;

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
        setLoading(true);
        const res = await storeByUserIdApi(userId);

        setStore(res?.data?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchStoreData();
  }, [userId]);

  const storeId = store?.id;

  useEffect(() => {
    const savedSearchKeyword = localStorage.getItem("searchKeyword");
    if (savedSearchKeyword) {
      setSearchKeyword(savedSearchKeyword);
    }
  }, []);

  const fetchData = async () => {
    if (!storeId) {
      console.error("Store ID is undefined");
      return;
    }
    setLoading(true);
    try {
      const voucherRes = await getVoucherByStoreIdApi(storeId);

      let sortedVouchers = voucherRes.data.data || [];

      // Sorting logic based on sortingStatus state
      if (sortingStatus === "active") {
        sortedVouchers = sortedVouchers.filter((voucher) => voucher.active);
      } else if (sortingStatus === "inactive") {
        sortedVouchers = sortedVouchers.filter((voucher) => !voucher.active);
      }

      setVouchers(sortedVouchers);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchData();
    }
  }, [storeId, sortingStatus]);

  const openUpdate = (item) => {
    setOpenUpdateVoucher(true);
    setSelectedVoucher(item);
  };

  const closeUpdate = () => {
    setOpenUpdateVoucher(false);
    setSelectedVoucher(null);
  };

  const handleSortingStatus = (event) => {
    setSortingStatus(event.target.value);
    setPage(0);
  };

  const handleChange = (field, value) => {
    setSelectedVoucher((prevVoucher) => ({
      ...prevVoucher,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    const trimmedVoucherCode = selectedVoucher.code.trim();

    if (
      vouchers.some(
        (voucher) =>
          voucher.code.toLowerCase() === trimmedVoucherCode.toLowerCase() &&
          voucher.id !== selectedVoucher.id
      )
    ) {
      toast.error("Voucher code already exists.", { autoClose: 1500 });
      return;
    }

    if (!selectedVoucher) {
      toast.error("No voucher selected.", { autoClose: 1500 });
      return;
    }

    updateVoucherApi(
      selectedVoucher.id,
      selectedVoucher.code,
      selectedVoucher.discount_value,
      selectedVoucher.description,
      selectedVoucher.endAt,
      selectedVoucher.active
    )
      .then(() => {
        fetchData();
        closeUpdate();
        toast.success("Voucher updated successfully.", { autoClose: 1500 });
      })
      .catch((error) => {
        console.error("Error updating voucher:", error);
        toast.error("Failed to update voucher. Please try again later.", { autoClose: 1500 });
      });
  };

  const handleAddNew = () => {
    handleOpenAddVoucher();
  };

  const formatDate = (date) => {
    return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchKeyword(value);
    setPage(0); // Reset to the first page when search changes
  };

  const filteredVoucher = vouchers.filter((item) =>
    item.code.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredVoucher.slice(indexOfFirstItem, indexOfLastItem);

  // Add voucher
  const [openAddVoucher, setOpenAddVoucher] = useState(false);
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [description, setDescription] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isActive, setActive] = useState(true);

  const handleOpenAddVoucher = () => {
    setOpenAddVoucher(true);
  };

  const handleCloseAddVoucher = () => {
    setOpenAddVoucher(false);
    setCode("");
    setDiscountValue("");
    setDescription("");
    setEndAt("");
    setActive(true);
  };

  const now = new Date();
  const endDate = new Date(endAt);

  const handleAddVoucher = () => {
    const trimmedVoucherCode = code.trim();
    if (
      vouchers.some(
        (voucher) =>
          voucher.code.toLowerCase() === trimmedVoucherCode.toLowerCase()
      )
    ) {
      toast.error("Voucher code already exists.", { autoClose: 1500 });
      return;
    }

    if (!code || !discountValue || !description || !endAt) {
      toast.warn("Please fill in all required fields.", { autoClose: 1500 });
      return;
    } else if (endDate <= now) {
      toast.error("End date must be in the future.", { autoClose: 1500 });
      return;
    }
    addVoucherApi(code, discountValue, description, endAt, storeId, isActive)
      .then(() => {
        fetchData();
        handleCloseAddVoucher();
        toast.success("Voucher added successfully.", { autoClose: 1500 });
        setPage(0);
      })
      .catch((error) => {
        console.error("Error adding voucher:", error);
        toast.error("Failed to add voucher. Please try again later.", { autoClose: 1500 });
      });
  };

  return (
    <div>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
                Vouchers Management
              </Typography>
              {loading ? (
                <div style={{ textAlign: "center" }}>
                  <CircularProgress
                    sx={{ color: "#ff469e" }}
                    size={50}
                  />
                </div>
              ) : (
                <>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ marginBottom: "16px" }}
                  >
                    <Grid item xs={3} md={4}>
                      <TextField
                        sx={{
                          border: "2px solid #ff469e",
                          borderRadius: "7px",
                          backgroundColor: "white",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            border: "2px solid #ff469e",
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
                        }}
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        placeholder="Search By Voucher Code"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton>
                                <SearchIcon fontSize="small" style={{ color: "FF1493" }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {searchKeyword && (
                                <IconButton
                                  onClick={() => setSearchKeyword("")}
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" style={{ color: "DC143C" }} />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={3} md={3}>
                      <FormControl
                        sx={{
                          width: '170px',
                          border: '2px solid #ff469e',
                          borderRadius: '7px',
                          backgroundColor: 'white',
                          transition: '0.2s ease-in-out',
                          '&:hover': {
                            borderColor: '#ff469e',
                          },
                          '&:focus': {
                            backgroundColor: '#F8F8F8',
                          },
                          '&.Mui-focused': {
                            border: '2px solid #ff469e',
                            backgroundColor: '#F8F8F8',
                            boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.32)',
                            outline: 'none',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '& .MuiInputLabel-root': {
                            top: '-1px',
                            backgroundColor: 'white',
                          },
                        }}
                        size="small"
                      >
                        <InputLabel
                          htmlFor="sorting-status-select"
                          id="sorting-status-label"
                        >
                          Sorting Status
                        </InputLabel>
                        <Select
                          labelId="sorting-status-label"
                          id="sorting-status-select"
                          value={sortingStatus}
                          onChange={handleSortingStatus}
                          label="Sorting Status"
                        >
                          <MenuItem value="">Sort by Default</MenuItem>
                          <MenuItem value="active">Sort by Active</MenuItem>
                          <MenuItem value="inactive">Sort by Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={1} md={2}></Grid>
                    <Grid item xs={5} md={3} container justifyContent="flex-end">
                      <Tooltip title="Add New Voucher">
                        <Button
                          style={{
                            color: "#4d4d4d",
                            border: "2px solid #ff469e",
                            borderRadius: "7px",
                            backgroundColor: "white",
                            transition: "0.2s ease-in-out",
                            "&:hover": {
                              border: "2px solid #ff469e",
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
                          }}
                          variant="contained"
                          startIcon={<AddIcon style={{ color: "	FF1493" }} />}
                          onClick={handleAddNew}
                          disabled={!store?.is_active}
                        >
                          Add New Voucher
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            No
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            Code
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            Discount Value
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            Description
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            End Date
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItems.map((item, index) => (
                          <TableRow
                            key={item.id}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#f1f1f1",
                                cursor: "pointer",
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {indexOfFirstItem + index + 1}
                            </TableCell>
                            <TableCell align="left">{item.code}</TableCell>
                            <TableCell align="left">
                              {formatCurrency(item.discount_value)}
                            </TableCell>
                            <TableCell align="left">{item.description}</TableCell>
                            <TableCell align="left">
                              {formatDate(item.endAt)}
                            </TableCell>
                            <TableCell align="left">
                              <Tooltip
                                title={item.active ? "Active" : "Inactive"}
                              >
                                {item.active ? (
                                  <CheckIcon style={{ color: "green" }} />
                                ) : (
                                  <CloseIcon style={{ color: "red" }} />
                                )}
                              </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                              <Tooltip title="Edit Voucher">
                                <IconButton
                                  disabled={!store?.is_active}
                                  onClick={() => openUpdate(item)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredVoucher.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      justifyContent: "center",
                      backgroundColor: "f1f1f1",
                      marginTop: "8px",
                      marginRight: "40px"
                    }}
                    labelRowsPerPage="Rows:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}/${to} of ${count}`
                    }
                  />
                </>)}
            </Paper>
          </Grid>
        </Grid>
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

      {/* Dialog for Update Voucher */}
      <Dialog open={openUpdateVoucher} onClose={closeUpdate}>
        <DialogTitle>Edit Voucher</DialogTitle>
        <DialogContent>
          {selectedVoucher && (
            <>
              <TextField
                margin="normal"
                label="Voucher Code"
                type="text"
                fullWidth
                value={selectedVoucher.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />
              <TextField
                margin="normal"
                label="Discount Value"
                type="number"
                fullWidth
                value={selectedVoucher.discount_value}
                onChange={(e) => handleChange("discount_value", e.target.value)}
              />
              <TextField
                margin="normal"
                label="Description"
                type="text"
                fullWidth
                value={selectedVoucher.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <TextField
                margin="normal"
                label="End Date"
                type="date"
                fullWidth
                value={selectedVoucher.endAt}
                onChange={(e) => handleChange("endAt", e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="active-select">Status</InputLabel>
                <Select
                  value={selectedVoucher.active}
                  onChange={(e) => handleChange("active", e.target.value)}
                  label="Status"
                  inputProps={{
                    name: "active",
                    id: "active-select",
                  }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdate} sx={{
            backgroundColor: "white",
            color: "#757575",
            borderRadius: "7px",
            transition:
              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
            border: "1px solid #757575",
            "&:hover": {
              backgroundColor: "#757575",
              color: "white",
              border: "1px solid white",
            },
          }}>
            Cancel
          </Button>
          <Button onClick={handleEdit} sx={{
            backgroundColor: "white",
            color: "#ff469e",
            borderRadius: "7px",
            transition:
              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
            border: "1px solid #ff469e",
            "&:hover": {
              backgroundColor: "#ff469e",
              color: "white",
              border: "1px solid white",
            },
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Add Voucher */}
      <Dialog open={openAddVoucher} onClose={handleCloseAddVoucher}>
        <DialogTitle>Add New Voucher</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Voucher Code"
            type="text"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Discount Value"
            type="number"
            fullWidth
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            marginTop="15px"
            label="End Date"
            fullWidth
            type="date"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="active-select">Status</InputLabel>
            <Select
              value={isActive}
              onChange={(e) => setActive(e.target.value)}
              label="Status"
              inputProps={{
                id: "active-select",
              }}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVoucher}
            sx={{
              backgroundColor: "white",
              color: "#757575",
              borderRadius: "7px",
              transition:
                "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
              border: "1px solid #757575",
              "&:hover": {
                backgroundColor: "#757575",
                color: "white",
                border: "1px solid white",
              },
            }}>
            Cancel
          </Button>
          <Button onClick={handleAddVoucher} sx={{
            backgroundColor: "white",
            color: "#ff469e",
            borderRadius: "7px",
            transition:
              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
            border: "1px solid #ff469e",
            "&:hover": {
              backgroundColor: "#ff469e",
              color: "white",
              border: "1px solid white",
            },
          }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}
