import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addArticleApi,
  updateArticleApi,
  getArticlesByStoreIdApi,
} from "../../api/ArticleAPI";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Close, HelpOutline as HelpOutlineIcon } from "@mui/icons-material";
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
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  CircularProgress,
  Paper,
} from "@mui/material";
import { ClearAll, KeyboardCapslock } from "@mui/icons-material";
import Cart from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";
import { allStoreApi, storeByUserIdApi } from "../../api/StoreAPI";
import { allProductCHApi } from "../../api/ProductAPI";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { format, parseISO } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import DateRangeIcon from "@mui/icons-material/DateRange";

export default function Articles() {
  const navigate = useNavigate();
  window.document.title = "Articles";
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState([]);
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

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
  const fetchData = async (minDate, maxDate) => {
    try {
      const [articleRes, productRes] = await Promise.all([
        getArticlesByStoreIdApi({
          keyword: keyword,
          store_id: storeId,
          page: currentPage - 1,
          min_date: minDate
            ? dayjs(minDate).startOf("day").format("YYYY-MM-DD HH:mm:ss")
            : null,
          max_date: maxDate
            ? dayjs(maxDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")
            : null,
        }),
        allProductCHApi({
          type: "WHOLESALE",
        }),
      ]);

      const articleData = articleRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const productFilter = productData?.products.filter(
        (product) =>
          product.store_id === storeId &&
          new Date(product.expiryDate) > new Date()
      );

      setArticle(articleData);
      setProduct(productFilter);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchData(minDate, maxDate);
  }, [storeId, currentPage]);

  const onPageChange = (page) => {
    fetchData(page);
    window.scrollTo(0, 0);
  };

  //find article
  const handleSearch = () => {
    setLoading(true);
    if (keyword.length > 0 && keyword.length < 2) {
      setLoading(false);
      return;
    }
    if (keyword === "") {
      setTimeout(() => {
        setLoading(false);
        fetchData(minDate, maxDate);
      }, 2000);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      fetchData(minDate, maxDate);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  //Add Article
  const [openAddArticle, setOpenAddArticle] = useState(false);
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [productRecom, setProductRecom] = useState(null);
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
    if (!header || !content || !image.file || !productRecom) {
      toast.warn("Please fill in all fields and select a file.");
      return;
    }

    const isDuplicateHeader = article?.articles?.some(
      (article) => article.header === header
    );
    if (isDuplicateHeader) {
      toast.error("Article with this name already exists.");
      return;
    }

    addArticleApi(image.file, header, content, productRecom, storeId, isActive)
      .then((response) => {
        fetchData(minDate, maxDate);
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
    handleCloseProductRecom();
  };

  const handleUpdate = () => {
    if (!selectedArticle.header || !selectedArticle.content) {
      toast.warn("Please fill in all fields and select a file.");
      return;
    }

    const isDuplicateHeader = article?.articles?.some(
      (article) =>
        article.header === selectedArticle.header &&
        article.id !== selectedArticle.id
    );
    if (isDuplicateHeader) {
      toast.error("Article with this name already exists.");
      return;
    }

    const articleData = {
      header: selectedArticle.header,
      content: selectedArticle.content,
      product_recom: selectedArticle.product_recom,
      link_image: selectedArticle.link_image,
      store_id: selectedArticle.store_id,
      status: selectedArticle.status,
    };

    updateArticleApi(selectedArticle.id, articleData, image.file)
      .then((response) => {
        fetchData(minDate, maxDate);
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
        //   console.error("Error response data:", error.response.data);
        //   console.error("Error response status:", error.response.status);
        //   console.error("Error response headers:", error.response.headers);
        // } else if (error.request) {
        //   console.error("Error request:", error.request);
        // } else {
        //   console.error("Error message:", error.message);
        // }
      });
  };

  //Product recommend
  const [openProductModal, setOpenProductModal] = useState(false);
  const handleOpenProductRecom = () => {
    setOpenProductModal(true);
    setFilteredProducts(product);
  };

  const handleCloseProductRecom = () => {
    setOpenProductModal(false);
  };

  const handleSelectProduct = (product) => {
    setProductRecom(product);
    handleCloseProductRecom();
  };

  const getProductById = (productId) => {
    return product.find((product) => product.id === productId);
  };

  useEffect(() => {
    setFilteredProducts(product);
  }, [product]);

  const [searchProduct, setSearchProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const handleSearchChange = (event) => {
    setSearchProduct(event.target.value);
  };

  const handleSearchPro = () => {
    setLoadingProduct(true);
    setTimeout(() => {
      filterProducts(searchProduct);
      setLoadingProduct(false);
    }, 1000);
  };

  const filterProducts = (keyword) => {
    const filtered = product.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredProducts(filtered);
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

  const formatDateTime = (dateTime) => {
    try {
      const parsedDate = parseISO(dateTime);
      return format(parsedDate, "dd-MM-yyyy");
    } catch (error) {
      console.error("Invalid date format:", dateTime, error);
      return "Invalid date";
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDateChange = (newValue) => {
    const [newMinDate, newMaxDate] = newValue;
    setMinDate(newMinDate);
    setMaxDate(newMaxDate);
    if (newValue[0] && newValue[1]) {
      fetchData(newValue[0], newValue[1]);
    }
  };

  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
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
              sx={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ArticleSearch */}
              <div style={{ position: "relative", zIndex: "99" }}>
                <TextField
                  placeholder="What do you want to find?"
                  size="small"
                  variant="outlined"
                  value={keyword}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setKeyword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading ? (
                          <CircularProgress
                            sx={{ color: "#ff469e", mx: 2 }}
                            size={24}
                          />
                        ) : (
                          <>
                            {keyword && (
                              <IconButton
                                onClick={() => setKeyword("")}
                                size="small"
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            )}
                            <Button
                              onClick={handleSearch}
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
                                  boxShadow:
                                    "inset 1px 1px 3px rgba(0, 0, 0.16)",
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
                          </>
                        )}
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
          <Box mb={2} display="flex" alignItems="center" justifyContent="start">
            {/* Date pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                startText="Min Date"
                endText="Max Date"
                value={[minDate, maxDate]}
                onChange={handleDateChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField
                      {...startProps}
                      size="small"
                      variant="outlined"
                    />
                    <TextField {...endProps} size="small" variant="outlined" />
                  </>
                )}
                inputFormat="YYYY-MM-DD"
              />
            </LocalizationProvider>
            {/* Custom button or icon */}
            <Tooltip title="You need to select both start and end dates to filter. Selecting only one will not work.">
              <IconButton>
                <DateRangeIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            maxWidth: "100vw",
          }}
        >
          <CircularProgress sx={{ color: "#ff469e" }} size={100} />
        </Box>
      </div>
    );
  }

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
                onKeyDown={handleKeyDown}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? (
                        <CircularProgress
                          sx={{ color: "#ff469e", mx: 2 }}
                          size={24}
                        />
                      ) : (
                        <>
                          {keyword && (
                            <IconButton
                              onClick={() => setKeyword("")}
                              size="small"
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          )}
                          <Button
                            onClick={handleSearch}
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
                        </>
                      )}
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
        <Box mb={2} display="flex" alignItems="center" justifyContent="start">
          {/* Date pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Min Date"
              endText="Max Date"
              value={[minDate, maxDate]}
              onChange={handleDateChange}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} size="small" variant="outlined" />
                  <TextField {...endProps} size="small" variant="outlined" />
                </>
              )}
              inputFormat="YYYY-MM-DD"
            />
          </LocalizationProvider>
          {/* Custom button or icon */}
          <Tooltip title="You need to select both start and end dates to filter. Selecting only one will not work.">
            <IconButton>
              <DateRangeIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
                          cursor: "pointer",
                          transition: "border 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            border: "1px solid #ff469e",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              item.link_image &&
                              item.link_image.includes("Article_")
                                ? `http://localhost:8080/mamababy/products/images/${item.link_image}`
                                : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                            }
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                            }}
                            alt={item.header}
                            onClick={() => handleOpen(item)}
                            style={{
                              width: "250px",
                              height: "140px",
                              objectFit: "contain",
                            }}
                          />
                        </Box>

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
                            Created at: {formatDateTime(item.created_at)}
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
      {/* <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              border: "1px solid #f5f7fd",
              borderRadius: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "border 0.2s, box-shadow 0.2s",
              "&:hover": {
                border: "1px solid #ff469e",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                backgroundColor: "white",
                color: "#ff469e",
              },
            },
            "& .Mui-selected": {
              border: "1px solid #ff469e",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              backgroundColor: "white !important",
              color: "#ff469e !important",
            },
          }}
        />
      </Grid> */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pagination
          count={article.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          showFirstButton={article.totalPages !== 1}
          showLastButton={article.totalPages !== 1}
          hidePrevButton={currentPage === 1}
          hideNextButton={currentPage === article.totalPages}
          size="large"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2.5rem",
            width: "70%",
            p: 1,
            opacity: 0.9,
            borderRadius: "20px",
            "& .MuiPaginationItem-root": {
              backgroundColor: "white",
              borderRadius: "20px",
              border: "1px solid black",
              boxShadow: "0px 2px 3px rgba(0, 0, 0.16, 0.5)",
              mx: 1,
              transition:
                "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#fff4fc",
                color: "#ff469e",
                border: "1px solid #ff469e",
              },
              "&.Mui-selected": {
                backgroundColor: "#ff469e",
                color: "white",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
              },
              fontSize: "1.25rem",
            },
            "& .MuiPaginationItem-ellipsis": {
              mt: 1.25,
              fontSize: "1.25rem",
            },
          }}
          componentsProps={{
            previous: {
              sx: {
                fontSize: "1.5rem",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                },
              },
            },
            next: {
              sx: {
                fontSize: "1.5rem",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                },
              },
            },
          }}
        />
      </Box>

      <Dialog
        open={openAddArticle}
        onClose={handleCloseAddArticle}
        maxWidth={"md"}
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20, // Adjust border radius as per your requirement
            boxShadow: "0px 4px 8px #ff469e", // Add boxShadow for a raised effect
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Roboto",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          Add Article
        </DialogTitle>
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
            rows={10}
            fullWidth
            margin="normal"
          />
          {/* <TextField
            label="Product recommendation"
            value={productRecom ? productRecom.name : ""}
            onClick={handleOpenProductRecom}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          /> */}
          <TextField
            label="Product recommendation"
            value={productRecom ? productRecom.name : ""}
            onClick={handleOpenProductRecom}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="You can select a product to recommend to customers in the article from the store. If you don't want to select, leave it blank.">
                    <IconButton>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
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
              backgroundColor: "#F0F8FF",
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
              color: "#ff469e",
              borderRadius: "30px",
              fontSize: 16,
              fontWeight: "bold",
              width: "10vw",
              transition:
                "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
              border: "1px solid #ff469e",
              "&:hover": {
                backgroundColor: "#ff469e",
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
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: 20, // Adjust border radius as per your requirement
              boxShadow: "0px 4px 8px #ff469e", // Add boxShadow for a raised effect
            },
          }}
        >
          <DialogTitle
            style={{
              fontFamily: "Roboto",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
            }}
          >
            Article information
          </DialogTitle>
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
              rows={10}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Product recommendation"
              value={
                selectedArticle?.product_recom
                  ? getProductById(selectedArticle?.product_recom)?.name
                  : ""
              }
              onClick={handleOpenProductRecom}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="You can select a product to recommend to customers in the article from the store. If you don't want to select, leave it blank.">
                      <IconButton>
                        <HelpOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
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
                backgroundColor: "#F0F8FF",
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
                color: "#ff469e",
                borderRadius: "30px",
                fontSize: 16,
                fontWeight: "bold",
                width: "10vw",
                transition:
                  "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
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
      <Dialog
        open={openProductModal}
        onClose={handleCloseProductRecom}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20, // Adjust border radius as per your requirement
            boxShadow: "0px 4px 8px #ff469e", // Add boxShadow for a raised effect
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Roboto",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Select a Product</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search products"
              variant="outlined"
              size="small"
              value={searchProduct}
              onChange={handleSearchChange}
              sx={{ mr: 1 }}
            />
            <IconButton
              onClick={handleSearchPro}
              disabled={loadingProduct}
              sx={{
                borderRadius: "50%",
                backgroundColor: "#F0F8FF",
                color: "#757575",
                fontSize: 16,
                border: "1px solid #757575",
                transition:
                  "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#757575",
                  color: "white",
                  border: "1px solid white",
                },
              }}
            >
              {loadingProduct ? (
                <CircularProgress size={24} sx={{ color: "#ff469e" }} />
              ) : (
                <SearchIcon />
              )}
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {filteredProducts.map((product) => (
              <Grid item xs={6} key={product.id}>
                <Tooltip
                  title={product.name}
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
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "10px",
                      position: "relative",
                      minHeight: "150px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={
                        product.image_url &&
                        product.image_url.includes("Product_")
                          ? `http://localhost:8080/mamababy/products/images/${product.image_url}`
                          : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                      }}
                      alt={product.name}
                      style={{
                        width: "250px",
                        height: "140px",
                        objectFit: "contain",
                      }}
                    />
                    <Typography variant="subtitle1">
                      {product.name.length > 20
                        ? product.name.slice(0, 20) + "..."
                        : product.name}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "50%",
                        padding: "8px",
                        minWidth: "32px",
                        minHeight: "32px",
                        maxWidth: "32px",
                        maxHeight: "32px",
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
                      onClick={() => {
                        if (selectedArticle) {
                          handleChange("product_recom", product.id);
                        } else {
                          handleSelectProduct(product);
                        }
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Paper>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseProductRecom}
            sx={{
              backgroundColor: "#F0F8FF",
              color: "#757575",
              borderRadius: "30px",
              fontSize: 16,
              fontWeight: "bold",
              width: "5vw",
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
        </DialogActions>
      </Dialog>
    </div>
  );
}
