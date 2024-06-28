import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Eye from "@mui/icons-material/Visibility";
import EyeSlash from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, CircularProgress, Typography } from "@mui/material";
import { loginApi } from "../../api/UserAPI";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  window.document.title = "Sign In";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // if (!handleValidationEmail()) {
    //   return;
    // }
    if (!username) {
      toast.error("The username is required", { autoClose: 1500 });
      return;
    }
    if (!password) {
      toast.error("The password is required", { autoClose: 1500 });
      return;
    }
    loginApi(username, password)
      .then((res) => {
        const accessToken = res?.data?.data;
        const decodedAccessToken = jwtDecode(accessToken);
        const username = decodedAccessToken.username;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", username);
        toast.success(`Login Successfully: Welcome ${username}`, {
          autoClose: 1500,
        });
        setTimeout(() => {
          setLoading(true);
        }, 2000);
        setTimeout(() => {
          console.log("Decoded AccessToken:", decodedAccessToken);
          console.log("Login successful", res);
          if (decodedAccessToken?.RoleID === "STAFF") {
            navigate("/staff");
          } else if (decodedAccessToken?.RoleID === "ADMIN") {
            navigate("/admin");
          } else if (decodedAccessToken?.RoleID === "MEMBER") {
            navigate("/");
          } else {
            navigate("/signin");
          }
        }, 5000);
      })
      .catch((error) => {
        console.error("Login failed", error);
        toast.error(
          "Login failed: Please check your username, password and try again.",
          { autoClose: 1500 }
        );
      });
  };

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
      {loading ? (
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
          <CircularProgress sx={{ color: "#ff469e" }} size={90} />
        </Box>
      ) : (
        <div
          style={{
            backgroundImage:
              "url('https://png.pngtree.com/thumb_back/fh260/background/20190221/ourmid/pngtree-simple-cartoon-childlike-mother-and-baby-image_11542.jpg')",
            height: "77vh",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "50%" }}>
            <div
              style={{
                backgroundColor: "#fce3ef",
                borderRadius: "10px",
                padding: "4%",
                boxShadow: "0 2rem 3rem rgba(132, 139, 200, 0.25)",
                border: "3px solid #ff469e",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h1
                  style={{
                    color: "black",
                    fontSize: "2.5em",
                    fontWeight: "700",
                  }}
                >
                  Sign In{" "}
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
                    Username
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
                    Password
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

                {/* <Typography sx={{textAlign: "left", "&:hover":{color: "#ff469e", cursor: "pointer"}}}>Forgot Password?</Typography> */}

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: "white",
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
                    Login
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
                    Don't have an account?
                    <Typography
                      onClick={() => (
                        navigate("/signup"),
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
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
                      Sign up now
                    </Typography>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default SignIn;
