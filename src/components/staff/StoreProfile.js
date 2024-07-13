import React, { useEffect, useState } from "react";
import { allStoreApi } from "../../api/StoreAPI";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Box,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Input,
  Button,
  InputLabel,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import DescriptionIcon from "@mui/icons-material/Description";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { environment } from "../../environments/environment";
import { KeyboardCapslock } from "@mui/icons-material";
import { updateStoreApi } from "../../api/StoreAPI";
import { jwtDecode } from "jwt-decode";

export default function StoreProfile() {
  const [store, setStore] = useState(null);
  const [openLicense, setOpenLicense] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [visible, setVisible] = useState(false);
  const [storename, setStorename] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [selectedLicense, setSelectedLicense] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;

  useEffect(() => {
    allStoreApi()
      .then((res) => {
        const stores = res?.data?.data?.stores;
        if (stores && stores.length > 0) {
          setStore(stores[0]);
          setStorename(stores[0].name_store);
          setAddress(stores[0].address);
          setPhone(stores[0].phone);
          setDescription(stores[0].description);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOpenLicense = (item) => {
    setOpenLicense(true);
    setSelectedLicense(item);
  };

  const handleCloseLicense = () => {
    setOpenLicense(false);
  };

  const handleOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImage({
        file: file,
        url: url,
      });
    }
  };
  const updateStore = async () => {
    try {
      const storeId = store.id;
      const response = await updateStoreApi(
        storeId,
        storename,
        address,
        description,
        phone,
        userId
      );
      console.log("Store updated successfully:", response.data);
      handleCloseUpdateDialog();
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const handleSave = () => {
    if (storename && address && phone && description) {
      updateStore();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        marginTop: "7rem",
        backgroundColor: "#f5f7fd",
        padding: "20px",
        position: "relative",
      }}
    >
      {store && (
        <Badge
          badgeContent={store.status}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiBadge-badge": {
              transform: "rotate(45deg)",
              color: "white",
              fontSize: "22px",
              fontWeight: "bold",
              backgroundColor: "#ff469e",
              borderRadius: "0 4px 4px 0",
              padding: "5px 10px",
              position: "absolute",
              top: "80px",
              right: "-25px",
              boxShadow: "0 0 0 3px white",
            },
          }}
        >
          <Card
            sx={{
              backgroundColor: "#fff4fc",
              boxShadow: "1px 1px 4px rgba(0, 0, 0.32)",
              border: "3px solid #ff469e",
              borderRadius: "20px",
              color: "#333",
              padding: "20px",
              maxWidth: "1000px",
              width: "100%",
              position: "relative",
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
                STORE PROFILE
              </Typography>
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
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZJVlDPE_mC28sugfpG-HdgSViHPXDHL5ww&s"
                      alt="Profile"
                    />
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#ff469e",
                        marginBottom: "10px",
                        fontSize: "1.75rem",
                      }}
                    >
                      {store.name_store}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#ff469e",
                          textAlign: "left",
                          fontWeight: "bold",
                          fontSize: 25,
                        }}
                      >
                        <DescriptionIcon
                          sx={{
                            fontSize: 25,
                            verticalAlign: "middle",
                            marginRight: "8px",
                            color: "#ff469e",
                          }}
                        />
                        Description:
                      </Typography>
                      <Typography
                        paragraph
                        sx={{
                          textAlign: "left",
                          marginTop: 0.5,
                          color: "#333",
                          fontSize: 20,
                        }}
                      >
                        {store?.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}></Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#ff469e",
                            fontSize: 25,
                          }}
                        >
                          Address
                        </Typography>
                        <Typography
                          sx={{
                            color: "black",
                            fontSize: 25,
                          }}
                        >
                          <LocationOnIcon
                            sx={{
                              fontSize: 25,
                              verticalAlign: "middle",
                              marginRight: "8px",
                              color: "#ff469e",
                            }}
                          />
                          {store.address}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#ff469e",
                            fontSize: 25,
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          <PhoneIcon
                            sx={{
                              fontSize: 25,
                              verticalAlign: "middle",
                              marginRight: "8px",
                              color: "#ff469e",
                            }}
                          />
                          {store.phone}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          sx={{
                            fontSize: 25,
                            fontWeight: "bold",
                            color: "#ff469e",
                          }}
                        >
                          Valid Date
                        </Typography>
                        <Typography sx={{ color: "black" }}>
                          <PendingActionsIcon
                            sx={{
                              fontSize: 25,
                              verticalAlign: "middle",
                              marginRight: "8px",
                              color: "#ff469e",
                            }}
                          />
                          {store.valid_date}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "10px",
                    fontSize: 25,
                    fontWeight: "bold",
                    my: 2,
                    mx: 1,
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                  onClick={() => handleOpenLicense(store.license_url)}
                >
                  See The License
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "10px",
                    fontSize: 25,
                    fontWeight: "bold",
                    my: 2,
                    mx: 1,
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                    border: "1px solid #ff469e",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      color: "white",
                      border: "1px solid white",
                    },
                  }}
                  onClick={handleOpenUpdateDialog}
                >
                  Update Profile
                </IconButton>
              </Box>
              <Dialog
                open={openLicense}
                onClose={handleCloseLicense}
                maxWidth="md"
                fullWidth
                slotProps={{
                  backdrop: {
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                }}
                PaperProps={{
                  style: {
                    borderRadius: 20,
                    boxShadow: "0px 4px 8px #ff469e",
                  },
                }}
              >
                <img
                  src={`${environment.apiBaseUrl}/stores/license/${selectedLicense}`}
                  alt="Selected"
                  style={{ width: "100%" }}
                />
              </Dialog>
              <Dialog
                open={openUpdateDialog}
                onClose={handleCloseUpdateDialog}
                maxWidth="md"
                fullWidth
                slotProps={{
                  backdrop: {
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                }}
                PaperProps={{
                  style: {
                    borderRadius: 20,
                    boxShadow: "0px 4px 8px #ff469e",
                  },
                }}
              >
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
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
                      Description of Store{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                  <FormControl sx={{ mb: 3 }} fullWidth>
                    <Typography
                      sx={{
                        color: "black",
                        textAlign: "left",
                        paddingBottom: 1,
                        fontWeight: "700",
                      }}
                    >
                      Select The License <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      style={{ marginTop: "16px", marginBottom: "16px" }}
                    />
                    {image && (
                      <FormControl fullWidth margin="normal">
                        <InputLabel shrink>Image</InputLabel>
                        <div
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={image.url}
                            alt="Selected"
                            style={{ width: "100%", marginTop: "16px" }}
                          />
                        </div>
                      </FormControl>
                    )}
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseUpdateDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </Badge>
      )}
    </div>
  );
}
