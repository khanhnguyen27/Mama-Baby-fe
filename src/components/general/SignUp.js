import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Eye from "@mui/icons-material/Visibility";
import EyeSlash from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, CircularProgress, Typography } from "@mui/material";
import { allUserApi, signupApi } from "../../api/UserAPI";

const SignUp = () => {
  window.document.title = "Sign Up";
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

  const handleSignUp = (e) => {
    e.preventDefault();
    if (username.length < 6) {
      toast.error("Username's length is at least 6 characters", {
        autoClose: 1500,
      });
      return;
    }
    if (username.includes(" ")) {
      toast.error("Username cannot contain space characters", {
        autoClose: 1500,
      });
      return;
    }
    if (password.length < 8 || retype.length < 8) {
      toast.error(
        "Password's length and confirm's password is at least 8 characters",
        {
          autoClose: 1500,
        }
      );
      return;
    }
    if (retype !== password) {
      toast.error("Confirm password must be the same as password", {
        autoClose: 1500,
      });
      return;
    }
    if (phone.length < 9 || phone.length > 11 || !/^\d+$/.test(phone)) {
      toast.error("Phone must be digit and its length is 9 - 11 characters", {
        autoClose: 1500,
      });
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
      toast.error("Please input all fields", { autoClose: 1500 });
      return;
    }
    try {
      const response = allUserApi();

      if (response?.data?.data?.some((item) => item.username === username)) {
        toast.error("This username is already existed", {
          autoClose: 1500,
        });
        return;
      }

      if (response?.data?.data?.some((item) => item.phone_number === phone)) {
        toast.error("This phone is already used", {
          autoClose: 1500,
        });
        return;
      }
      signupApi(username, password, retype, fullname, address, phone)
        .then((response) => {
          console.log("Sign Up Successfully", response);
          toast.success(`Sign Up Successfully`, { autoClose: 1500 });
          setTimeout(() => {
            setLoading(true);
          }, 2000);
          setTimeout(() => {
            navigate("/signin");
          }, 5000);
        })
        .catch((error) => {
          console.error("Sign Up Failed", error);
          toast.error("Sign Up Failed.", { autoClose: 1500 });
        });
    } catch (error) {
      console.error("Error fetching user data", error);
      toast.error("Error checking username availability", { autoClose: 1500 });
    }
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

  return (
    <div style={{ marginTop: "7rem" }}>
      <div
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-simple-cartoon-childlike-mother-and-baby-image_11542.jpg')",
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
            animation: "slideSignup 1s ease-in-out",
            "@keyframes slideSignup": {
              from: {
                transform: "translateX(50%)",
              },
              to: {
                transform: "translateX(0)",
              },
            },
          }}
        >
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
            <form onSubmit={handleSignUp}>
              <FormControl sx={{ mb: 3 }} fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    textAlign: "left",
                    paddingBottom: 1,
                    fontWeight: "700",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Username <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (At least 6 characters and no spaces)
                  </span>
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
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Password <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (At least 8 characters)
                  </span>
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
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (Re-type your password)
                  </span>
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
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Phone <span style={{ color: "red" }}>*</span>
                  </span>{" "}
                  <span
                    style={{ fontSize: "14px", fontWeight: 0, opacity: 0.3 }}
                  >
                    (9 - 11 digits)
                  </span>
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
                  <Typography
                    onClick={() => (
                      navigate("/signin"),
                      window.scrollTo({
                        top: 0,
                        behavior: "instant",
                      })
                    )}
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      cursor: "pointer",
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
                </div>
              </div>
            </form>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SignUp;
