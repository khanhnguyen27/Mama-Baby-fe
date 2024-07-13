import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, CircularProgress, Typography } from "@mui/material";
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
                  style={{ textDecoration: "underline", color: "#385898" }}
                >
                  Find out more
                </Link>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle
                    style={{ backgroundColor: "#ff469e", color: "white" }}
                  >
                    Terms and Policies
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      style={{ fontSize: "16px", lineHeight: "1.5" }}
                    >
                      Alerts are urgent interruptions, requiring
                      acknowledgement, that inform the user about a situation.
                      Most alerts don't need titles. They summarize a decision
                      in a sentence or two by either:
                      <ul>
                        <li>
                          Asking a question (for example "Delete this
                          conversation?")
                        </li>
                        <li>
                          Making a statement related to the action buttons
                        </li>
                      </ul>
                      Use title bar alerts only for high-risk situations, such
                      as the potential loss of connectivity. Users should be
                      able to understand the choices based on the title and
                      button text alone.
                      <br />
                      <br />
                      If a title is required:
                      <ul>
                        <li>
                          Use a clear question or statement with an explanation
                          in the content area, such as "Erase USB storage?"
                        </li>
                      </ul>
                      Avoid apologies, ambiguity, or questions, such as
                      "Warning!" or "Are you sure?"
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
                  Regist Store
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
