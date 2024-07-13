import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo2 from "../../assets/logo2.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import Dashboard from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import Edit from "@mui/icons-material/Edit";
import ArticleIcon from "@mui/icons-material/Article";
import Voucher from "@mui/icons-material/ConfirmationNumber";
import Refund from "@mui/icons-material/CurrencyExchange";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { storeByUserIdApi } from "../../api/StoreAPI";
import Tooltip from "@mui/material/Tooltip";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SellIcon from '@mui/icons-material/Sell';
import PortraitIcon from '@mui/icons-material/Portrait';

const drawerWidth = 260;
const itemList = [
  {
    label: "Dashboard",
    Icon: Dashboard,
    href: "dashboard",
  },
  {
    label: "Profile",
    Icon: PortraitIcon,
    href: "storeprofile",
  },
  {
    label: "Products",
    Icon: Inventory2Icon,
    href: "products",
  },
  {
    label: "Orders",
    Icon: Edit,
    href: "orders",
  },
  {
    label: "Exchanges",
    Icon: DesignServicesIcon,
    href: "exchanges",
  },
  {
    label: "Refunds",
    Icon: Refund,
    href: "refunds",
  },
  {
    label: "Vouchers",
    Icon: Voucher,
    href: "vouchers",
  },
  {
    label: "Articles",
    Icon: ArticleIcon,
    href: "articles",
  },
  {
    label: "Packages",
    Icon: SellIcon,
    href: "packages",
  },
];

export default function StaffLayout() {
  const { pathname } = useLocation();
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [store, setStore] = useState([]);

  useEffect(() => {
    setTimeout(() => {}, 1000);
    storeByUserIdApi(userId).then((res) => {
      setStore(res?.data?.data);
    });
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logout Successfully", { autoClose: 1000 });
    setTimeout(() => {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
      console.log("Logout successfully");
    }, 1000);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      />
      <Drawer
        sx={{
          width: drawerWidth,
          boxShadow: "1px 6px 10px rgba(0, 0, 0.24)",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* <div
          style={{ display: "flex", flexDirection: "row", textAlign: "center" }}
        >
          <img
            src={Logo}
            style={{ width: "80px", height: "80px", my: 1, pt: 1 }}
            alt="logo"
          />
          <Typography sx={{ alignSelf: "center" }}>
            Welcome, {username}
          </Typography>
        </div> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            backgroundColor: "#ff469e",
            color: "white",
            minHeight: "120px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            borderBottom: "1px solid #ff469e",
          }}
        >
          <img
            src={Logo2}
            style={{
              width: "90px",
              height: "90px",
              my: 1,
              pt: 1,
              borderRadius: "10px",
            }}
            alt="logo"
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.25rem",
                color: "white",
              }}
            >
              Welcome, <span style={{ fontWeight: "bold" }}>{username}</span>
            </Typography>
            {!store.is_active && (
              <Tooltip title="Your store is currently blocked" arrow>
                <ErrorOutlineIcon
                  sx={{
                    fontSize: "1.5rem",
                    color: "yellow",
                    ml: 1,
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "2px solid yellow",
                    padding: "2px",
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
        <List>
          {itemList.map((item, index) => (
            <ListItem key={item.label} sx={{ px: 2, py: 0.4 }}>
              <ListItemButton
                selected={pathname.includes(item.href)}
                onClick={() => {
                  navigate(item.href);
                }}
                sx={{
                  borderRadius: "10px",
                  border: "1px solid white",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    border: "1px solid #ff469e",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#ff469e",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText>
                  <Typography sx={{ fontWeight: "600" }}>
                    {item.label}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider color="black" sx={{ mt: 2 }} />
        <List>
          <ListItem sx={{ px: 2, py: 0.4 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                border: "1px solid white",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontWeight: "600" }}>Logout</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f7fd",
          minHeight: "100vh",
          height: "100%",
          minWidth: 650,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
