import React, { useState, useEffect } from "react";
import { KeyboardCapslock } from "@mui/icons-material";
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
import { allCategoryAdminApi, addCategoryApi, updateCategoryApi } from "../../api/CategoryAPI";

export default function CategoryManagement() {
  window.document.title = "Category Management";
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [openUpdateCategory, setOpenUpdateCategory] = useState(false);
  const [sortingStatus, setSortingStatus] = useState(null);
  const [noData, setNoData] = useState(false);

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
      const categoryRes = await allCategoryAdminApi();
      let sortedCategory = categoryRes.data.data || [];

      if (sortingStatus === "active") {
        sortedCategory = sortedCategory.filter((category) => category.active);
      } else if (sortingStatus === "inactive") {
        sortedCategory = sortedCategory.filter((category) => !category.active);
      }

      if (sortedCategory.length === 0) {
        setNoData(true);
      } else {
        setCategories(sortedCategory);
        setNoData(false);
      }
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
  }, [sortingStatus]);

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
    setNewCategoryName(""); // Clear input field
  };

  const handleInputChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  const handleSortingStatus = (event) => {
    setSortingStatus(event.target.value);
    setPage(0);
  };

  const handleAddCategory = async () => {
    const trimmedCategoryName = newCategoryName.trim();

    if (trimmedCategoryName === '') {
      toast.warn('Please enter a category name.', { autoClose: 1500 });
      return;
    }

    if (categories.some(category => category.name.toLowerCase() === trimmedCategoryName.toLowerCase())) {
      toast.error('Category name already exists.', { autoClose: 1500 });
      return;
    }

    try {
      const newCategory = { name: trimmedCategoryName }; // Adjust fields as per your API requirements
      await addCategoryApi(newCategory); // Replace with your API call to add category
      fetchData(); // Refresh category list
      handleCloseAddDialog();
      toast.success("Category added successfully.", { autoClose: 1500 });
      setPage(0);
    } catch (error) {
      toast.error("Failed to add category. Please try again later.", { autoClose: 1500 });
      // Handle error
    }
  };

  const openUpdate = (item) => {
    setOpenUpdateCategory(true);
    setSelectedCategory(item);
  };

  const closeUpdate = () => {
    setOpenUpdateCategory(false);
  };

  const handleChange = (field, value) => {
    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    const trimmedCategoryName = selectedCategory.name.trim();

    if (categories.some(category => category.name.toLowerCase() === trimmedCategoryName.toLowerCase() && category.id !== selectedCategory.id)) {
      toast.error('Category name already exists.', { autoClose: 1500 });
      return;
    }

    if (!selectedCategory) {
      toast.warn("No category selected for editing.", { autoClose: 1500 });
      return;
    }

    updateCategoryApi(
      selectedCategory.id,
      trimmedCategoryName,
      selectedCategory.active,
    )
      .then(() => {
        fetchData(); // Refresh category list
        closeUpdate();
        toast.success("Category updated successfully.", { autoClose: 1500 });
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        toast.error("Failed to update category. Please try again later.", { autoClose: 1500 });
      });
  };

  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

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
              padding: "11px",
              background: "#ff469e",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              borderRadius: "4px",
              textAlign: "center",
              marginBottom: "16px"
            }}>
            Categories Management
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
                container spacing={2}
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
                    placeholder="Search By Category Name"
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
                          )
                          }
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
                    <InputLabel htmlFor="sorting-status-select" id="sorting-status-label">
                      Sorting Status
                    </InputLabel>
                    <Select
                      labelId="sorting-status-label"
                      id="sorting-status-select"
                      value={sortingStatus}
                      onChange={handleSortingStatus}
                      label="Sorting Status"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            marginTop: '3px',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Sort by Default</MenuItem>
                      <MenuItem value="active">Sort by Active</MenuItem>
                      <MenuItem value="inactive">Sort by Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={1} md={2}></Grid>
                <Grid item xs={5} md={3} container justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleOpenAddDialog}
                    startIcon={<AddIcon style={{ color: "	FF1493" }} />}
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
                  >
                    Add Category
                  </Button>
                </Grid>
              </Grid>
              <TableContainer>
                <Table>
                  {noData ? null : (
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>No</TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Category Name</TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Status</TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                  )}
                  <TableBody>
                    {noData ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" style={{ color: '#ff469e', fontSize: '24px' }}>There's no items of this status</TableCell>
                      </TableRow>
                    ) : (
                      currentItems.map((item, index) => (
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {noData ? null : (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredCategories.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    justifyContent: "flex-end",
                    backgroundColor: "f1f1f1",
                    marginTop: "8px",
                    marginRight: "40px"
                  }}
                  labelRowsPerPage="Rows:"
                  labelDisplayedRows={({ from, to, count }) => `${from}/${to} of ${count}`}
                />
              )}
            </>
          )}
        </Paper>

        {/* Add Category Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}
          PaperProps={{
            style: {
              borderRadius: 7,
              boxShadow: "0px 2px 8px #ff469e",
            },
          }}>
          <DialogTitle style={{
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}>Add Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="normal"
              label="Category Name"
              type="text"
              fullWidth
              value={newCategoryName}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} sx={{
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
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} sx={{
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
            }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Category Dialog */}
        {selectedCategory && (
          <Dialog open={openUpdateCategory} onClose={closeUpdate}
            PaperProps={{
              style: {
                borderRadius: 7,
                boxShadow: "0px 2px 8px #ff469e",
              },
            }}>
            <DialogTitle style={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
            }}>Edit Category</DialogTitle>
            <DialogContent >
              <TextField
                label="Category Name"
                value={selectedCategory.name}
                fullWidth
                margin="normal"
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="active-select">Status</InputLabel>
                <Select
                  value={selectedCategory.active}
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
            </DialogContent>
            <DialogActions>
              <Button onClick={closeUpdate} sx={{
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
              }}>
                Cancel
              </Button>
              <Button onClick={handleEdit} sx={{
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
              }}>
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
    </div >
  );
}