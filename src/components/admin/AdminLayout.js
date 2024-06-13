import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import Dashboard from "@mui/icons-material/Dashboard";
import PersonIcon from '@mui/icons-material/Person';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import CategoryIcon from '@mui/icons-material/Category';
import Shop from "@mui/icons-material/Shop";
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
import Voucher from '@mui/icons-material/ConfirmationNumber';
const drawerWidth = 240;
const itemList = [
  {
    label: "Dashboard",
    Icon: Dashboard,
    href: "dashboard",
  },

  {
    label: "Accounts",
    Icon: AccountCircleIcon,
    href: "accounts",
  },
  
  {
    label: "Exchanges",
    Icon: DesignServicesIcon,
    href: "exchanges",
  },
  {
    label: "Stores",
    Icon: Shop,
    href: "stores",
  },

  {
    label: "Categories",
    Icon: CategoryIcon,
    href: "categories",
  },

  {
    label: "Brands",
    Icon: BrandingWatermarkIcon,
    href: "brands",
  },

  {
    label: "Age",
    Icon: PersonIcon,
    href: "age",
  },

  {
    label: "Vouchers",
    Icon: Voucher,
    href: "vouchers",
  },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/");
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

          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <div
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
        </div>
        <Divider color="black" sx={{ mt: 2 }} />
        <List>
          {itemList.map((item, index) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={pathname.includes(item.href)}
                onClick={() => {
                  navigate(item.href);
                }}
              >
                <ListItemIcon>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider color="black" sx={{ mt: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, backgroundColor: "#f5f7fd", p: 3 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
