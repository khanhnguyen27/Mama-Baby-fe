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
import { jwtDecode } from "jwt-decode";
const RegistStore = () => {
  window.document.title = "Sign Up";
  const [storename, setStorename] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;

  // Hàm kiểm tra phone có phải là số không
  const validatePhoneNumber = (phone) => {
    const reg = /^[0-9]+$/;
    return reg.test(phone);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Kiểm tra xem các trường đã được nhập đầy đủ chưa
    if (storename === "" || address === "" || description === "" || phone === "") {
      toast.error("Please input all fields", { autoClose: 2500 });
      return;
    }

    // Kiểm tra phone có phải là số không
    if (!validatePhoneNumber(phone)) {
      toast.error("Phone must be a number");
      return;
    }

    // Nếu điều kiện hợp lệ, thực hiện gọi API
    setLoading(true);
    regisStoreApi(storename, address, description, phone, userId)
      .then((res) => {
        console.log(res);
        toast.success("Send request successfully!");
        // Sau khi gọi API thành công, bạn có thể điều hướng người dùng đến trang khác
        // navigate('/some-path');
      })
      .catch((err) => {
        console.error(err);
        toast.error("Send request failed");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div style={{ marginTop: "3rem" }}>
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
        <div style={{ width: "50%" }}>
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

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button
                  variant="contained"
                  type="submit"
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
                  Regis
                </Button>
                <div
                  style={{
                    marginTop: "1rem",
                    color: "black",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegistStore;
