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
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { allAgeApi, addAgeApi, updateAgeApi } from "../../api/AgeAPI";

export default function AgeManagement() {
  window.document.title = "AgeManagement";
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [ages, setAges] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAges, setSelectedAges] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAgeName, setNewAgeName] = useState("");
  const [openUpdateAge, setOpenUpdateAge] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ageRes = await allAgeApi();
      setAges(ageRes.data.data || []);
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

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewAgeName(""); // Clear input field
  };

  const handleInputChange = (event) => {
    setNewAgeName(event.target.value);
  };

  const handleAddAge = async () => {
    try {
      const newAge = { range_age: newAgeName }; // Adjust fields as per your API requirements
      await addAgeApi(newAge); // Replace with your API call to add category
      fetchData(); // Refresh category list
      handleCloseAddDialog();
      toast.success("RangeAge added successfully!");
    } catch (error) {
      toast.error("Failed to added rangeAge. Please try again later.");
      // Handle error
    }
  };

  const openUpdate = (item) => {
    setOpenUpdateAge(true);
    setSelectedAges(item);
  };

  const closeUpdate = () => {
    setOpenUpdateAge(false);
  };

  const handleChange = (field, value) => {
    setSelectedAges((prevAge) => ({
      ...prevAge,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    if (!selectedAges) {
      console.error("No rangeAge selected for editing.");
      return;
    }

    updateAgeApi(
      selectedAges.id,
      selectedAges.rangeAge,
      selectedAges.active,
    )
      .then((response) => {
        toast.success("RangeAge updated successfully!");
        // Reload the page to keep the current search keyword
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating rangeAge:", error);
        toast.error("Failed to update rangeAge. Please try again later.");
      });
  };

  const filteredAges = ages.filter((item) =>
    item.rangeAge.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredAges.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Container >
        <Paper elevation={4} sx={{ position: "sticky", top: "80px", padding: "16px", border: "1px solid #ff469e", borderRadius: "10px", backgroundColor: "white" }}>
          <Typography sx={{ padding: "8px", background: "#ff469e", color: "white", fontWeight: "bold", fontSize: "18px", borderRadius: "4px", textAlign: "center", marginBottom: "16px" }}>
            Manager Ages
          </Typography>
          <Grid container spacing={3} alignItems="center" sx={{ marginBottom: "16px" }}>
            <Grid item xs={12} md={3}>
              <TextField
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Search By RangeAge!"
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
            <Grid item xs={12} md={9} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handleOpenAddDialog}
                startIcon={<AddIcon />}
                style={{ backgroundColor: "white", color: "black" }}
              >
                Add New Range Age
              </Button>
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
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>No</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Range Age</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Active</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((item, index) => (
                      <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1', cursor: 'pointer' } }}>
                        <TableCell component="th" scope="row">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell align="left">{item.rangeAge}</TableCell>
                        <TableCell align="left">{item.active ? (
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
                count={filteredAges.length}
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
                labelDisplayedRows={({ from, to, count }) => `${from}/${to} of ${count}`}
              />
            </>
          )}
        </Paper>

        {/* Add Age Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Range Age</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Range Age"
              type="text"
              fullWidth
              value={newAgeName}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddAge} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Age Dialog */}
        {selectedAges && (
          <Dialog open={openUpdateAge} onClose={closeUpdate}>
            <DialogTitle>Edit Age</DialogTitle>
            <DialogContent>
              <TextField
                label="RangeAge"
                value={selectedAges.rangeAge}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("rangeAge", e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="active-select">Active</InputLabel>
                <Select
                  value={selectedAges.active}
                  onChange={(e) => handleChange("active", e.target.value)}
                  label="Active"
                  inputProps={{
                    name: "active",
                    id: "active-select",
                  }}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
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
      </Container>
    </div>
  );
}