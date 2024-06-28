import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  NativeSelect,
  ListItem,
  ListItemText,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { allStoreByAdminApi, requestStoreApi } from "../../api/StoreAPI";

export default function StoreManagement() {
  window.document.title = "Store Management";
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStore, setSelectedStore] = useState(null);
  const [openUpdatestore, setOpenUpdateStore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const StoreRes = await allStoreByAdminApi();
      setStores(StoreRes?.data?.data?.stores || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setPage(0); // Reset to the first page when search changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openUpdate = (item) => {
    setOpenUpdateStore(true);
    setSelectedStore(item);
  };

  const closeUpdate = () => {
    setOpenUpdateStore(false);
  };

  const handleChange = (field, value) => {
    setSelectedStore((prevStore) => ({
      ...prevStore,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    if (!selectedStore) {
      console.error("No store selected for editing.");
      return;
    }

    const {
      id,
      name_store,
      address,
      description,
      phone,
      status,
      is_active,
      user_id,
    } = selectedStore;

    requestStoreApi(
      id,
      name_store,
      address,
      description,
      phone,
      status,
      is_active,
      user_id
    )
      .then((response) => {
        toast.success("Store updated successfully!");
        window.location.reload();
    })
      .catch((error) => {
        console.error("Error updating store:", error);
        toast.error("Failed to update store. Please try again later.");
      });
  };

  const filteredStore = stores.filter((item) =>
    item.name_store.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredStore.slice(indexOfFirstItem, indexOfLastItem);
  console.log(selectedStore);

  return (
    <div>
      <Container>
        <Paper
          elevation={4}
          sx={{
            position: "sticky",
            top: "80px",
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
            Store Manage
          </Typography>
          <Grid
            container
            spacing={3}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item xs={12} md={3}>
              <TextField
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Search By Name!"
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
                        <IconButton
                          onClick={() => setSearchKeyword("")}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          ) : (
            <>
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
                        Store Name
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        description
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Address
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Phone Number
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
                        <TableCell align="left">{item.name_store}</TableCell>
                        <TableCell align="left">{item.description}</TableCell>
                        <TableCell align="left">{item.address}</TableCell>
                        <TableCell align="left">{item.phone}</TableCell>

                        <TableCell align="left">
                          {item.is_active ? (
                            <CheckIcon style={{ color: "green" }} />
                          ) : (
                            <CloseIcon style={{ color: "red" }} />
                          )}
                        </TableCell>
                        <TableCell align="left">
                          <IconButton onClick={() => openUpdate(item)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStore.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: "1px solid #ddd",
                  justifyContent: "flex-end",
                  backgroundColor: "f1f1f1",
                }}
                labelRowsPerPage="Rows:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}/${to} of ${count}`
                }
              />
            </>
          )}
        </Paper>

        {/* Update Account Dialog */}
        {selectedStore && (
          <Dialog open={openUpdatestore} onClose={closeUpdate}>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={selectedStore.name_store || ""}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Choose Status
                </InputLabel>
                <NativeSelect
                  value={selectedStore.is_active} // Use value instead of defaultValue
                  onChange={(e) =>
                    handleChange("is_active", e.target.value === "true")
                  } // Convert string to boolean
                  inputProps={{
                    name: "is_active",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value={"true"}>Active</option>
                  <option value={"false"}>Inactive</option>
                </NativeSelect>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeUpdate} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEdit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </div>
  );
}
