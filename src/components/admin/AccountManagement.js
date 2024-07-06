import React, { useState, useEffect } from "react";
import { KeyboardCapslock } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
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
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import 'react-toastify/dist/ReactToastify.css';
import { allUserApi, updateAccountApi } from "../../api/UserAPI";

export default function AccountManagement() {
  window.document.title = "Account Management";
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openUpdateAccount, setOpenUpdateAccount] = useState(false);
  const [sortingStatus, setSortingStatus] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await allUserApi();
      let sortedUsers = userRes?.data?.data || [];
      if (sortingStatus === "active") {
        sortedUsers = sortedUsers.filter((user) => user.isActive);
      } else if (sortingStatus === "inactive") {
        sortedUsers = sortedUsers.filter((user) => !user.isActive);
      }

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortingStatus]);

  const handleSortingStatus = (event) => {
    setSortingStatus(event.target.value);
    setPage(0);
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
  console.log(selectedAccount);

  const handleEdit = () => {

    if (!selectedAccount) {
      console.error("No account selected for editing.");
      return;
    }

    const { username, full_name, address, phone_number, isActive } =
      selectedAccount;

    updateAccountApi(
      username,
      full_name,
      address,
      phone_number,
      isActive,
      selectedAccount.role_id.id
    )
      .then(() => {
        fetchData();
        closeUpdate();
        toast.success("Account updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating account:", error);
        toast.error("Failed to update account. Please try again later.");
      });
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

  return (
    <div>
      <Container>
        <Paper elevation={3}
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
              padding: "13px",
              background: "#ff469e",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              borderRadius: "4px",
              textAlign: "center",
              marginBottom: "16px"
            }}>
            Accounts Management
          </Typography>
          <Grid
            container spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item xs={4} md={4}>
              <TextField
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Search By User Name"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  style: { padding: "8px" },
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
            <Grid item xs={4} md={3}>
              <FormControl sx={{ width: "170px" }}>
                <InputLabel htmlFor="sorting-status-select" id="sorting-status-label">
                  Sorting Status
                </InputLabel>
                <Select
                  labelId="sorting-status-label"
                  id="sorting-status-select"
                  size="medium"
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
                  justifyContent: "flex-end",
                  backgroundColor: "f1f1f1",
                  marginRight: "40px"
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
        {selectedAccount && (
          <Dialog open={openUpdateAccount} onClose={closeUpdate}>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogContent>
              <TextField
                label="User Name"
                value={selectedAccount.username || ""}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("name", e.target.value)}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="active-select">Status</InputLabel>
                <Select
                  value={selectedAccount.isActive}
                  onChange={(e) => handleChange("isActive", e.target.value)}
                  label="Status"
                  inputProps={{
                    name: "isActive",
                    id: "active-select",
                  }}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
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
