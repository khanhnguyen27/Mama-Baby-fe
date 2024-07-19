import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Container, Typography } from "@mui/material";
import { regisStoreApi } from "../../api/StoreAPI";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { TextField, InputLabel } from "@mui/material";

const RegistStore = () => {
  window.document.title = "Regist For Seller and Store";
  const [storename, setStorename] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [image, setImage] = useState({
    file: null,
    url: "",
  });

  const validatePhoneNumber = (phone) => {
    const reg = /^[0-9]+$/;
    return reg.test(phone);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAgreeChange = (event) => {
    setAgreed(event.target.checked);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("You must agree to the terms and policies");
      return;
    }

    // Kiểm tra xem các trường đã được nhập đầy đủ chưa
    if (
      storename === "" ||
      address === "" ||
      description === "" ||
      phone === ""
    ) {
      toast.error("Please input all fields", { autoClose: 1500 });
      return;
    }

    // Kiểm tra phone có phải là số không
    if (!validatePhoneNumber(phone)) {
      toast.error("Phone must be a number");
      return;
    }

    setLoading(true);
    regisStoreApi(storename, address, description, phone, userId, image.file)
      .then((res) => {
        console.log(res);
        toast.success("Send request successfully!", { autoClose: 1500 });
        setTimeout(() => {
          setLoading(true);
        }, 2000);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Send request failed", { autoClose: 1500 });
      })
      .finally(() => {
        setLoading(false);
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

  return (
    <div style={{ backgroundColor: "#fdf5d7" }}>
      <div
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/office-supplies_23-2148103974.jpg')",
          minHeight: "100vh",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "50%",
            animation: "slideStoreRegist 1s ease-in-out",
            "@keyframes slideStoreRegist": {
              from: {
                transform: "translateY(50%)",
              },
              to: {
                transform: "translateX(0)",
              },
            },
          }}
        >
          {" "}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "4%",
              margin: "2rem 0",
              boxShadow: "0 2rem 3rem rgba(132, 139, 200, 0.25)",
              border: "3px solid #ff469e",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1
                style={{ color: "black", fontSize: "2.5em", fontWeight: "700" }}
              >
                Regis Store To Sell Product{" "}
              </h1>
            </div>
            <form onSubmit={handleLogin}>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                  }}
                >
                  Name Store <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="storename"
                  type="storename"
                  value={storename}
                  onChange={(e) => setStorename(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #ff469e",
                    borderRadius: "30px",
                    padding: "8px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#white",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#white",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #ff469e",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                  }}
                >
                  Address of Store <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #ff469e",
                    borderRadius: "30px",
                    padding: "5px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#white",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#white",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #ff469e",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                  }}
                >
                  Description of Store <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="description"
                  type="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #ff469e",
                    borderRadius: "30px",
                    padding: "5px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #ff469e",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                  }}
                >
                  Phone of Store <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="phone"
                  type="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disableUnderline
                  sx={{
                    border: "1px solid #ff469e",
                    borderRadius: "30px",
                    padding: "8px 14px",
                    fontSize: "18px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    transition: "box-shadow 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.24)",
                      animation: `glow 1.5s infinite`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#F8F8F8",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.32)",
                      animation: `glow 1.5s infinite`,
                      outline: "none",
                    },
                    "@keyframes glow": {
                      "0%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                      "50%": {
                        boxShadow: "0 0 5px #ff469e",
                      },
                      "100%": {
                        boxShadow: "0 0 3px #ff469e",
                      },
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                  }}
                >
                  Select The License <span style={{ color: "red" }}>*</span>
                </Typography>
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
              </FormControl>

              <div style={{ textAlign: "center", color: "#777" }}>
                By clicking Regist, you agree to the Terms, Main our privacy
                policy and Cookie Policy. &nbsp;
                <Link
                  to="#"
                  onClick={handleClickOpen}
                  style={{
                    textDecoration: "underline",
                    color: "#FF469e",
                  }}
                >
                  Find out more
                </Link>
                <Dialog open={open} onClose={handleClose} maxWidth="md">
                  <DialogTitle
                    style={{ backgroundColor: "#ff469e", color: "white" }}
                  >
                    Terms and Policies
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ fontSize: "18px", lineHeight: "1.5" }}
                    >
                      <Container sx={{ mt: 2 }}>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "600", color: "#ff469e" }}
                        >
                          I.Subscription Terms and Conditions:
                        </Typography>
                        <br />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            1/ Requirements and conditions to become a seller on
                            the platform:
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - Fill in accurate and up-to-date information in
                              the online registration form..
                            </Typography>
                            <Typography>
                              - Agree to the platform's terms and conditions,
                              privacy policy, and merchant agreements.
                            </Typography>
                          </Box>
                          <br />
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            2/ Necessary documents and information when
                            registering (business license).
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - Must have a valid business license if sold as a
                              business.
                            </Typography>
                            <Typography>
                              - Provide necessary documents, including proof of
                              identity and business license (if applicable)
                            </Typography>
                          </Box>
                        </Box>
                        <br />
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "600", color: "#ff469e" }}
                        >
                          II. Sales Policy:
                        </Typography>
                        <br />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            1/ Product listing process and order processing.
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - Products must be properly labeled with
                              nutritional information, expiration dates, and any
                              allergen warnings.
                            </Typography>
                            <Typography>
                              - Sellers need to provide detailed information
                              about the products to be sold, including
                              descriptions, images, prices, and other
                              information.
                            </Typography>
                            <br />
                          </Box>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "600", color: "#ff469e" }}
                        >
                          III. Fees and Payments:
                        </Typography>
                        <br />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            1/ Details of applicable fees (packages fee).
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - For newly registered and approved stores, there
                              will be 2 months of platform experience. After the
                              end of the 2 months, stores are required to
                              purchase the platform's sales service packages.
                            </Typography>
                            <br />
                          </Box>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "600", color: "#ff469e" }}
                        >
                          V. Privacy Policy:
                        </Typography>
                        <br />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            1/ Committed to protecting the seller's personal and
                            business information.
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - By using the Services, registering for an
                              account with us or accessing the platform, you
                              acknowledge and agree that you accept the
                              practices, requirements and/or policies described
                              in the Privacy Policy. this Privacy Policy, and
                              you hereby confirm that you have your full
                              knowledge and consent to our collection, use,
                              disclosure and/or processing of your personal data
                              as described herein. IF YOU DO NOT AGREE TO THE
                              PROCESSING OF YOUR PERSONAL DATA AS DESCRIBED IN
                              THIS POLICY, PLEASE DO NOT USE OUR SERVICES OR
                              ACCESS THE NOTES PLATFORM OR WEBSITE. If we change
                              our Privacy Policy, we will notify you including
                              by posting those changes or the revised Privacy
                              Policy on our platform. To the extent permitted by
                              law, your continued use of the Services or
                              Platform, including your transactions, constitutes
                              your acknowledgment and agreement to the changes
                              in this Privacy Policy.
                            </Typography>
                            <br />
                          </Box>
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            2/ Seller's obligation to comply with platform
                            regulations, ensure product quality and customer
                            service.
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - You agree not to provide us with any information
                              that is inaccurate or misleading and that you will
                              notify us of any inaccuracies or changes to the
                              information. We reserve the right in our sole
                              discretion to request other documents necessary to
                              verify any information you provide.
                            </Typography>
                            <br />
                          </Box>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "600", color: "#ff469e" }}
                        >
                          VI. Refund Policy:
                        </Typography>
                        <br />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            1/ Scope and subjects of application.
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              -This Return and Refund Policy stipulates the
                              rights and obligations of the Buyer to request a
                              return or refund as well as the rights and
                              obligations of Mamababy, the Seller, or relevant
                              parties in the process of resolving the request.
                              Buyer's request.
                            </Typography>
                            <br />
                          </Box>
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: "600" }}>
                            2/ No refunds on products that are gifts.
                          </Typography>
                          <Box sx={{ ml: 2, mt: 1 }}>
                            <Typography>
                              - Mamababy's refund policy does not apply to
                              products that are given as gifts.
                            </Typography>
                            <br />
                          </Box>
                        </Box>
                        <Box sx={{ py: 4 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#ff469e",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          >
                            Mama-Baby is very pleasure to serve you!
                          </Typography>
                        </Box>
                      </Container>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions
                    sx={{ textAlign: "left", justifyContent: "left", ml: 2 }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={agreed}
                          onChange={handleAgreeChange}
                          style={{ color: "#ff469e" }}
                        />
                      }
                      label="I agree to the terms and policies"
                    />
                  </DialogActions>
                </Dialog>
              </div>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!agreed} // Disable nút khi chưa đồng ý
                  sx={{
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    fontSize: 16,
                    width: "15vw",
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #white",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                >
                  Register
                </Button>
                <div
                  style={{
                    marginTop: "1rem",
                    color: "black",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                ></div>
              </div>
            </form>
          </div>
        </Box>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegistStore;
