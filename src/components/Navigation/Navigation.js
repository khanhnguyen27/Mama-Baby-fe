import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Edit from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/MailOutline";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneInTalk from "@mui/icons-material/PhoneInTalk";
import Cart from "@mui/icons-material/ShoppingCart";
import CartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import { Container, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import ProductSearch from "./ProductSearch";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, selectCartAmount } from "../../redux/CartSlice";
import { ListAlt, RequestPage } from "@mui/icons-material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null
  );
  const username = localStorage.getItem("username");
  const [anchorElLogout, setAnchorElLogout] = useState(null);
  const [openLogoutMenu, setOpenLogoutMenu] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartAmount = useSelector(selectCartAmount);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    dispatch(clearCart());
    toast.success("Logout Successfully", { autoClose: 1000 });
    setIsLoggedIn(false);
    setOpenLogoutMenu(false);
    setTimeout(() => {
      navigate("/");
      console.log("Logout successfully");
    }, 1000);
  };

  const handleLogoutMenuOpen = (event) => {
    setAnchorElLogout(event.currentTarget);
    setOpenLogoutMenu(true);
  };
  const handleLogoutMenuClose = () => {
    setAnchorElLogout(null);
    setOpenLogoutMenu(false);
  };

  const renderLogoutMenu = (
    <Menu
      id="logout-menu"
      anchorEl={anchorElLogout}
      open={openLogoutMenu}
      onClose={handleLogoutMenuClose}
    >
      <MenuItem
        onClick={() => (
          pathname.includes("/staff")
            ? navigate("/staff/profile")
            : pathname.includes("/admin")
            ? navigate("/admin/profile")
            : navigate("/profile"),
          setAnchorElLogout(null),
          setOpenLogoutMenu(false)
        )}
        sx={{
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography
            style={{
              color: "inherit",
              paddingLeft: 10,
              fontWeight: "bold",
            }}
          >
            Profile
          </Typography>
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => (
          navigate("/orders"),
          window.scrollTo(
            { top: 0, behavior: "instant" },
            setAnchorElLogout(null),
            setOpenLogoutMenu(false)
          )
        )}
        sx={{
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <ListAlt fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography
            style={{
              color: "inherit",
              paddingLeft: 10,
              fontWeight: "bold",
            }}
          >
            Orders
          </Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => (
          navigate("/requests"),
          window.scrollTo(
            { top: 0, behavior: "instant" },
            setAnchorElLogout(null),
            setOpenLogoutMenu(false)
          )
        )}
        sx={{
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <RequestPage fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography
            style={{
              color: "inherit",
              paddingLeft: 10,
              fontWeight: "bold",
            }}
          >
            Requests
          </Typography>
        </ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => (
          navigate("/regisstore"),
          window.scrollTo(
            { top: 0, behavior: "instant" },
            setAnchorElLogout(null),
            setOpenLogoutMenu(false)
          )
        )}
        sx={{
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <AppRegistrationIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography
            style={{
              color: "inherit",
              paddingLeft: 10,
              fontWeight: "bold",
            }}
          >
            Regist Store
          </Typography>
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        sx={{
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography
            style={{
              color: "inherit",
              paddingLeft: 10,
              fontWeight: "bold",
            }}
          >
            Logout
          </Typography>
        </ListItemText>
      </MenuItem>
    </Menu>
  );
  // const toggleCart = (anchor, open) => (event) => {
  //   navigate("/cart");
  //   return;
  // };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("accessToken") !== null);
  }, [localStorage.getItem("accessToken")]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //   const handleProductOpen = (e) => {
  //     setAnchorEl(e.currentTarget);
  //     setOpenProductMenu(true);
  //   };

  //   const handleProductClose = () => {
  //     setAnchorEl(null);
  //     setOpenProductMenu(false);
  //   };

  //   useEffect(() => {
  //     const fetchProductData = async () => {
  //       try {
  //         const response = await axios.get(
  //           "https://kietpt.vn/api/classification?type=product"
  //         );
  //         const data = response.data;
  //         // const productObj = {}
  //         // data?.data.map(item => {
  //         //   productObj[item.classificationName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]+/g, "")] = item._id
  //         // })
  //         // console.log(JSON.stringify(productObj))
  //         setProductData(
  //           data.data.map((product) => {
  //             return {
  //               ...product,
  //               slugProductUrl: product.classificationName
  //                 .toLowerCase()
  //                 .replace(/\s+/g, "-")
  //                 .replace(/[^a-z0-9-]+/g, ""),
  //             };
  //           })
  //         );
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };
  //     fetchProductData();
  //   }, []);

  //   const handleRoomOpen = (e) => {
  //     setAnchorEl(e.currentTarget);
  //     setOpenRoomMenu(true);
  //   };

  //   const handleRoomClose = () => {
  //     setAnchorEl(null);
  //     setOpenRoomMenu(false);
  //   };

  //   useEffect(() => {
  //     const fetchRoomData = async () => {
  //       try {
  //         const response = await axios.get(
  //           "https://kietpt.vn/api/classification?type=room"
  //         );
  //         const data = response.data;
  //         setRoomData(
  //           data.data.map((room) => {
  //             // Create slug URL inline for clarity:
  //             return {
  //               ...room,
  //               slugRoomUrl: room.classificationName
  //                 .toLowerCase()
  //                 .replace(/\s+/g, "-")
  //                 .replace(/[^a-z0-9-]+/g, ""),
  //             };
  //           })
  //         );
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };
  //     fetchRoomData();
  //   }, []);

  const { pathname } = useLocation();
  if (pathname.includes("signin")) {
    return (
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <AppBar
          sx={{
            // backgroundColor: "#fffbfd",
            boxShadow: "none",
            position: "fixed",
            borderBottom: "1px solid #fffbfd",
            backgroundColor: "white"
          }}
        >
          <Container style={{ display: "flex", justifyContent: "space-between", height: "6rem", backgroundColor: "white" }}>
            <Link
              to="/"
              style={{
                display: { xs: "none", sm: "block" },
                textDecoration: "none",
                fontSize: "24px",
              }}
            >
              <img
                src={Logo}
                style={{ width: "80px", height: "80px", marginTop: "8px" }}
                alt="logo"
              />
            </Link>
          </Container>
        </AppBar>
      </Box>
    );
  }
  if (pathname.includes("signup")) {
    return (
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <AppBar
          sx={{
            // backgroundColor: "#fffbfd",
            boxShadow: "none",
            position: "fixed",
            borderBottom: "1px solid #fffbfd",
            backgroundColor: "white"
          }}
        >
          <Container style={{ display: "flex", justifyContent: "space-between", height: "6rem", backgroundColor: "white" }}>
            <Link
              to="/"
              style={{
                display: { xs: "none", sm: "block" },
                textDecoration: "none",
                fontSize: "24px",
              }}
            >
              <img
                src={Logo}
                style={{ width: "80px", height: "80px", marginTop: "8px" }}
                alt="logo"
              />
            </Link>
          </Container>
        </AppBar>
      </Box>
    );
  }
  if (pathname.includes("staff")) {
    return (
      // <Box sx={{ flexGrow: 1, mb: 2 }}>
      //   <AppBar
      //     sx={{
      //       backgroundColor: "white",
      //       color: "black",
      //       padding: "10px 80px",
      //       boxShadow: "none",
      //       position: "fixed",
      //       height: "90px",
      //       borderBottom: "1px solid #fffbfd",
      //     }}
      //   >
      //     <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
      //       <Link
      //         to="/staff"
      //         style={{
      //           display: { xs: "none", sm: "block" },
      //           textDecoration: "none",
      //           fontSize: "24px",
      //         }}
      //       >
      //         <img
      //           src={Logo}
      //           style={{ width: "80px", height: "80px", marginTop: "8px" }}
      //           alt="logo"
      //         />
      //       </Link>
      //       {isLoggedIn && (
      //         <>
      //           <div>
      //             <IconButton
      //               size="large"
      //               edge="end"
      //               aria-label="account of current user"
      //               aria-haspopup="true"
      //               color="inherit"
      //               onClick={handleLogoutMenuOpen}
      //               sx={{
      //                 borderRadius: 2,
      //                 height: 40,
      //                 marginRight: "1rem",
      //                 backgroundColor: "white",
      //                 color: "#ff469e",
      //                 border: "1px solid #ff469e",
      //                 transition:
      //                   "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
      //                 "&:hover": {
      //                   backgroundColor: "#ff469e",
      //                   color: "white",
      //                   border: "1px solid #ff469e",
      //                 },
      //               }}
      //             >
      //               <AccountCircle />
      //               <Typography
      //                 style={{
      //                   color: "inherit",
      //                   paddingLeft: 10,
      //                   fontWeight: "bold",
      //                 }}
      //               >
      //                 {username}
      //               </Typography>
      //             </IconButton>
      //             {renderLogoutMenu}
      //           </div>
      //         </>
      //       )}
      //       {!isLoggedIn && (
      //         <IconButton
      //           size="large"
      //           edge="end"
      //           aria-label="account of current user"
      //           aria-haspopup="true"
      //           color="inherit"
      //           component={Link}
      //           to="signin"
      //           sx={{
      //             borderRadius: 2,
      //             height: 40,
      //             marginRight: "1rem",
      //             transition:
      //               "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
      //             "&:hover": {
      //               backgroundColor: "white",
      //               color: "#ff469e",
      //             },
      //           }}
      //         >
      //           <AccountCircle />
      //           <Typography
      //             style={{
      //               color: "inherit",
      //               paddingLeft: 10,
      //               fontWeight: "bold",
      //             }}
      //           >
      //             Login
      //           </Typography>
      //         </IconButton>
      //       )}
      //     </Toolbar>
      //   </AppBar>
      // </Box>
      <></>
    );
  }
  if (pathname.includes("admin")) {
    return (
      // <Box sx={{ flexGrow: 1, mb: 2 }}>
      //   <AppBar
      //     sx={{
      //       backgroundColor: "white",
      //       color: "black",
      //       padding: "10px 80px",
      //       boxShadow: "none",
      //       position: "fixed",
      //       height: "90px",
      //       borderBottom: "1px solid #fffbfd",
      //     }}
      //   >
      //     <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
      //       <Link
      //         to="/admin"
      //         style={{
      //           display: { xs: "none", sm: "block" },
      //           textDecoration: "none",
      //           fontSize: "24px",
      //         }}
      //       >
      //         <img
      //           src={Logo}
      //           style={{ width: "80px", height: "80px", marginTop: "8px" }}
      //           alt="logo"
      //         />
      //       </Link>
      //       {isLoggedIn && (
      //         <>
      //           <div>
      //             <IconButton
      //               size="large"
      //               edge="end"
      //               aria-label="account of current user"
      //               aria-haspopup="true"
      //               color="inherit"
      //               onClick={handleLogoutMenuOpen}
      //               sx={{
      //                 borderRadius: 2,
      //                 height: 40,
      //                 marginRight: "1rem",
      //                 backgroundColor: "white",
      //                 color: "#ff469e",
      //                 border: "1px solid #ff469e",
      //                 transition:
      //                   "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
      //                 "&:hover": {
      //                   backgroundColor: "#ff469e",
      //                   color: "white",
      //                   border: "1px solid #ff469e",
      //                 },
      //               }}
      //             >
      //               <AccountCircle />
      //               <Typography
      //                 style={{
      //                   color: "inherit",
      //                   paddingLeft: 10,
      //                   fontWeight: "bold",
      //                 }}
      //               >
      //                 {username}
      //               </Typography>
      //             </IconButton>
      //             {renderLogoutMenu}
      //           </div>
      //         </>
      //       )}
      //       {!isLoggedIn && (
      //         <IconButton
      //           size="large"
      //           edge="end"
      //           aria-label="account of current user"
      //           aria-haspopup="true"
      //           color="inherit"
      //           component={Link}
      //           to="signin"
      //           sx={{
      //             borderRadius: 2,
      //             height: 40,
      //             marginRight: "1rem",
      //             transition:
      //               "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
      //             "&:hover": {
      //               backgroundColor: "white",
      //               color: "#ff469e",
      //             },
      //           }}
      //         >
      //           <AccountCircle />
      //           <Typography
      //             style={{
      //               color: "inherit",
      //               paddingLeft: 10,
      //               fontWeight: "bold",
      //             }}
      //           >
      //             Login
      //           </Typography>
      //         </IconButton>
      //       )}
      //     </Toolbar>
      //   </AppBar>
      // </Box>
      <></>
    );
  }
  return (
    <>
      <Box
        sx={{ flexGrow: 1, margin: "0", height: "60px", marginBottom: "8px" }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#ff469e",
            color: "white",
            padding: "4px 0px",
            boxShadow: "none",
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: "4rem",
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                fontSize: "18px",
                display: { xs: "none", md: "flex" },
              }}
            >
              <Link to="/introduction" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    color: "white",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: 20,
                    "&:hover": {
                      textDecoration: "underline",
                      scale: "1.1",
                      fontWeight: "500",
                    },
                  }}
                >
                  Introduction
                </Typography>
              </Link>
              <Link
                to="/promotion"
                style={{
                  textDecoration: "none",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: 20,
                    "&:hover": {
                      textDecoration: "underline",
                      scale: "1.1",
                      fontWeight: "500",
                    },
                  }}
                >
                  Promotion
                </Typography>
              </Link>
              <Link
                to="/policy"
                style={{
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    transition:
                      "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                    fontSize: 20,
                    "&:hover": {
                      textDecoration: "underline",
                      scale: "1.1",
                      fontWeight: "500",
                    },
                  }}
                >
                  Warranty Policy
                </Typography>
              </Link>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PhoneInTalk />
              <Typography sx={{ padding: "5px 10px", fontWeight: "600" }}>
                Customer care: 1900 0019
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <>
                {/* Phần AppBar và Toolbar */}
                <Box sx={{ display: "flex", flexGrow: 1 }}>
                  <div>
                    {isLoggedIn && (
                      <>
                        <IconButton
                          size="large"
                          edge="end"
                          aria-label="account of current user"
                          aria-haspopup="true"
                          color="inherit"
                          onClick={handleLogoutMenuOpen}
                          sx={{
                            borderRadius: 2,
                            height: 40,
                            transition:
                              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            "&:hover": {
                              backgroundColor: "white",
                              color: "#ff469e",
                            },
                          }}
                        >
                          <AccountCircle />
                          <Typography
                            style={{
                              color: "inherit",
                              paddingLeft: 10,
                              fontWeight: "bold",
                            }}
                          >
                            {username}
                          </Typography>
                        </IconButton>
                        {/* Render menu Logout */}
                        {renderLogoutMenu}
                      </>
                    )}
                    {!isLoggedIn && (
                      <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        component={Link}
                        to="signin"
                        sx={{
                          borderRadius: 2,
                          height: 40,
                          transition:
                            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#ff469e",
                          },
                        }}
                      >
                        <AccountCircle />
                        <Typography
                          style={{
                            color: "inherit",
                            paddingLeft: 10,
                            fontWeight: "bold",
                          }}
                        >
                          Login
                        </Typography>
                      </IconButton>
                    )}
                  </div>
                </Box>
              </>
            </Box>
          </Container>
        </AppBar>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position={visible ? "fixed" : "static"}
          sx={{
            backgroundColor: "white",
            color: "black",
            padding: "10px 40px",
            boxShadow: "none",
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: "5.5rem",
            }}
          >
            <Link
              to="/"
              style={{
                display: { xs: "none", sm: "block" },
                textDecoration: "none",
                fontSize: "24px",
                color: "black",
              }}
            >
              <img
                src={Logo}
                style={{ width: "80px", height: "80px" }}
                alt="logo"
              />
            </Link>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <ProductSearch />
            </Box>
            <Box
              sx={{
                display: { sm: "flex" },
                justifyContent: "flex-end",
              }}
            >
              <IconButton
                size="large"
                color="inherit"
                onClick={() => (
                  navigate("/history/comment"),
                  window.scrollTo({ top: 0, behavior: "instant" })
                )}
              >
                <span
                  style={{
                    position: "absolute",
                    width: "2px",
                    height: "2px",
                    fontSize: "22px",
                    color: "#fbafcb",
                    top: "0",
                    right: 10,
                    fontWeight: 700,
                  }}
                ></span>
                <ChatIcon style={{ fontSize: 30, color: "#ff469e" }} />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                aria-label="open cart"
                style={{ position: "relative" }}
                // onClick={toggleCart("right", true)}
                onClick={() => (
                  navigate("/cart"),
                  window.scrollTo({ top: 0, behavior: "instant" })
                )}
                sx={{ marginLeft: "8px" }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: "2px",
                    height: "2px",
                    fontSize: "22px",
                    color: "#fbafcb",
                    top: "0",
                    right: 10,
                    fontWeight: 700,
                  }}
                >
                  {cartAmount}
                </span>
                {cartAmount >= 1 ? (
                  <Cart style={{ fontSize: 30, color: "#ff469e" }} />
                ) : (
                  <CartOutlined style={{ fontSize: 30, color: "#ff469e" }} />
                )}
              </IconButton>
            </Box>
          </Container>
        </AppBar>
      </Box>
    </>
  );
};

export default Navigation;
