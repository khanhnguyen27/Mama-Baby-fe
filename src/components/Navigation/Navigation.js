import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Edit from "@mui/icons-material/Edit";
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
import TidioChatScript from "../../Chat/TidioChatScript ";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null
  );

  const username = localStorage.getItem("username");
  const [anchorElHeader, setAnchorElHeader] = useState(null);
  const [openHeaderMenu, setOpenHeaderMenu] = useState(false);
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
      window.scrollTo({ top: 0, behavior: "instant" });
      console.log("Logout successfully");
    }, 1000);
  };

  const handleHeaderMenuOpen = (e) => {
    setAnchorElHeader(e.currentTarget);
    setOpenHeaderMenu(true);
  };
  const handleHeaderMenuClose = () => {
    setAnchorElHeader(null);
    setOpenHeaderMenu(false);
  };

  const handleLogoutMenuOpen = (e) => {
    setAnchorElLogout(e.currentTarget);
    setOpenLogoutMenu(true);
  };
  const handleLogoutMenuClose = () => {
    setAnchorElLogout(null);
    setOpenLogoutMenu(false);
  };

  const renderHeaderMenu = (
    <Menu
      id="header-menu"
      anchorEl={anchorElHeader}
      open={openHeaderMenu}
      onClose={handleHeaderMenuClose}
    >
      <MenuItem
        onClick={() => (
          navigate("/introduction"),
          window.scrollTo(
            { top: 0, behavior: "instant" },
            setAnchorElHeader(null),
            setOpenHeaderMenu(false)
          )
        )}
        sx={{
          fontWeight: "bold",
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        Introduction
      </MenuItem>
      <MenuItem
        onClick={() => (
          navigate("/promotion"),
          window.scrollTo(
            { top: 0, behavior: "instant" },
            setAnchorElHeader(null),
            setOpenHeaderMenu(false)
          )
        )}
        sx={{
          fontWeight: "bold",
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        Promotion
      </MenuItem>
      <MenuItem
        onClick={() => (
          navigate("/policy"),
          window.scrollTo(
            { top: 0, behavior: "instant" },
            setAnchorElHeader(null),
            setOpenHeaderMenu(false)
          )
        )}
        sx={{
          fontWeight: "bold",
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "white",
            color: "#ff469e",
          },
        }}
      >
        Warranty Policy
      </MenuItem>
    </Menu>
  );

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
            Register Store
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

  const { pathname } = useLocation();
  if (pathname.includes("signin")) {
    return (
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <AppBar
          sx={{
            boxShadow: "none",
            position: "fixed",
            borderBottom: "1px solid #fffbfd",
            backgroundColor: "white",
          }}
        >
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "6rem",
              backgroundColor: "white",
            }}
          >
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
            boxShadow: "none",
            position: "fixed",
            borderBottom: "1px solid #fffbfd",
            backgroundColor: "white",
          }}
        >
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "6rem",
              backgroundColor: "white",
            }}
          >
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
        sx={{ flexGrow: 1, margin: "0", height: visible ? "10.5rem" : "60px", marginBottom: "8px" }}
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
                display: "flex",
              }}
            >
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleHeaderMenuOpen}
                sx={{
                  display: { sm: "flex", md: "none" },
                  borderRadius: 2,
                  color: "white",
                  height: 40,
                  transition:
                    "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#ff469e",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              {renderHeaderMenu}
              <Typography
                onClick={() => navigate("/introduction")}
                sx={{
                  textDecoration: "none",
                  display: { xs: "none", sm: "none", md: "flex" },
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                  fontSize: "1.15rem",
                  "&:hover": {
                    scale: "1.1",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 2,
                    backgroundColor: "white",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom right",
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
                  },
                }}
              >
                Introduction
              </Typography>
              <Typography
                sx={{
                  paddingBottom: "4px",
                  fontWeight: "600",
                  display: { xs: "none", sm: "none", md: "flex" },
                }}
              >
                |
              </Typography>
              <Typography
                onClick={() => navigate("/promotion")}
                sx={{
                  textDecoration: "none",
                  display: { xs: "none", sm: "none", md: "flex" },
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                  fontSize: "1.15rem",
                  "&:hover": {
                    scale: "1.1",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 2,
                    backgroundColor: "white",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom right",
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
                  },
                }}
              >
                Promotion
              </Typography>
              <Typography
                sx={{
                  paddingBottom: "4px",
                  fontWeight: "600",
                  display: { xs: "none", sm: "none", md: "flex" },
                }}
              >
                |
              </Typography>
              <Typography
                onClick={() => navigate("/policy")}
                sx={{
                  textDecoration: "none",
                  display: { xs: "none", sm: "none", md: "flex" },
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                  fontSize: "1.15rem",
                  "&:hover": {
                    scale: "1.1",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 2,
                    backgroundColor: "white",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom right",
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
                  },
                }}
              >
                Warranty Policy
              </Typography>
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
              <Typography
                sx={{
                  padding: "5px 10px",
                  fontWeight: "600",
                  display: { xs: "none", md: "block" },
                }}
              >
                Customer care: 1900 0019
              </Typography>
              <Typography
                sx={{
                  padding: "5px 10px",
                  fontWeight: "600",
                  display: { xs: "block", md: "none" },
                }}
              >
                : 1900 0019
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: { xs: "flex" }, flexGrow: 1 }}>
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
                            backgroundColor: "#fff4fc",
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
                          backgroundColor: "#fff4fc",
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
            padding: "10px 0px",
            boxShadow: 1,
            opacity: visible ? 0.98 : 1
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
                flexBasis: "90%",
              }}
            >
              <ProductSearch />
            </Box>
            <Box
              sx={{
                display: { sm: "flex" },
                justifyContent: "flex-start",
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
      {/* <TidioChatScript /> */}
    </>
  );
};

export default Navigation;
