import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import {
  allProductApi,
  addProductApi,
  updateProductApi,
  allProductByStoreApi,
} from "../../api/ProductAPI";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import ProductSearch from "../Navigation/ProductSearch";
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

export default function StaffHome() {
  const navigate = useNavigate();
  window.document.title = "Products";
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [ageFilter, setAgeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [storeName, setStoreName] = useState("");
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
  // console.log(storeId);
  const fetchData = async (page = 1) => {
    try {
      const [ageRes, brandRes, categoryRes, productRes] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allProductByStoreApi({
          keyword: keyword,
          category_id: categoryFilter,
          brand_id: brandFilter,
          age_id: ageFilter,
          store_id: storeId,
          page: page - 1, // API thường sử dụng 0-based index cho trang
        }),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const totalPages = productRes?.data?.data?.totalPages || 1; // Giả sử API trả về tổng số trang

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);
      setTotalPages(totalPages);
      setCurrentPage(page); // Cập nhật trang hiện tại

      const ageMap = ageData.reduce((x, item) => {
        x[item.id] = item.rangeAge;
        return x;
      }, {});
      setAgeMap(ageMap);

      const brandMap = brandData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setBrandMap(brandMap);

      const categoryMap = categoryData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setCategoryMap(categoryMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchData(1);
  }, [keyword, ageFilter, brandFilter, categoryFilter, storeId]);

  const onPageChange = (page) => {
    fetchData(page);
    window.scrollTo(0, 0);
  };

  //find product
  const handleSearch = () => {
    fetchData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleAgeChange = (id) => {
    setAgeFilter((prev) => (prev === id ? null : id));
    setLoading(true);
  };

  const handleBrandChange = (id) => {
    setBrandFilter((prev) => (prev === id ? null : id));
    setLoading(true);
  };

  const handleCategoryChange = (id) => {
    setCategoryFilter((prev) => (prev === id ? null : id));
    setLoading(true);
  };

  const handleClearFilters = () => {
    setAgeFilter(null);
    setBrandFilter(null);
    setCategoryFilter(null);
    setLoading(true);
  };

  //Add Product
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [point, setPoint] = useState("");
  const [status, setStatus] = useState("IN STOCK");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("WHOLESALE");
  const [brandId, setBrandId] = useState(1);
  const [categoryId, setCategoryId] = useState(1);
  const [ageId, setAgeId] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  const handleOpenAddProduct = () => {
    setOpenAddProduct(true);
  };

  const handleCloseAddProduct = () => {
    setOpenAddProduct(false);
  };

  const handleAddProduct = () => {
    if (!name || !price || !point || !description || !image.file) {
      // Nếu có ít nhất một trường dữ liệu bị thiếu
      // Hiển thị thông báo lỗi cho người dùng

      toast.warn("Please fill in all required fields.");
      return;
    } else if (price <= 0 || point <= 0) {
      toast.error("Price or Point cannot be less than or equal to 0.");
      return;
    }
    debugger;
    addProductApi(
      image.file,
      name,
      price,
      point,
      status,
      description,
      type,
      brandId,
      categoryId,
      ageId,
      storeId,
      isActive
    )
      .then((response) => {
        // Xử lý kết quả trả về từ API
        // Đóng dialog thêm sản phẩm
        fetchData(currentPage);
        handleCloseAddProduct();
        toast.success("Product added successfully!");
      })
      .catch((error) => {
        // Xử lý lỗi từ API
        console.error("Error adding product:", error);
        // Hiển thị thông báo lỗi cho người dùng
        toast.error("Failed to add product. Please try again later.");
      });
  };

  //Update product
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  //const [selectedImage, setSelectedImage] = useState("");

  const handleOpen = (item) => {
    setSelectedProduct(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleChange = (field, value) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    if (
      !selectedProduct.name ||
      !selectedProduct.price ||
      !selectedProduct.point ||
      !selectedProduct.description ||
      !image.url
    ) {
      // Nếu có ít nhất một trường dữ liệu bị thiếu
      // Hiển thị thông báo lỗi cho người dùng
      toast.warn("Please fill in all required fields.");
      return;
    } else if (selectedProduct.price <= 0 || selectedProduct.point <= 0) {
      toast.error("Price or Point cannot be less than or equal to 0.");
      return;
    }
    debugger;
    // Xử lý cập nhật sản phẩm
    updateProductApi(
      image.file || "",
      selectedProduct.id,
      selectedProduct.name,
      selectedProduct.price,
      selectedProduct.point,
      selectedProduct.status,
      selectedProduct.description,
      selectedProduct.type,
      selectedProduct.brand_id,
      selectedProduct.category_id,
      selectedProduct.age_id,
      selectedProduct.store_id,
      selectedProduct.is_active
    )
      .then((response) => {
        // Xử lý kết quả trả về từ API
        // Đóng dialog cập nhật sản phẩm
        fetchData(currentPage);
        handleClose();
        toast.success("Product updated successfully!");
      })
      .catch((error) => {
        if (error.response) {
          // Server trả về một mã trạng thái không nằm trong phạm vi 2xx
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          // Yêu cầu đã được thực hiện nhưng không nhận được phản hồi
          console.error("Error request:", error.request);
        } else {
          // Một cái gì đó đã xảy ra trong việc thiết lập yêu cầu mà kích hoạt lỗi
          console.error("Error message:", error.message);
        }
        toast.error("Failed to update product. Please try again later.");
      });

    //debug
    // if (!selectedProduct) return;
    // console.log("Product details:", {
    //   image: image.file,
    //   imageUrl: image.url,
    //   id: selectedProduct.id,
    //   name: selectedProduct.name,
    //   price: selectedProduct.price,
    //   point: selectedProduct.point,
    //   description: selectedProduct.description,
    //   status: selectedProduct.status,
    //   type: selectedProduct.type,
    //   category_id: selectedProduct.category_id,
    //   brand_id: selectedProduct.brand_id,
    //   age_id: selectedProduct.age_id,
    //   is_active: selectedProduct.is_active,
    // });
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
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], selectedProduct.image_url, {
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
    };

    if (selectedProduct?.image_url) {
      const imageUrl = `${environment.apiBaseUrl}/products/images/${selectedProduct.image_url}`;
      setImageFromUrl(imageUrl);
    } else {
      setImage((prevImage) => ({
        ...prevImage,
        url: "",
        file: null,
      }));
    }
  }, [selectedProduct]);

  // useEffect(() => {
  //   if (selectedProduct?.image_url) {
  //     setSelectedImage(selectedProduct.image_url);
  //   } else {
  //     setSelectedImage("");
  //   }
  // }, [selectedProduct]);

  // const handleChangeImage = (file) => {
  //   // Kiểm tra xem có file nào được chọn không
  //   if (file) {
  //     // Đọc dữ liệu của file ảnh
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     // Khi đọc dữ liệu thành công
  //     reader.onload = () => {
  //       // Lưu đường dẫn của file ảnh vào trạng thái của ứng dụng
  //       setSelectedImage(reader.result);
  //       // Gọi hàm handleChange để cập nhật giá trị của trường 'image_url'
  //       handleChange("image_url", reader.result);
  //     };
  //   }
  // };

  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return (
      <div
        style={{
          backgroundColor: "#f5f7fd",
          padding: "20px",
        }}
      >
        <Container sx={{ my: 4 }}></Container>
        <Container>
          <Grid container spacing={3}>
            {/* Filters */}
            <Grid
              item
              sm={12}
              md={3}
              sx={{
                border: "2px solid #ff469e",
                borderRadius: "20px",
                backgroundColor: "white",
                my: 3,
              }}
            >
              <Box sx={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      flexGrow: 1,
                      textAlign: "center",
                    }}
                  >
                    Filters
                  </Typography>
                  {(ageFilter || brandFilter || categoryFilter) && (
                    <Button
                      variant="contained"
                      onClick={handleClearFilters}
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "10px",
                        fontSize: 16,
                        fontWeight: "bold",
                        mr: 2,
                        padding: "0.25rem 0.5rem",
                        boxShadow: "none",
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
                      <ClearAll />
                    </Button>
                  )}
                </div>
                <Grid container spacing={2}>
                  {/* Age Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Age
                    </Typography>
                    <Grid container spacing={1}>
                      {age.map((item) => (
                        <Grid
                          xs={6}
                          item
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={ageFilter === item.id}
                                onChange={() => handleAgeChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.rangeAge}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {/* Brand Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Brand
                    </Typography>
                    <Grid container spacing={1}>
                      {brand.map((item) => (
                        <Grid
                          xs={6}
                          item
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={brandFilter === item.id}
                                onChange={() => handleBrandChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  {/* Category Filter */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        textAlign: "left",
                      }}
                    >
                      Category
                    </Typography>
                    <Grid container spacing={1}>
                      {category.map((item) => (
                        <Grid
                          item
                          xs={12}
                          key={item.id}
                          sx={{ textAlign: "left" }}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={categoryFilter === item.id}
                                onChange={() => handleCategoryChange(item.id)}
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#ff469e",
                                  },
                                }}
                              />
                            }
                            sx={{
                              "&:hover": {
                                color: "#ff469e",
                              },
                            }}
                            label={item.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Loading Spinner */}
            <Grid item sm={12} md={9}>
              <Box
                sx={{
                  backgroundColor: "#f5f7fd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ color: "#ff469e" }} size={90} />
              </Box>
            </Grid>
          </Grid>
        </Container>
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
          {/* Grid item for ProductSearch and Add Product button */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{ textAlign: "center", display: "flex", alignItems: "center" }}
          >
            {/* ProductSearch */}
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
            {/* Add Product button */}
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
              onClick={handleOpenAddProduct}
            >
              <AddIcon style={{ fontSize: "2rem" }} />
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={3}>
          {/* Filters */}
          <Grid
            item
            sm={12}
            md={3}
            sx={{
              border: "2px solid #ff469e",
              borderRadius: "20px",
              backgroundColor: "white",
              my: 3,
            }}
          >
            <Box sx={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    flexGrow: 1,
                    textAlign: "center",
                  }}
                >
                  Filters
                </Typography>
                {(ageFilter || brandFilter || categoryFilter) && (
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "10px",
                      fontSize: 16,
                      fontWeight: "bold",
                      mr: 2,
                      padding: "0.25rem 0.5rem",
                      boxShadow: "none",
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
                    <ClearAll />
                  </Button>
                )}
              </div>
              <Grid container spacing={2}>
                {/* Age Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Age
                  </Typography>
                  <Grid container spacing={1}>
                    {age.map((item) => (
                      <Grid
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                        item
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={ageFilter === item.id}
                              onChange={() => handleAgeChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.rangeAge}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Brand Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Brand
                  </Typography>
                  <Grid container spacing={1}>
                    {brand.map((item) => (
                      <Grid
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                        item
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={brandFilter === item.id}
                              onChange={() => handleBrandChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Category Filter */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    Category
                  </Typography>
                  <Grid container spacing={1}>
                    {category.map((item) => (
                      <Grid
                        item
                        xs={12}
                        key={item.id}
                        sx={{ textAlign: "left" }}
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={categoryFilter === item.id}
                              onChange={() => handleCategoryChange(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#ff469e",
                                },
                              }}
                            />
                          }
                          sx={{
                            "&:hover": {
                              color: "#ff469e",
                            },
                          }}
                          label={item.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* List Products */}
          <Grid item sm={12} md={9}>
            <Grid container spacing={3}>
              {product?.products?.length === 0 ? (
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", marginTop: 8, color: "#ff469e" }}
                  >
                    There's no item matching your search.
                  </Typography>
                </Grid>
              ) : (
                product?.products?.map((item, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Tooltip
                      title={item.name}
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
                          image={`http://localhost:8080/mamababy/products/images/${item.image_url}`}
                          //image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                          alt={item.name}
                          sx={{ width: "64px", height: "64px", margin: "auto" }}
                          // onClick={() =>
                          //   navigate(
                          //     `/products/${item.name
                          //       .toLowerCase()
                          //       .replace(/\s/g, "-")}`,
                          //     { state: { productId: item.id } },
                          //     window.scrollTo({
                          //       top: 0,
                          //       behavior: "smooth",
                          //     })
                          //   )
                          // }
                          onClick={() => handleOpen(item)}
                        />
                        <CardContent
                          // onClick={() =>
                          //   navigate(
                          //     `/products/${item.name
                          //       .toLowerCase()
                          //       .replace(/\s/g, "-")}`,
                          //     { state: { productId: item.id } },
                          //     window.scrollTo({
                          //       top: 0,
                          //       behavior: "smooth",
                          //     })
                          //   )
                          // }
                          onClick={() => handleOpen(item)}
                        >
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
                            {item.name.length > 40
                              ? `${item.name.substring(0, 40)}...`
                              : item.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            {formatCurrency(item.price)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            {brandMap[item.brand_id]} |{" "}
                            {categoryMap[item.category_id]}
                          </Typography>
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

      <Dialog open={openAddProduct} onClose={handleCloseAddProduct}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Point"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            type="number"
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="IN STOCK">IN STOCK</MenuItem>
              <MenuItem value="OUT OF STOCK">OUT OF STOCK</MenuItem>
              <MenuItem value="COMING SOON">COMING SOON</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="WHOLESALE">WHOLESALE</MenuItem>
              <MenuItem value="GIFT">GIFT</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            //onChange={(e) => handleChangeImage(e.target.files[0])}
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
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {Object.keys(categoryMap).map((key) => (
                <MenuItem key={key} value={key}>
                  {categoryMap[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Brand</InputLabel>
            <Select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              {Object.keys(brandMap).map((key) => (
                <MenuItem key={key} value={key}>
                  {brandMap[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Age"
            select
            value={ageId}
            onChange={(e) => setAgeId(e.target.value)}
            fullWidth
            margin="normal"
          >
            {age.map((ageItem) => (
              <MenuItem key={ageItem.id} value={ageItem.id}>
                {ageItem.rangeAge}
              </MenuItem>
            ))}
          </TextField>
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
            onClick={handleCloseAddProduct}
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
            onClick={handleAddProduct}
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

      {selectedProduct && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Product information</DialogTitle>
          <DialogContent>
            {/* <TextField
              label="ID"
              value={selectedProduct?.id}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            /> */}
            <TextField
              label="Name"
              value={selectedProduct?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              value={selectedProduct?.price}
              onChange={(e) => handleChange("price", e.target.value)}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Point"
              value={selectedProduct?.point}
              onChange={(e) => handleChange("point", e.target.value)}
              type="number"
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedProduct?.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <MenuItem value="IN STOCK">IN STOCK</MenuItem>
                <MenuItem value="OUT OF STOCK">OUT OF STOCK</MenuItem>
                <MenuItem value="COMING SOON">COMING SOON</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedProduct?.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <MenuItem value="WHOLESALE">WHOLESALE</MenuItem>
                <MenuItem value="GIFT">GIFT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={selectedProduct?.description}
              onChange={(e) => handleChange("description", e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Created At"
              value={new Date(selectedProduct?.created_at).toLocaleDateString()}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Updated At"
              value={new Date(selectedProduct?.updated_at).toLocaleDateString()}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            {/* <TextField
              label="Image URL"
              value={selectedProduct?.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
              fullWidth
              margin="normal"
            /> */}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedProduct?.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
              >
                {Object.keys(categoryMap).map((key) => (
                  <MenuItem key={key} value={key}>
                    {categoryMap[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedProduct?.brand_id}
                onChange={(e) => handleChange("brand_id", e.target.value)}
              >
                {Object.keys(brandMap).map((key) => (
                  <MenuItem key={key} value={key}>
                    {brandMap[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Age"
              select
              value={selectedProduct?.age_id}
              onChange={(e) => handleChange("age_id", e.target.value)}
              fullWidth
              margin="normal"
            >
              {age.map((ageItem) => (
                <MenuItem key={ageItem.id} value={ageItem.id}>
                  {ageItem.rangeAge}
                </MenuItem>
              ))}
            </TextField>
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
                value={selectedProduct?.is_active}
                onChange={(e) => handleChange("is_active", e.target.value)}
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
