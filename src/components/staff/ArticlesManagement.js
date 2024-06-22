import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  addArticleApi,
  updateArticleApi,
  allArticleApi,
  getArticlesByStoreIdApi,
} from "../../api/ArticleAPI";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import ProductSearch from "../Navigation/ProductSearch";
import SearchIcon from "@mui/icons-material/Search";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import {
  Box,
  Breadcrumbs,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Tooltip,
  Typography,
} from "@mui/material";
import { ClearAll, KeyboardCapslock } from "@mui/icons-material";
import Cart from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";
import { allStoreApi, storeByUserIdApi } from "../../api/StoreAPI";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { Pagination, PaginationItem } from "@mui/material";

export default function Articles() {
  const navigate = useNavigate();
  window.document.title = "Articles";
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState([]);
  const [store, setStore] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;

  useEffect(() => {
    storeByUserIdApi(userId)
      .then((res) => {
        setStore(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const storeId = store.id;
  // console.log(userId);
  //console.log(storeId);
  const fetchData = async (page) => {
    try {
      const articleRes = await getArticlesByStoreIdApi({
        keyword: keyword,
        store_id: storeId,
        page: page - 1, // API thường sử dụng 0-based index cho trang
      });

      const articleData = articleRes?.data?.data || [];
      const totalPages = articleRes?.data?.data?.totalPages || 1; // Giả sử API trả về tổng số trang

      setArticle(articleData);
      setTotalPages(totalPages);
      setCurrentPage(page); // Cập nhật trang hiện tại
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchData(1);
  }, [keyword, storeId]);

  const onPageChange = (page) => {
    fetchData(page);
    window.scrollTo(0, 0);
  };

  //find article
  const handleSearch = () => {
    fetchData();
  };

  //Add Article
  const [openAddArticle, setOpenAddArticle] = useState(false);
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [linkProduct, setLinkProduct] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  const handleOpenAddArticle = () => {
    setOpenAddArticle(true);
  };

  const handleCloseAddArticle = () => {
    setOpenAddArticle(false);
  };

  const handleAddArticle = () => {
    // Kiểm tra các trường không được rỗng
    if (!header || !content || !linkProduct || !image.file) {
      toast.warn("Please fill in all fields and select a file.");
      return;
    }

    addArticleApi(image.file, header, content, linkProduct, storeId, isActive)
      .then((response) => {
        fetchData(currentPage);
        handleCloseAddArticle();
        toast.success("Article added successfully!");
      })
      .catch((error) => {
        console.error("Error adding article:", error);
        toast.error("Failed to add article. Please try again later.");
      });
  };

  //Update Article
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleOpen = (item) => {
    setSelectedArticle(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  const handleChange = (field, value) => {
    setSelectedArticle((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    // Kiểm tra các trường không được rỗng
    if (
      !selectedArticle.header ||
      !selectedArticle.content ||
      !selectedArticle.link_product
    ) {
      toast.warn("Please fill in all fields and select a file.");
      return;
    }

    const articleData = {
      header: selectedArticle.header,
      content: selectedArticle.content,
      link_product: selectedArticle.link_product,
      link_image: selectedArticle.link_image,
      store_id: selectedArticle.store_id,
      status: selectedArticle.status,
    };

    updateArticleApi(selectedArticle.id, articleData, image.file)
      .then((response) => {
        fetchData(currentPage);
        handleClose();
        toast.success("Article updated successfully:", response.data);
      })
      .catch((error) => {
        if (error.response.headers["content-type"] === "application/json") {
          toast.error(
            "The product photo is currently damaged, please select a new photo."
          );
        } else {
          toast.error("Failed to update article. Please try again later.");
        }
        // if (error.response) {
        //   // Server trả về một mã trạng thái không nằm trong phạm vi 2xx
        //   console.error("Error response data:", error.response.data);
        //   console.error("Error response status:", error.response.status);
        //   console.error("Error response headers:", error.response.headers);
        // } else if (error.request) {
        //   // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
        //   console.error("Error request:", error.request);
        // } else {
        //   // Một cái gì đó đã xảy ra trong việc thiết lập yêu cầu mà kích hoạt lỗi
        //   console.error("Error message:", error.message);
        // }
      });
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImage({
        file: file,
        url: url,
      });
    }
  };

  useEffect(() => {
    const setImageFromUrl = async (url) => {
      if (image.url === "") {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], selectedArticle.link_image, {
            type: blob.type,
          });

          setImage((prevImage) => ({
            ...prevImage,
            url,
            file,
          }));
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    if (selectedArticle?.link_image) {
      const imageUrl = `${environment.apiBaseUrl}/article/images/${selectedArticle.link_image}`;
      setImageFromUrl(imageUrl);
    } else {
      setImage((prevImage) => ({
        ...prevImage,
        url: "",
        file: null,
      }));
    }
  }, [selectedArticle]);

  return (
    <div
      style={{
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container sx={{ my: 4 }}>
        <Grid container justifyContent="center" spacing={2}>
          {/* Grid item for ArticleSearch and Add Article button */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{ textAlign: "center", display: "flex", alignItems: "center" }}
          >
            {/* ArticleSearch */}
            <div style={{ position: "relative", zIndex: "99" }}>
              <TextField
                placeholder="What do you want to find?"
                size="small"
                variant="outlined"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        sx={{
                          backgroundColor: "#ff469e",
                          color: "white",
                          height: "40px",
                          marginRight: "0.6px",
                          borderRadius: "5px",
                          boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                          transition: "0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#ff469e",
                            opacity: 0.8,
                            color: "white",
                            boxShadow: "inset 1px 1px 3px rgba(0, 0, 0.16)",
                          },
                          "&:active": {
                            backgroundColor: "white",
                            color: "#ff469e",
                            boxShadow:
                              "inset 1px 1px 3px rgba(255, 70, 158, 0.8)",
                          },
                        }}
                      >
                        <SearchIcon
                          sx={{
                            color: "inherit",
                            cursor: "pointer",
                            fontSize: "35px",
                          }}
                        />
                      </Button>
                    </InputAdornment>
                  ),
                  sx: {
                    width: { md: "650px" },
                    padding: 0,
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
                  },
                }}
              />
            </div>
            {/* Add Article button */}
            <Button
              variant="contained"
              color="primary"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                color: "#ff469e",
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: 10,
                width: "15vw",
                height: "3vw", // Adjust as necessary to ensure it's a square
                transition:
                  "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  border: "1px solid white",
                },
                ml: 2,
              }}
              onClick={handleOpenAddArticle}
            >
              <AddIcon style={{ fontSize: "2rem" }} />
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container justifyContent="center" spacing={3}>
          {/* List Articles */}
          <Grid item sm={12} md={12}>
            <Grid container spacing={3}>
              {article?.articles?.length === 0 ? (
                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", marginTop: 8, color: "#ff469e" }}
                  >
                    There's no item matching your search.
                  </Typography>
                </Grid>
              ) : (
                article?.articles?.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Tooltip
                      title={item.header}
                      enterDelay={500}
                      leaveDelay={50}
                      placement="right-start"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 250 }}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "white",
                            boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.16)",
                            color: "black",
                            borderRadius: "8px",
                            border: "1px solid black",
                            fontSize: "12px",
                          },
                        },
                      }}
                    >
                      <Card
                        sx={{
                          minWidth: 180,
                          padding: 2,
                          border: "1px solid #f5f7fd",
                          borderRadius: "16px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          backgroundColor: "white",
                          transition: "border 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            border: "1px solid #ff469e",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={`http://localhost:8080/mamababy/article/images/${item.link_image}`}
                          alt={item.header}
                          onClick={() => handleOpen(item)}
                        />
                        <CardContent onClick={() => handleOpen(item)}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              marginTop: "0.75rem",
                              textAlign: "left",
                              whiteSpace: "normal",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              maxWidth: "100%",
                              lineHeight: "1.2rem",
                              maxHeight: "2.4rem",
                            }}
                          >
                            {item.header.length > 40
                              ? `${item.header.substring(0, 40)}...`
                              : item.header}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            Created at: {item.created_at}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          ></Typography>
                        </CardContent>
                      </Card>
                    </Tooltip>
                  </Grid>
                ))
              )}
            </Grid>
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
      <Container>
        <Grid
          container
          justifyContent="center"
          spacing={3}
          sx={{ marginTop: 4 }}
        >
          <nav aria-label="Page navigation">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => onPageChange(page)}
              renderItem={(item) => (
                <PaginationItem
                  component="a"
                  href="#"
                  {...item}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item.page);
                  }}
                />
              )}
              siblingCount={1}
              boundaryCount={1}
            />
          </nav>
        </Grid>
      </Container>

      <Dialog open={openAddArticle} onClose={handleCloseAddArticle}>
        <DialogTitle>Add Article</DialogTitle>
        <DialogContent>
          <TextField
            label="Header"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Link Product"
            value={linkProduct}
            onChange={(e) => setLinkProduct(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ marginTop: "16px", marginBottom: "16px" }}
          />

          {image && (
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Image</InputLabel>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <img
                  src={image.url}
                  alt="Selected"
                  style={{ width: "100%", marginTop: "16px" }}
                />
              </div>
            </FormControl>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Active</InputLabel>
            <Select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAddArticle}
            sx={{
              backgroundColor: "#E0E0E0",
              color: "#757575",
              borderRadius: "30px",
              fontSize: 16,
              fontWeight: "bold",
              width: "10vw",
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
            Close
          </Button>
          <Button
            onClick={handleAddArticle}
            sx={{
              backgroundColor: "#F0F8FF",
              color: "#008080",
              borderRadius: "30px",
              fontSize: 16,
              fontWeight: "bold",
              width: "10vw",
              transition:
                "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
              border: "1px solid #008080",
              "&:hover": {
                backgroundColor: "#008080",
                color: "white",
                border: "1px solid white",
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {selectedArticle && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Article information</DialogTitle>
          <DialogContent>
            <TextField
              label="Header"
              value={selectedArticle?.header}
              onChange={(e) => handleChange("header", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Content"
              value={selectedArticle?.content}
              onChange={(e) => handleChange("content", e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Link Product"
              value={selectedArticle?.link_product}
              onChange={(e) => handleChange("link_product", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Created At"
              value={new Date(selectedArticle?.created_at).toLocaleDateString()}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Update At"
              value={new Date(selectedArticle?.updated_at).toLocaleDateString()}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              style={{ marginTop: "16px", marginBottom: "16px" }}
            />

            {image.url && (
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Image</InputLabel>
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={image.url}
                    alt="Selected"
                    style={{ width: "100%", marginTop: "16px" }}
                  />
                </div>
              </FormControl>
            )}
            <TextField
              label="Store"
              value={store.name_store}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Active</InputLabel>
              <Select
                value={selectedArticle?.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: "#E0E0E0",
                color: "#757575",
                borderRadius: "30px",
                fontSize: 16,
                fontWeight: "bold",
                width: "10vw",
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
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{
                backgroundColor: "#F0F8FF",
                color: "#008080",
                borderRadius: "30px",
                fontSize: 16,
                fontWeight: "bold",
                width: "10vw",
                transition:
                  "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #008080",
                "&:hover": {
                  backgroundColor: "#008080",
                  color: "white",
                  border: "1px solid white",
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
