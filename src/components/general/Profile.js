import React, { useEffect, useRef, useState } from "react";
import { profileUserApi, updateAccount } from "../../api/UserAPI";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Box,
  Container,
  Modal,
  DialogTitle,
  DialogContent,
  TextField,
  Dialog,
  DialogActions,
  Button,
  Tabs,
  Tab,
  makeStyles,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openSetting, setOpenSetting] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectUser, setSelectUser] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [rotate, setRotate] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchData = async () => {
    try {
      profileUserApi()
        .then((res) => setUser(res?.data?.data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  window.document.title = `${user?.username}`;

  const handleOpenSetting = () => {
    setOpenSetting(true);
    setSelectUser(user);
    setRotate(!rotate);
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
    setSelectUser(null);
    setRotate(!rotate);
  };

  const handleSave = () => {
    if (tabIndex === 0) {
      handleSaveBasicInfo();
    } else if (tabIndex === 1) {
      handleChangePassword();
    }
  };

  const handleSaveBasicInfo = () => {
    const phoneNumberRegex = /^[0-9]{10}$/;

    if (!selectUser.full_name) {
      toast.error("Full Name is required");
      return;
    }
    if (!selectUser.address) {
      toast.error("Address is required");
      return;
    }
    if (!selectUser.phone_number) {
      toast.error("Phone Number is required");
      return;
    }

    if (!phoneNumberRegex.test(selectUser.phone_number)) {
      toast.error("Phone Number must be a 10-digit number");
      return;
    }
    updateAccount(
      selectUser.username,
      selectUser.full_name,
      "",
      selectUser.address,
      selectUser.phone_number
    )
      .then((res) => {
        toast.success("Update successfully");
        fetchData();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          toast.error(err.response.data);
        } else {
          toast.error("Update failed");
        }
        console.log(err);
      });
  };

  const handleChangePassword = () => {
    if (!passwords.currentPassword) {
      toast.warn("Current password is required!");
      return;
    }
    if (!passwords.newPassword) {
      toast.warn("New password is required!");
      return;
    }
    if (!passwords.confirmPassword) {
      toast.warn("Confirm password is required!");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.warn("New password must be at least 8 characters!");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.warn("New passwords do not match!");
      return;
    }
    const pass = passwords.currentPassword + "|" + passwords.confirmPassword;
    updateAccount(
      selectUser.username,
      selectUser.full_name,
      pass,
      selectUser.address,
      selectUser.phone_number
    )
      .then((res) => {
        toast.success("Changing password successfully");
        passwords.currentPassword = "";
        passwords.newPassword = "";
        passwords.confirmPassword = "";
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          toast.error(err.response.data);
        } else {
          toast.error("Update failed");
        }
        console.log(err);
      });
  };

  const formatCurrencyPoint = (amount) => {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {new Intl.NumberFormat("vi-VN").format(amount)}
          <MonetizationOnIcon
            variant="h6"
            sx={{
              marginLeft: "4px",
              color: "gray",
              fontSize: 24,
            }}
          />
        </Box>
      </>
    );
  };

  const { pathname } = useLocation();
  if (pathname.includes("staff") || pathname.includes("admin")) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "79vh",
          marginTop: "7rem",
          backgroundColor: "#f5f7fd",
          padding: "20px",
        }}
      >
        <Card
          sx={{
            position: "relative",
            backgroundColor: "#fff4fc",
            boxShadow: "1px 1px 4px rgba(0, 0, 0.32)",
            border: "3px solid #ff469e",
            borderRadius: "20px",
            color: "black",
            padding: "20px",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                color: "#ff469e",
                marginBottom: "2rem",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              YOUR PROFILE
            </Typography>
            {user && (
              <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      padding: "10px",
                      backgroundColor: "#ffe6f0",
                      textAlign: "center",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0.16)",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "100px",
                        marginBottom: "10px",
                      }}
                      src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                      alt="Profile"
                    />
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                        fontSize: "1.75rem",
                      }}
                    >
                      {user.username}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Full Name
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          {user.full_name}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Address
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          {user.address}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          {user.phone_number}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Role
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          {user.role_id.name}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "71vh",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container sx={{ position: "relative" }}>
        <IconButton
          aria-label="settings"
          sx={{
            position: "absolute",
            top: 10,
            right: -5,
          }}
        >
          <SettingsIcon
            onClick={handleOpenSetting}
            sx={{
              fontSize: "2rem",
              transform: rotate ? "rotate(360deg)" : "rotate(0deg)",
              transition: "transform 0.5s ease-in-out",
            }}
          />
        </IconButton>
        <Card
          sx={{
            backgroundColor: "#fff4fc",
            boxShadow: "1px 1px 4px rgba(0, 0, 0.32)",
            border: "3px solid #ff469e",
            borderRadius: "20px",
            color: "black",
            padding: "20px",
            width: "100%",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                color: "#ff469e",
                marginBottom: "2rem",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              YOUR PROFILE
            </Typography>
            {user && (
              <Grid container spacing={6}>
                <Grid item xs={12} md={5}>
                  <Paper
                    sx={{
                      padding: "10px",
                      backgroundColor: "#ffe6f0",
                      textAlign: "center",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0.16)",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "100px",
                        marginBottom: "10px",
                      }}
                      src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"
                      alt="Profile"
                    />
                    <Typography
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: "10px",
                        fontSize: "1.75rem",
                      }}
                    >
                      {user.username}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "1.25rem",
                          }}
                        >
                          Full Name
                        </Typography>
                        <Typography
                          style={{ color: "black", fontSize: "1.3rem" }}
                        >
                          {user.full_name}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "1.25rem",
                          }}
                        >
                          Address
                        </Typography>
                        <Typography
                          style={{ color: "black", fontSize: "1.3rem" }}
                        >
                          {user.address}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "1.25rem",
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography
                          style={{ color: "black", fontSize: "1.3rem" }}
                        >
                          {user.phone_number}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "1.25rem",
                          }}
                        >
                          Accumulated Points
                        </Typography>
                        <Typography
                          style={{ color: "black", fontSize: "1.3rem" }}
                        >
                          {formatCurrencyPoint(user.accumulated_points)}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "1.25rem",
                          }}
                        >
                          Role
                        </Typography>
                        <Typography
                          style={{ color: "black", fontSize: "1.3rem" }}
                        >
                          {user.role_id.name}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <IconButton
                          size="large"
                          edge="end"
                          aria-label="account of current user"
                          aria-haspopup="true"
                          color="inherit"
                          to="signin"
                          sx={{
                            borderRadius: 2,
                            height: 40,
                            marginRight: "1rem",
                            transition:
                              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                            "&:hover": {
                              backgroundColor: "pink",
                              color: "#ff469e",
                            },
                          }}
                        ></IconButton>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
      {/* <Dialog
        open={openSetting}
        onClose={handleCloseSetting}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20,
            boxShadow: "0px 4px 8px #ff469e",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Roboto",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          Profile Settings
        </DialogTitle>
        <DialogContent>
          <TextField
            label="User Name"
            value={user?.username}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="normal"
            label="Full Name"
            type="text"
            fullWidth
            value={user?.full_name}
            onChange={(e) => setUser({ ...user, full_name: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Address"
            type="text"
            fullWidth
            value={user?.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Phone Number"
            type="text"
            fullWidth
            value={user?.phone_number}
            onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSetting} color="secondary">
            Cancel
          </Button>
          <Button color="primary">Save</Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={openSetting}
        onClose={handleCloseSetting}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20,
            boxShadow: "0px 4px 8px #ff469e",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "Roboto",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          Profile Settings
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Basic Info" />
            <Tab label="Change Password" />
          </Tabs>
          {tabIndex === 0 && (
            <Box mt={2}>
              <TextField
                label="User Name"
                value={selectUser?.username}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="normal"
                label="Full Name"
                type="text"
                fullWidth
                value={selectUser?.full_name}
                onChange={(e) =>
                  setSelectUser({ ...selectUser, full_name: e.target.value })
                }
              />
              <TextField
                margin="normal"
                label="Address"
                type="text"
                fullWidth
                value={selectUser?.address}
                onChange={(e) =>
                  setSelectUser({ ...selectUser, address: e.target.value })
                }
              />
              <TextField
                margin="normal"
                label="Phone Number"
                type="text"
                fullWidth
                value={selectUser?.phone_number}
                onChange={(e) =>
                  setSelectUser({ ...selectUser, phone_number: e.target.value })
                }
              />
            </Box>
          )}
          {tabIndex === 1 && (
            <Box mt={2}>
              <TextField
                margin="normal"
                label="Current Password"
                type="password"
                fullWidth
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
              />
              <TextField
                margin="normal"
                label="New Password"
                type="password"
                fullWidth
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
              <TextField
                margin="normal"
                label="Confirm New Password"
                type="password"
                fullWidth
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSetting}
            variant="contained"
            sx={{
              backgroundColor: "#F0F8FF",
              color: "#757575",
              borderRadius: "30px",
              fontSize: 16,
              fontWeight: "bold",
              width: "10vw",
              transition:
                "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
              border: "1px solid #757575",
              "&:hover": {
                backgroundColor: "#757575",
                color: "white",
                border: "1px solid white",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#F0F8FF",
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
