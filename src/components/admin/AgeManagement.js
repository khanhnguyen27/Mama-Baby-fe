import React, { useState, useEffect } from "react";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";
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
import { allAgeAdminApi, addAgeApi, updateAgeApi } from "../../api/AgeAPI";

export default function AgeManagement() {
  window.document.title = "AgeManagement";
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
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
      const ageRes = await allAgeAdminApi();
      setAges(ageRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    const trimmedRangeAge = newAgeName.trim();
    if (ages.some((age) => age.rangeAge.toLowerCase() === trimmedRangeAge.toLowerCase())) {
      toast.error("RangeAge already exists");
      return;
    }
    try {
      const newAge = { range_age: trimmedRangeAge };
      await addAgeApi(newAge);
      fetchData();
      handleCloseAddDialog();
      toast.success("RangeAge added successfully!");
      setPage(0);
    } catch (error) {
      toast.error("Failed to add RangeAge. Please try again later.");
      console.error("Error adding RangeAge:", error);
    }
  };

  const openUpdate = (item) => {
    setSelectedAges({
      ...item,
      originalName: item.rangeAge, // Save the original name
    });
    setOpenUpdateAge(true);
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

  const handleEdit = async () => {
    const trimmedRangeAge = selectedAges.rangeAge.trim();
    const { id, originalName } = selectedAges;

    // Check if the name has changed
    const nameChanged = originalName.toLowerCase() !== trimmedRangeAge.toLowerCase();

    // Check if the trimmed age range name already exists (only if the name has changed)
    if (nameChanged && ages.some((age) => age.rangeAge.toLowerCase() === trimmedRangeAge.toLowerCase() && age.id !== id)) {
      toast.error("RangeAge name already exists");
      return;
    }

    try {
      await updateAgeApi(id, trimmedRangeAge, selectedAges.active);
      toast.success("RangeAge updated successfully!");
      fetchData(); // Refresh data after update
      setOpenUpdateAge(false); // Close update dialog
    } catch (error) {
      console.error("Error updating RangeAge:", error);
      toast.error("Failed to update RangeAge. Please try again later.");
    }
  };

  const filteredAges = ages.filter((item) =>
    item.rangeAge.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredAges.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Container>
        <Paper elevation={4} sx={{ position: "sticky", marginTop: "20px",  padding: "16px", border: "1px solid #ff469e", borderRadius: "10px", backgroundColor: "white" }}>
          <Typography sx={{ padding: "8px", background: "#ff469e", color: "white", fontWeight: "bold", fontSize: "18px", borderRadius: "4px", textAlign: "center", marginBottom: "16px" }}>
            Manage Ages
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
          <DialogContent  >
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
        {visible && (
          <IconButton
            size="large"
            sx={{
              position: "fixed",
              right: 25,
              bottom: 75,
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