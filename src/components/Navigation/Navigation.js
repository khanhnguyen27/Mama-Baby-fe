import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/MailOutline";
import PhoneInTalk from "@mui/icons-material/PhoneInTalk";
import Cart from "@mui/icons-material/ShoppingCartOutlined";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import { Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo192.png";
import ProductSearch from "./ProductSearch";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null
  );
  const [anchorElLogout, setAnchorElLogout] = useState(null);
  const [openLogoutMenu, setOpenLogoutMenu] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('userInfo');
    // setIsLoggedIn(false);
    // setOpenLogoutMenu(false);
    // navigate('/signin')
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
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );
  const toggleCart = (anchor, open) => (event) => {
    navigate("/cart");
    return;
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("accessToken") !== null);
  }, [localStorage.getItem("accessToken")]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 120);
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

  return (
    <>
      <Box sx={{ flexGrow: 1, margin: "0", height: "60px" }}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#fff4fc",
            color: "black",
            padding: "4px 20px",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                fontSize: "18px",
                display: { xs: "none", md: "flex" },
              }}
            >
              <Link
                to="/introduction"
                style={{
                  color: "black",
                  textDecoration: "none",
                  transition: "color 0.2s ease-in-out",
                }}
              >
                Introduction
              </Link>
              <Link
                to="/promotion"
                style={{
                  color: "black",
                  textDecoration: "none",
                  transition: "color 0.2s ease-in-out",
                }}
              >
                Promotion
              </Link>
              <Link
                to="/policy"
                style={{
                  color: "black",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s ease-in-out",
                }}
              >
                Warranty Policy
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
              <Typography sx={{ padding: "0 10px" }}>
                Call us: 1900 0019
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
                          onClick={handleLogoutMenuOpen}
                          color="inherit"
                        >
                          <AccountCircle />
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
                      >
                        <AccountCircle />
                        <Typography style={{color: "inherit", paddingLeft: 10}}>Login</Typography>
                      </IconButton>
                    )}
                  </div>
                </Box>
              </>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ flexGrow: 1, mb: 2 }}>
        <AppBar
          position={visible ? "fixed" : "static"}
          sx={{
            backgroundColor: "white",
            color: "black",
            padding: "10px 50px",
            boxShadow: "none"
          }}
        >
          <Toolbar>
            <Toolbar>
              <Link
                to="/"
                style={{
                  display: { xs: "none", sm: "block" },
                  textDecoration: "none",
                  fontSize: "24px",
                  color: "black",
                  padding: visible ? "8px 0px" : "",
                }}
              >
                <img
                  src={Logo}
                  style={{ width: "98px", height: "64px" }}
                  alt="logo"
                />
              </Link>
            </Toolbar>

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
                display: { sm: "none", md: "flex" },
                justifyContent: "flex-end",
              }}
            >
              <IconButton size="large" color="inherit">
                <MailIcon style={{fontSize: 40}} />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                aria-label="open cart"
                style={{ position: "relative" }}
                onClick={toggleCart("right", true)}
              >
                <Cart style={{fontSize: 40}} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Navigation;
