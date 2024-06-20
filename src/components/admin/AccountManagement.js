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
import { allUserApi, updateAccountApi } from "../../api/UserAPI";

export default function AccountManagement() {
  window.document.title = "Account Management";
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [openUpdateAccount, setOpenUpdateAccount] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await allUserApi();
      setUsers(userRes?.data?.data || []);
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

  const handleInputChange = (event) => {
    setNewAccountName(event.target.value);
  };

  const openUpdate = (item) => {
    setOpenUpdateAccount(true);
    setSelectedAccount(item);
  };

  const closeUpdate = () => {
    setOpenUpdateAccount(false);
  };

  const handleChange = (field, value) => {
    setSelectedAccount((prevAccount) => ({
      ...prevAccount,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    if (!selectedAccount) {
      console.error("No account selected for editing.");
      return;
    }

    const { username, fullName, address, phoneNumber, status } =
      selectedAccount;

    // updateAccountApi(username, fullName, address, phoneNumber, status)
    //   .then((response) => {
    //     toast.success("Account updated successfully!");
    //     // Reload the page to keep the current search keyword
    //     window.location.reload();
    //   })
    //   .catch((error) => {
    //     console.error("Error updating account:", error);
    //     toast.error("Failed to update account. Please try again later.");
    //   });
  };

  const filteredAccounts = users.filter(
    (item) =>
      item.username.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      item.role_id.name !== "ADMIN" // Exclude accounts with role_id 'ADMIN'
  );
  

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredAccounts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  console.log(selectedAccount);

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
            Manage Accounts
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
                        User Name
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Full Name
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
                        Point
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Role of Users
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
                        <TableCell align="left">{item.username}</TableCell>
                        <TableCell align="left">{item.full_name}</TableCell>
                        <TableCell align="left">{item.address}</TableCell>
                        <TableCell align="left">{item.phone_number}</TableCell>
                        <TableCell align="left">
                          {item.accumulated_points}
                        </TableCell>
                        <TableCell align="left">
                          {item.role_id.name} {/* Display role name directly */}
                        </TableCell>

                        <TableCell align="left">
                          {item.isActive ? (
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
                count={filteredAccounts.length}
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

        {/* Add Account Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="accountName"
              label="Account Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newAccountName}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => setOpenAddDialog(false)} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Account Dialog */}
        {selectedAccount && (
          <Dialog open={openUpdateAccount} onClose={closeUpdate}>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={selectedAccount.username || ""}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Choose Status
                </InputLabel>
                <NativeSelect
                  defaultValue={selectedAccount.isActive}
                  inputProps={{
                    name: "age",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </NativeSelect>
              </FormControl>
              {/* <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="status-select">Status</InputLabel>
                <Select
                  value={selectedAccount.isActive || ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl> */}
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
