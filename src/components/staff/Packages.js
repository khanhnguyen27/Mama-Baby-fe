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
  Modal,
} from "@mui/material";
import { allPackageApi } from "../../api/PackagesAPI";
import { jwtDecode } from "jwt-decode";
import KeyboardCapslockIcon from "@mui/icons-material/KeyboardCapslock";
import { toast } from "react-toastify";
import { makePackagePaymentApi } from "../../api/VNPayAPI";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { createStorePackageApi } from "../../api/StorePackageAPI";

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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
  const handleOpenConfirm = (pkg) => {
    setSelectedPackage(pkg);
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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
    createStorePackageApi(selectedPackage.id, storeId, selectedPackage.price)
      .then((res) => {
        const storePackageId = res?.data?.data?.id;

        const finalAmount = selectedPackage.price;
        const bankCode = "VNBANK";
        makePackagePaymentApi(finalAmount, bankCode, storePackageId)
          .then((res) => {
            console.log("Payment initiation response:", res.data);
            toast.success("Now moving to payment page!", { autoClose: 1000 });
            setTimeout(() => {
              window.location.replace(res.data?.data?.payment_url);
            }, 1500);
          })
          .catch((error) => {
            console.error("There was an error initiating the payment!", error);
            console.error("Response data:", error.response.data);
            toast.error("Unable to initiate payment. Please try again later.");
          });
      })
      .catch((error) => console.log(error));
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
                  border: "1px solid white",
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
                    {formatCurrency(pkg.price)} / {pkg.month} month
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {pkg.description}
                  </Typography>
                  <Box sx={{ width: "100%", textAlign: "right"}}>
                  <Button
                    variant="outlined"
                    sx={{
                      ml: "auto",
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "30px",
                      fontSize: 15,
                      fontWeight: "bold",
                      mt: 2,
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
                    onClick={() => handleOpenConfirm(pkg)}
                  >
                    Buy Package
                  </Button>
                  </Box>
                  <Modal
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    slotProps={{
                      backdrop: {
                        style: {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        borderRadius: "20px",
                        backgroundColor: "#fff4fc",
                        border: "2px solid #ff469e",
                        boxShadow: 10,
                        p: 4,
                      }}
                    >
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Confirm Checkout
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to checkout for this package?
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "20px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 0.2,
                            mx: 1,
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={handleCheckout}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "#ff469e",
                            borderRadius: "20px",
                            fontSize: 16,
                            fontWeight: "bold",
                            my: 0.2,
                            mx: 1,
                            transition:
                              "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                              backgroundColor: "#ff469e",
                              color: "white",
                              border: "1px solid white",
                            },
                          }}
                          onClick={handleCloseConfirm}
                        >
                          No
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
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
