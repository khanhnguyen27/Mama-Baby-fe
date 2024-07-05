import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { format, parseISO } from "date-fns";
import {
  addProductApi,
  updateProductApi,
  allProductByStoreApi,
} from "../../api/ProductAPI";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
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
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Box,
  Card,
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
  RadioGroup,
  Pagination,
} from "@mui/material";
import {
  ClearAll,
  KeyboardCapslock,
  Close,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";

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
  const [currentPage, setCurrentPage] = useState(1);
  const typeWHOLESALE = "WHOLESALE";
  const typeGIFT = "GIFT";
  const statusInStock = "IN STOCK";
  const statusComingSoon = "COMING SOON";
  const [sortPrice, setSortPrice] = useState("");

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo, Democratic Republic of the",
    "Congo, Republic of the",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, North",
    "Korea, South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

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
  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes] = await Promise.all([
        allAgeApi(),
        allBrandApi(),
        allCategorytApi(),
        allProductByStoreApi({
          keyword: keyword,
          sort_price: sortPrice,
          category_id: categoryFilter,
          brand_id: brandFilter,
          age_id: ageFilter,
          store_id: storeId,
          page: currentPage - 1,
        }),
      ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);

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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchData();
  }, [ageFilter, brandFilter, categoryFilter, storeId, currentPage, sortPrice]);

  const onPageChange = (page) => {
    fetchData(page);
    window.scrollTo(0, 0);
  };

  //find product
  const handleSearch = () => {
    setLoading(true);
    if (keyword.length > 0 && keyword.length < 2) {
      setLoading(false);
      return;
    }
    if (keyword === "") {
      setTimeout(() => {
        setLoading(false);
        fetchData();
      }, 2000);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      fetchData();
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
  const [remain, setRemain] = useState("");
  const [status, setStatus] = useState(statusInStock);
  const [description, setDescription] = useState("");
  const [type, setType] = useState(typeWHOLESALE);
  const [brandId, setBrandId] = useState(1);
  const [categoryId, setCategoryId] = useState(1);
  const [ageId, setAgeId] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [brandOrigin, setBrandOrigin] = useState("");
  const [manufacturedAt, setManufacturedAt] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("g");
  const [manufacturer, setManufacturer] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [usageInstructions, setUsageInstructions] = useState("");
  const [storageInstructions, setStorageInstructions] = useState("");
  const [expiryDate, setExpiryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const today = new Date().toISOString().split("T")[0];

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleRadioChange = (event) => {
    setIsActive(event.target.value);
  };

  const handleOpenAddProduct = () => {
    setOpenAddProduct(true);
  };

  const handleCloseAddProduct = () => {
    setOpenAddProduct(false);
  };

  const handleAddProduct = () => {
    if (
      !name ||
      !price ||
      !point ||
      !remain ||
      !image.file ||
      !weight ||
      !brandOrigin ||
      !manufacturedAt ||
      !manufacturer ||
      !ingredient ||
      !usageInstructions ||
      !storageInstructions
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    } else if (status !== statusComingSoon && remain <= 0) {
      toast.error(
        "If the status is in stock, the remain must be greater than 0."
      );
      return;
    } else if (status !== statusInStock && remain < 0) {
      toast.error(
        "If the status is coming soon, the remain must be greater than or equal to 0."
      );
      return;
    } else if (type === typeWHOLESALE) {
      if (price <= 0) {
        toast.error(
          "If the type is wholesale, the point must be greater than 0 and the price must be 0."
        );
        return;
      }
      if (point < 0 || point > 0) {
        toast.error(
          "If the type is wholesale, the point must be greater than 0 and the price must be 0."
        );
        return;
      }
    } else if (type === typeGIFT) {
      if (point <= 0) {
        toast.error(
          "If the type is gift, the point must be greater than 0 and the price must be 0."
        );
        return;
      }
      if (price < 0 || price > 0) {
        toast.error(
          "If the type is gift, the point must be greater than 0 and the price must be 0."
        );
        return;
      }
      if (status === statusComingSoon) {
        toast.error("Gifts cannot have a coming soon status.");
        return;
      }
    }
    if (weight <= 0) {
      toast.error("The weight must be greater than 0.");
      return;
    }

    const isDuplicateName = product?.products?.some(
      (product) => product.name === name
    );
    if (isDuplicateName) {
      toast.error("Product with this name already exists.");
      return;
    }

    const fullDescription = `${weight}|${unit}|${brandOrigin}|${manufacturedAt}|${manufacturer}|${ingredient}|${usageInstructions}|${storageInstructions}`;
    setDescription(fullDescription);
    addProductApi(
      image.file,
      name,
      price,
      point,
      remain,
      status,
      description,
      expiryDate,
      type,
      brandId,
      categoryId,
      ageId,
      storeId,
      isActive
    )
      .then((response) => {
        fetchData(currentPage);
        handleCloseAddProduct();
        toast.success("Product added successfully!");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Failed to add product. Please try again later.");
      });
  };

  const extractDescriptionDetails = (description) => {
    const [
      weight,
      unit,
      brandOrigin,
      manufacturedAt,
      manufacturer,
      ingredient,
      usageInstructions,
      storageInstructions,
    ] = description.split("|");

    return {
      weight,
      unit,
      brandOrigin,
      manufacturedAt,
      manufacturer,
      ingredient,
      usageInstructions,
      storageInstructions,
    };
  };

  //Update product
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  //const [selectedImage, setSelectedImage] = useState("");

  const handleOpen = (item) => {
    setSelectedProduct(item);
    const details = extractDescriptionDetails(item.description);
    setWeight(details.weight);
    setUnit(details.unit);
    setBrandOrigin(details.brandOrigin);
    setManufacturedAt(details.manufacturedAt);
    setManufacturer(details.manufacturer);
    setIngredient(details.ingredient);
    setUsageInstructions(details.usageInstructions);
    setStorageInstructions(details.storageInstructions);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setWeight(null);
    setBrandOrigin(null);
    setManufacturedAt(null);
    setManufacturer(null);
    setIngredient(null);
    setUsageInstructions(null);
    setStorageInstructions(null);
  };

  const handleChange = (field, value) => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    debugger;
    if (
      !selectedProduct.name ||
      !selectedProduct.price ||
      selectedProduct.point === "" ||
      !selectedProduct.remain ||
      !image.url ||
      !weight ||
      !brandOrigin ||
      !manufacturedAt ||
      !manufacturer ||
      !ingredient ||
      !usageInstructions ||
      !storageInstructions
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    } else if (
      selectedProduct?.status !== statusComingSoon &&
      selectedProduct?.remain <= 0
    ) {
      toast.error(
        "If the status is in stock, the remain must be greater than 0."
      );
      return;
    } else if (
      selectedProduct?.status !== statusInStock &&
      selectedProduct?.remain < 0
    ) {
      toast.error(
        "If the status is coming soon, the remain must be greater than or equal to 0."
      );
      return;
    } else if (selectedProduct?.type === typeWHOLESALE) {
      if (selectedProduct?.price <= 0) {
        toast.error(
          "If the type is wholesale, the price must be greater than 0 and the point must be 0."
        );
        return;
      }
      if (selectedProduct?.point < 0 || selectedProduct?.point > 0) {
        toast.error(
          "If the type is wholesale, the price must be greater than 0 and the point must be 0."
        );
        return;
      }
    } else if (selectedProduct?.type === typeGIFT) {
      if (selectedProduct?.point <= 0) {
        toast.error(
          "If the type is gift, the point must be greater than 0 and the price must be 0."
        );
        return;
      }
      if (selectedProduct?.price < 0 || selectedProduct?.price > 0) {
        toast.error(
          "If the type is gift, the point must be greater than 0 and the price must be 0."
        );
        return;
      }
      if (status === statusComingSoon) {
        toast.error("Gifts cannot have a coming soon status.");
        return;
      }
    }
    if (weight <= 0) {
      toast.error("The weight must be greater than 0.");
      return;
    }

    const isDuplicateName = product?.products?.some(
      (product) =>
        product.name === selectedProduct.name &&
        product.id !== selectedProduct.id
    );
    if (isDuplicateName) {
      toast.error("Product with this name already exists.");
      return;
    }

    const fullDescription = `${weight}|${unit}|${brandOrigin}|${manufacturedAt}|${manufacturer}|${ingredient}|${usageInstructions}|${storageInstructions}`;
    setDescription(fullDescription);
    selectedProduct.description = fullDescription;
    console.log(selectedProduct.expiryDate);

    //Handle product updates
    updateProductApi(
      image.file || "",
      selectedProduct.id,
      selectedProduct.name,
      selectedProduct.price,
      selectedProduct.point,
      selectedProduct.remain,
      selectedProduct.status,
      selectedProduct.description,
      selectedProduct.expiryDate,
      selectedProduct.type,
      selectedProduct.brand_id,
      selectedProduct.category_id,
      selectedProduct.age_id,
      selectedProduct.store_id,
      selectedProduct.is_active
    )
      .then((response) => {
        // Process results returned from the API
        // Close the product update dialog
        fetchData(currentPage);
        handleClose();
        toast.success("Product updated successfully!");
      })
      .catch((error) => {
        if (error.response.headers["content-type"] === "application/json") {
          toast.error(
            "The product photo is currently damaged, please select a new photo."
          );
        } else {
          toast.error("Failed to update product. Please try again later.");
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
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       setSelectedImage(reader.result);
  //       handleChange("image_url", reader.result);
  //     };
  //   }
  // };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e, sortPrice) => {
    if (sortPrice !== null) {
      setSortPrice(sortPrice);
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
            {/* Grid item for ProductSearch and Add Product button */}
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
              {/* ProductSearch */}
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

            <Grid item sm={12} md={9}>
              <Container>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <ToggleButtonGroup
                    value={sortPrice}
                    exclusive
                    onChange={handleSortChange}
                    variant="outlined"
                    sx={{
                      height: "40px",
                      "& .MuiToggleButton-root": {
                        color: "black",
                        border: "1px solid #ff469e",
                        fontSize: "1rem",
                        transition:
                          "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#fff4fc",
                          color: "#ff469e",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#ff469e",
                          color: "white",
                          fontWeight: "600",
                          "&:hover": {
                            backgroundColor: "#fff4fc",
                            color: "#ff469e",
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton
                      value=""
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "20px",
                        fontSize: "1rem",
                        boxShadow: "none",
                        transition:
                          "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        border: "1px solid #ff469e",
                        "&:hover": {
                          backgroundColor: "#ff469e",
                          color: "white",
                        },
                      }}
                    >
                      All
                    </ToggleButton>
                    <ToggleButton
                      value="ASC"
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderLeft: "1px solid #ff469e",
                        borderRight: "1px solid #ff469e",
                        fontSize: "1rem",
                        boxShadow: "none",
                        transition:
                          "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        border: "1px solid #ff469e",
                        "&:hover": {
                          backgroundColor: "#ff469e",
                          color: "white",
                        },
                      }}
                    >
                      Low - High
                    </ToggleButton>
                    <ToggleButton
                      value="DESC"
                      sx={{
                        backgroundColor: "white",
                        color: "#ff469e",
                        borderRadius: "20px",
                        fontSize: "1rem",
                        boxShadow: "none",
                        transition:
                          "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        border: "1px solid #ff469e",
                        "&:hover": {
                          backgroundColor: "#ff469e",
                          color: "white",
                        },
                      }}
                    >
                      High - Low
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Container>
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
            <Container>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                <ToggleButtonGroup
                  value={sortPrice}
                  exclusive
                  onChange={handleSortChange}
                  variant="outlined"
                  sx={{
                    mb: 4,
                    height: "40px",
                    "& .MuiToggleButton-root": {
                      color: "black",
                      border: "1px solid #ff469e",
                      fontSize: "1rem",
                      transition:
                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#fff4fc",
                        color: "#ff469e",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#ff469e",
                        color: "white",
                        fontWeight: "600",
                        "&:hover": {
                          backgroundColor: "#fff4fc",
                          color: "#ff469e",
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton
                    value=""
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "20px",
                      fontSize: "1rem",
                      boxShadow: "none",
                      transition:
                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                      },
                    }}
                  >
                    All
                  </ToggleButton>
                  <ToggleButton
                    value="ASC"
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderLeft: "1px solid #ff469e",
                      borderRight: "1px solid #ff469e",
                      fontSize: "1rem",
                      boxShadow: "none",
                      transition:
                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                      },
                    }}
                  >
                    Low - High
                  </ToggleButton>
                  <ToggleButton
                    value="DESC"
                    sx={{
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "20px",
                      fontSize: "1rem",
                      boxShadow: "none",
                      transition:
                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                      },
                    }}
                  >
                    High - Low
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Container>
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
                          display: "flex",
                          flexDirection: "column",
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
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "#ff469e",
                            color: "white",
                            borderRadius: "8px",
                            padding: "4px 8px",
                            fontSize: "12px",
                          }}
                        >
                          {item.type}
                        </Box>
                        <CardMedia
                          component="img"
                          image={
                            item.image_url &&
                            item.image_url.includes("Product_")
                              ? `http://localhost:8080/mamababy/products/images/${item.image_url}`
                              : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                          }}
                          alt={item.name}
                          sx={{
                            width: "64px",
                            height: "64px",
                            margin: "auto",
                            cursor: "pointer",
                          }}
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
                          //onClick={() => handleOpen(item)}
                          onClick={() =>
                            navigate(
                              `/staff/products/${item.name
                                .toLowerCase()
                                .replace(/\s/g, "-")}`,
                              { state: { productId: item.id } },
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              })
                            )
                          }
                        />
                        <CardContent
                          onClick={() =>
                            navigate(
                              `/staff/products/${item.name
                                .toLowerCase()
                                .replace(/\s/g, "-")}`,
                              { state: { productId: item.id } },
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              })
                            )
                          }
                          sx={{ cursor: "pointer" }}
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "gray",
                                textAlign: "left",
                              }}
                            >
                              {item.type === typeWHOLESALE ? (
                                formatCurrency(item.price)
                              ) : (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "gray", textAlign: "left" }}
                                  >
                                    {item.point}
                                  </Typography>
                                  <MonetizationOnIcon
                                    variant="h6"
                                    sx={{
                                      marginLeft: "4px",
                                      color: "gray",
                                      fontSize: 16,
                                    }}
                                  />
                                </Box>
                              )}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "gray",
                                  fontSize: 14, // Adjust the font size as needed
                                  textAlign: "left",
                                  mr: 1,
                                }}
                              >
                                Qty:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#333",
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  textAlign: "left",
                                }}
                              >
                                {item.remain}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{ color: "gray", textAlign: "left" }}
                          >
                            {brandMap[item.brand_id]} |{" "}
                            {categoryMap[item.category_id]}
                          </Typography>
                        </CardContent>
                        <Divider sx={{ mt: 0.5, mb: 2 }} />
                        <Button
                          variant="contained"
                          sx={{
                            ml: "auto",
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "30px",
                            fontSize: 15,
                            fontWeight: "bold",
                            width: "7vw",
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={() => handleOpen(item)}
                        >
                          Update
                        </Button>
                      </Card>
                    </Tooltip>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={product.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton={product.totalPages !== 1}
            showLastButton={product.totalPages !== 1}
            hidePrevButton={currentPage === 1}
            hideNextButton={currentPage === product.totalPages}
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

      <Dialog
        open={openAddProduct}
        onClose={handleCloseAddProduct}
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
          Add Product
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} margin={"normal"}>
            <Grid item xs={9}>
              <TextField
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Expiry Date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: today, // Chỉ cho phép chọn ngày từ hôm nay trở đi
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} margin={"normal"}>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Point"
                value={point}
                onChange={(e) => setPoint(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Remain"
                value={remain}
                onChange={(e) => setRemain(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} margin="normal">
            <Grid item xs={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={statusInStock}>IN STOCK</MenuItem>
                  <MenuItem value={statusComingSoon}>COMING SOON</MenuItem>
                </Select>
              </FormControl>{" "}
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <MenuItem value={typeWHOLESALE}>WHOLESALE</MenuItem>
                  <MenuItem value={typeGIFT}>GIFT</MenuItem>
                </Select>
              </FormControl>{" "}
            </Grid>
            <Grid item xs={4}>
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
              </FormControl>{" "}
            </Grid>
          </Grid>
          <Grid container spacing={2} margin="normal">
            <Grid item xs={4}>
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
              </FormControl>{" "}
            </Grid>

            <Grid item xs={4}>
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
              </TextField>{" "}
            </Grid>

            <Grid item xs={2.5}>
              <TextField
                label="Product Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                fullWidth
                type="number"
                margin="normal"
              />
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Unit</InputLabel>
                <Select value={unit} onChange={handleUnitChange}>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="ml">ml</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} margin="normal">
            <Grid item xs={6}>
              <Box>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option}
                  value={brandOrigin}
                  onChange={(event, newValue) => {
                    setBrandOrigin(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Brand Origin"
                      margin="normal"
                      fullWidth
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ textAlign: "right" }}>
                      {option}
                    </Box>
                  )}
                />
              </Box>{" "}
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option}
                  value={manufacturedAt}
                  onChange={(event, newValue) => {
                    setManufacturedAt(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Manufactured At"
                      margin="normal"
                      fullWidth
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ textAlign: "right" }}>
                      {option}
                    </Box>
                  )}
                />
              </Box>{" "}
            </Grid>
          </Grid>
          {/* <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          /> */}
          <TextField
            label="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Ingredient"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Usage Instructions"
            value={usageInstructions}
            onChange={(e) => setUsageInstructions(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Storage Instructions"
            value={storageInstructions}
            onChange={(e) => setStorageInstructions(e.target.value)}
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

          <FormControl component="fieldset" fullWidth margin="normal">
            <RadioGroup value={isActive} onChange={handleRadioChange} row>
              <FormControlLabel
                value="true"
                control={
                  <Radio
                    icon={<CheckCircle />}
                    checkedIcon={<CheckCircle />}
                    color="primary"
                  />
                }
                label="Active"
              />
              <FormControlLabel
                value="false"
                control={
                  <Radio
                    icon={<Cancel />}
                    checkedIcon={<Cancel />}
                    color="secondary"
                  />
                }
                label="Inactive"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAddProduct}
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
            onClick={handleAddProduct}
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

      {selectedProduct && (
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
            Product information
          </DialogTitle>
          <DialogContent>
            {/* <TextField
              label="ID"
              value={selectedProduct?.id}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            /> */}
            <Grid container spacing={2} margin={"normal"}>
              <Grid item xs={9}>
                <TextField
                  label="Product Name"
                  value={selectedProduct?.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={
                    selectedProduct?.expiryDate
                      ? format(
                          parseISO(selectedProduct.expiryDate),
                          "yyyy-MM-dd"
                        )
                      : ""
                  }
                  onChange={(e) => handleChange("expiryDate", e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: today,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} margin={"normal"}>
              <Grid item xs={4}>
                <TextField
                  label="Price"
                  value={selectedProduct?.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  type="number"
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Point"
                  value={selectedProduct?.point}
                  onChange={(e) => handleChange("point", e.target.value)}
                  type="number"
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Remain"
                  value={selectedProduct?.remain}
                  onChange={(e) => handleChange("remain", e.target.value)}
                  type="number"
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} margin="normal">
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedProduct?.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <MenuItem value={statusInStock}>IN STOCK</MenuItem>
                    <MenuItem value={statusComingSoon}>COMING SOON</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={selectedProduct?.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <MenuItem value={typeWHOLESALE}>WHOLESALE</MenuItem>
                    <MenuItem value={typeGIFT}>GIFT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedProduct?.category_id}
                    onChange={(e) =>
                      handleChange("category_id", e.target.value)
                    }
                  >
                    {Object.keys(categoryMap).map((key) => (
                      <MenuItem key={key} value={key}>
                        {categoryMap[key]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} margin="normal">
              <Grid item xs={4}>
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
              </Grid>

              <Grid item xs={4}>
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
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  label="Product Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  fullWidth
                  type="number"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={1.5}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Unit</InputLabel>
                  <Select value={unit} onChange={handleUnitChange}>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="ml">ml</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} margin="normal">
              <Grid item xs={6}>
                <Box>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option}
                    value={brandOrigin}
                    onChange={(event, newValue) => {
                      setBrandOrigin(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Brand Origin"
                        margin="normal"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ textAlign: "right" }}
                      >
                        {option}
                      </Box>
                    )}
                  />
                </Box>{" "}
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option}
                    value={manufacturedAt}
                    onChange={(event, newValue) => {
                      setManufacturedAt(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Manufactured At"
                        margin="normal"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ textAlign: "right" }}
                      >
                        {option}
                      </Box>
                    )}
                  />
                </Box>{" "}
              </Grid>
            </Grid>
            <TextField
              label="Manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Usage Instructions"
              value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Storage Instructions"
              value={storageInstructions}
              onChange={(e) => setStorageInstructions(e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2} margin={"normal"}>
              <Grid item xs={3}>
                <TextField
                  label="Created At"
                  value={new Date(
                    selectedProduct?.created_at
                  ).toLocaleDateString()}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Updated At"
                  value={new Date(
                    selectedProduct?.updated_at
                  ).toLocaleDateString()}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>

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
            <TextField
              label="Store"
              value={store.name_store}
              InputProps={{ readOnly: true }}
              fullWidth
              margin="normal"
            />
            {/* <FormControl fullWidth margin="normal">
              <InputLabel>Active</InputLabel>
              <Select
                value={selectedProduct?.is_active}
                onChange={(e) => handleChange("is_active", e.target.value)}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl> */}

            <FormControl component="fieldset" fullWidth margin="normal">
              <RadioGroup
                value={selectedProduct?.is_active}
                onChange={(e) => handleChange("is_active", e.target.value)}
                row
              >
                <FormControlLabel
                  value="true"
                  control={
                    <Radio
                      icon={<CheckCircle />}
                      checkedIcon={<CheckCircle />}
                      color="primary"
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  value="false"
                  control={
                    <Radio
                      icon={<Cancel />}
                      checkedIcon={<Cancel />}
                      color="secondary"
                    />
                  }
                  label="Inactive"
                />
              </RadioGroup>
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
    </div>
  );
}
