import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { allPackageApi } from "../../api/PackagesAPI";
import {jwtDecode} from "jwt-decode";
import KeyboardCapslockIcon from "@mui/icons-material/KeyboardCapslock";
import { toast } from "react-toastify"; 
import { makePackagePaymentApi } from "../../api/VNPayAPI";
import { storeByUserIdApi } from "../../api/StoreAPI";

export default function Package() {
  const navigate = useNavigate();
  window.document.title = "Your Requests";
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    allPackageApi()
      .then((response) => {
        setPackages(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the packages!", error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await storeByUserIdApi(userId);
        setStore(res?.data?.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStoreData();
  }, [userId]);
  const storeId = store?.id;
  console.log(storeId);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

const handleCheckout = (pkg) => {
    if (!accessToken) {
      toast.warn("Please login to continue your purchase", { autoClose: 1000 });
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      return;
    }

    if (!storeId) {
      toast.error("No store found for this user. Please try again later.");
      return;
    }

    const finalAmount = pkg.price;
    const bankCode = "VNBANK";
    const packageId = pkg.id;
    console.log("Package ID:", packageId); // Kiểm tra packageId
    console.log("User ID:", userId); // Kiểm tra userId
    console.log("Store ID:", storeId); // Kiểm tra storeId

    makePackagePaymentApi(finalAmount, bankCode, packageId, storeId) // Thêm storeId vào hàm này
      .then((res) => {
        console.log("Payment initiation response:", res.data);
        toast.success("Now moving to payment page!", { autoClose: 1000 });
        setTimeout(() => {
          window.location.replace(res.data?.data?.payment_url);
        }, 1);
      })
      .catch((error) => {
        console.error("There was an error initiating the payment!", error);
        console.error("Response data:", error.response.data);
        toast.error("Unable to initiate payment. Please try again later.");
      });
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "77vh",
          maxWidth: "100vw",
          backgroundColor: "#f5f7fd",
        }}
      >
        <CircularProgress sx={{ color: "#ff469e" }} size={90} />
      </Box>
    );
  }

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container
        sx={{
          my: 4,
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: 4,
          paddingBottom: "10px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            pt: 2,
            color: "#ff469e",
            fontWeight: "bold",
          }}
        >
          Packages For Your Store
        </Typography>
        <Grid container spacing={4}>
          {packages.map((pkg) => (
            <Grid item xs={12} md={4} key={pkg.id}>
              <Card
                sx={{
                  mb: "16px",
                  padding: "16px",
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: 4,
                  transition: "0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    border: "1px solid #ff469e",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#ff469e" }}
                  >
                    {pkg.package_name}
                  </Typography>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {formatCurrency(pkg.price)} /{pkg.month} month
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {pkg.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      textAlign: "right",
                      color: "#ff469e",
                      border: "1px solid #ff469e",
                      "&:hover": {
                        backgroundColor: "#ff469e",
                        color: "white",
                      },
                    }}
                    onClick={() => handleCheckout(pkg)}
                  >
                    Buy Package
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
            <KeyboardCapslockIcon />
          </IconButton>
        )}
      </Container>
    </div>
  );
}
