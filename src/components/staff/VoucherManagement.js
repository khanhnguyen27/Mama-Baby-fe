import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
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
} from "@mui/material";
import {
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
} from "@mui/material";
import { getVoucherByStoreIdApi, updateVoucherApi, addVoucherApi } from "../../api/VoucherAPI";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { jwtDecode } from "jwt-decode";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";

export default function Vouchers() {
  window.document.title = "Vouchers";
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [openUpdateVoucher, setOpenUpdateVoucher] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [store, setStore] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;

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
      setVouchers(voucherRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  const openUpdate = (item) => {
    setOpenUpdateVoucher(true);
    setSelectedVoucher(item);
  };

  const closeUpdate = () => {
    setOpenUpdateVoucher(false);
    setSelectedVoucher(null);
  };

  const handleChange = (field, value) => {
    setSelectedVoucher((prevVoucher) => ({
      ...prevVoucher,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    if (!selectedVoucher) {
      toast.error("No voucher selected.");
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
      .then((response) => {
        toast.success("Voucher updated successfully!");
        // Reload the page to keep the current search keyword
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating voucher:", error);
        toast.error("Failed to update voucher. Please try again later.");
      });
  };

  const handleAddNew = () => {
    handleOpenAddVoucher();
  };

  const formatDate = (date) => {
    return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
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
  const [endAt, setEndAt] = useState('');
  const [isActive, setActive] = useState(true);

  const handleOpenAddVoucher = () => {
    setOpenAddVoucher(true);
  };

  const handleCloseAddVoucher = () => {
    setOpenAddVoucher(false);
  };

  const now = new Date();
  const endDate = new Date(endAt);

  const handleAddVoucher = () => {
    if (!code || !discountValue || !description || !endAt) {
      toast.warn("Please fill in all required fields.");
      return;
    } else if (endDate <= now) {
      toast.error("End date must be in the future.");
      return;
    }
    addVoucherApi(
      code,
      discountValue,
      description,
      endAt,
      storeId,
      isActive
    )
      .then((response) => {
        handleCloseAddVoucher();
        toast.success("Voucher added successfully!");
        // Fetch vouchers again to update the list
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding voucher:", error);
        toast.error("Failed to add voucher. Please try again later.");
      });
  };

  return (
    <div>
      <Container style={{ marginTop: "40px", backgroundColor: "#f5f7fd" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ padding: "16px", borderRadius: "10px" }}>
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
                Vouchers
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    placeholder="Search Vouchers By Code!"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton>
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {searchKeyword && (
                            <IconButton onClick={() => setSearchKeyword("")} size="small">
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} container justifyContent="flex-end">
                  <Tooltip title="Add New Voucher">
                    <Button
                      style={{ backgroundColor: "white", color: "black" }}
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddNew}
                    >
                      Add New Voucher
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
              {loading ? (
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </Grid>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>No.</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Code</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Discount Value</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Description</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>End Date</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Active</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">{item.code}</TableCell>
                        <TableCell align="left">{formatCurrency(item.discount_value)}</TableCell>
                        <TableCell align="left">{item.description}</TableCell>
                        <TableCell align="left">{formatDate(item.endAt)}</TableCell>
                        <TableCell align="left">
                          <Tooltip title={item.active ? "Active" : "Inactive"}>
                            {item.active ? (
                              <CheckIcon style={{ color: "green" }} />
                            ) : (
                              <CloseIcon style={{ color: "red" }} />
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Tooltip title="Edit Voucher">
                            <IconButton onClick={() => openUpdate(item)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredVoucher.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog for Update Voucher */}
      <Dialog open={openUpdateVoucher} onClose={closeUpdate}>
        <DialogTitle>Update Voucher</DialogTitle>
        <DialogContent>
          {selectedVoucher && (
            <>
              <TextField
                margin="dense"
                label="Voucher Code"
                fullWidth
                value={selectedVoucher.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Discount Value"
                fullWidth
                value={selectedVoucher.discount_value}
                onChange={(e) => handleChange("discount_value", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={selectedVoucher.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
              <TextField
                margin="dense"
                label="End Date"
                fullWidth
                type="date"
                value={selectedVoucher.endAt}
                onChange={(e) => handleChange("endAt", e.target.value)}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Active</InputLabel>
                <Select
                  value={selectedVoucher.active}
                  onChange={(e) => handleChange("active", e.target.value)}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdate}>Cancel</Button>
          <Button onClick={handleEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Add Voucher */}
      <Dialog open={openAddVoucher} onClose={handleCloseAddVoucher}>
        <DialogTitle>Add New Voucher</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Voucher Code"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Discount Value"
            fullWidth
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>End Day</label>
          <TextField
            margin="dense"
            fullWidth
            type="date"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Active</InputLabel>
            <Select
              value={isActive}
              onChange={(e) => setActive(e.target.value)}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddVoucher}>Cancel</Button>
          <Button onClick={handleAddVoucher}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
