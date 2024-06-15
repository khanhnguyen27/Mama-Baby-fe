import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
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
import { allBrandApi, addBrandApi, updateBrandApi } from "../../api/BrandAPI"; // Updated API imports

export default function BrandManagement() {
  window.document.title = "Brand Management";
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBrand, setSelectedBrand] = useState(null); // Changed to singular "selectedBrand"
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [openUpdateBrand, setOpenUpdateBrand] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const brandRes = await allBrandApi();
      setBrands(brandRes.data.data || []);
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
    setNewBrandName(""); // Clear input field
  };

  const handleInputChange = (event) => {
    setNewBrandName(event.target.value);
  };

  const handleAddBrand = async () => {
    const trimmedBrandName = newBrandName.trim();
    if (brands.some(brand => brand.name.toLowerCase() === trimmedBrandName.toLowerCase())) {
      toast.error('Brand name already exists');
      return;
    }

    try {
      const newBrand = { name: trimmedBrandName }; // Adjust fields as per your API requirements
      await addBrandApi(newBrand); // Replace with your API call to add brand
      fetchData(); // Refresh brand list
      handleCloseAddDialog();
      toast.success("Brand added successfully!");
    } catch (error) {
      toast.error("Failed to add brand. Please try again later.");
      // Handle error
    }
  };

  const openUpdate = (item) => {
    setOpenUpdateBrand(true);
    setSelectedBrand(item); // Changed to singular "selectedBrand"
  };

  const closeUpdate = () => {
    setOpenUpdateBrand(false);
  };

  const handleChange = (field, value) => {
    setSelectedBrand((prevBrand) => ({
      ...prevBrand,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    const trimmedBrandName = selectedBrand.name.trim();

    if (brands.some(brand => brand.name.toLowerCase() === trimmedBrandName.toLowerCase())) {
      toast.error('Brand name already exists');
      return;
    }

    if (!selectedBrand) {
      console.error("No brand selected for editing.");
      return;
    }

    updateBrandApi(
      selectedBrand.id,
      trimmedBrandName,
      selectedBrand.active,
    )
      .then((response) => {
        toast.success("Brand updated successfully!");
        // Reload the page to keep the current search keyword
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating brand:", error);
        toast.error("Failed to update brand. Please try again later.");
      });
  };

  const filteredBrands = brands.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Container>
        <Paper elevation={4} sx={{ position: "sticky", top: "80px", padding: "16px", border: "1px solid #ff469e", borderRadius: "10px", backgroundColor: "white" }}>
          <Typography sx={{ padding: "8px", background: "#ff469e", color: "white", fontWeight: "bold", fontSize: "18px", borderRadius: "4px", textAlign: "center", marginBottom: "16px" }}>
            Manage Brands
          </Typography>
          <Grid container spacing={3} alignItems="center" sx={{ marginBottom: "16px" }}>
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
                Add New Brand
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
                      <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Brand Name</TableCell>
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
                        <TableCell align="left">{item.name}</TableCell>
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
                count={filteredBrands.length}
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

        {/* Add Brand Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Brand Name"
              type="text"
              fullWidth
              value={newBrandName}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddBrand} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Brand Dialog */}
        {selectedBrand && (
          <Dialog open={openUpdateBrand} onClose={closeUpdate}>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={selectedBrand.name}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="active-select">Active</InputLabel>
                <Select
                  value={selectedBrand.active}
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