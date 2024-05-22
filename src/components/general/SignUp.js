import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Eye from "@mui/icons-material/Visibility";
import EyeSlash from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, CircularProgress, Typography } from "@mui/material";
import { signupApi } from "../../api/UserAPI";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // if (!handleValidationEmail()) {
    //   return;
    // }
    if (retype !== password) {
      toast.error("Retype password must be the same as password");
      return;
    }
    if (
      username == "" ||
      password == "" ||
      retype == "" ||
      fullname == "" ||
      address == "" ||
      phone == ""
    ) {
      toast.error("Please input all fields");
      return;
    }
    signupApi(username, password, retype, fullname, address, phone)
      .then((response) => {
        console.log("Day la khi sign up", response);
        toast.success(`Sign Up Successfully`);
        setTimeout(() => {
          setLoading(true);
        }, 2000);
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      })
      .catch((error) => {
        console.error("Sign Up failed", error);
        toast.error("Sign Up Failed.");
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          maxWidth: "100vw",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress sx={{ color: "#ff469e" }} size={100} />
      </Box>
    );
  }

  // const handleValidationEmail = () => {
  //   const emailPattern = /^[\w-]+(\.[\w-]+)*@(gmail\.com)$/;

  //   if (!email) {
  //     toast.error("An email is required!");
  //     return false;
  //   } else if (!emailPattern.test(email)) {
  //     toast.error("An invalid email format! (must be @gmail.com)");
  //     return false;
  //   }
  //   return true;
  // };

  return (
    <div style={{ marginTop: "7rem" }}>
      <div
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-simple-cartoon-childlike-mother-and-baby-image_11542.jpg')",
          minHeight: "100vh", // Set minimum height to cover the entire viewport
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
              backgroundColor: "#fce3ef",
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
                Sign Up{" "}
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
                  Username <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="username"
                  type="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  Password <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  endAdornment={
                    <IconButton
                      sx={{ color: "#ff469e" }}
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </IconButton>
                  }
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
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="retype"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={retype}
                  onChange={(e) => setRetype(e.target.value)}
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
                  endAdornment={
                    <IconButton
                      sx={{ color: "#ff469e" }}
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </IconButton>
                  }
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
                  Full Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="fullname"
                  type="fullname"
                  placeholder="Full Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
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
                  Address <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="address"
                  type="address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  Phone <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                  id="phone"
                  type="phone"
                  placeholder="Phone"
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
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                >
                  Create Account
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
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    onClick={() => window.scrollTo(0.0)}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                        transition:
                          "color 0.3s ease-in-out, scale 0.3s ease-in-out",
                        paddingLeft: "10px",
                        "&:hover": {
                          color: "#ff469e",
                          scale: "1.08",
                        },
                      }}
                    >
                      Sign in now
                    </Typography>
                  </Link>
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

export default SignUp;
