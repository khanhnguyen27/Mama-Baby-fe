import React, { useEffect, useState } from "react";
import { allStoreApi,storeByUserIdApi } from "../../api/StoreAPI";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StoreProfile() {
  window.document.title = "Store Profile"
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
  const validatePhoneNumber = (phone) => {
    const reg = /^[0-9]{9,11}$/;
    return reg.test(phone);
  };

  const fetchData = async () => {
    try {
      const res = await storeByUserIdApi(userId);
      const stores = res?.data?.data;
      if (stores) {
        setStore(stores);
        setStorename(stores.name_store);
        setAddress(stores.address);
        setPhone(stores.phone);
        setDescription(stores.description);
      }
      console.log(stores);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
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
      if (
        storename === "" ||
        address === "" ||
        description === "" ||
        phone === ""
      ) {
        toast.error("Please input all fields", { autoClose: 1500 });
        return;
      }

      if (!validatePhoneNumber(phone)) {
        toast.error("Phone must be digit and its length is 9 - 11 characters");
        return;
      }
      const storeId = store.id;
      const response = await updateStoreApi(
        storeId,
        storename,
        address,
        description,
        phone,
        userId
      );
      toast.success("Store updated successfully:", { autoClose: 1500 });
      fetchData();
      handleCloseUpdateDialog();
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const handleSave = () => {
    if (storename && address && phone && description) {
      updateStore();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
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
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#ff469e",
                          textAlign: "left",
                          fontWeight: "bold",
                          fontSize: 25,
                        }}
                      >
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
                        <DescriptionIcon
                          sx={{
                            fontSize: 25,
                            verticalAlign: "middle",
                            marginRight: "8px",
                            color: "#ff469e",
                          }}
                        />
                        {store?.description}
                      </Typography>
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
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  sx={{
                    ml: 2,
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "30px",
                    fontSize: 15,
                    fontWeight: "bold",
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
                  onClick={() => handleOpenLicense(store.license_url)}
                >
                  See The License
                </Button>
                <Button
                  sx={{
                    ml: 2,
                    backgroundColor: "white",
                    color: "#ff469e",
                    borderRadius: "30px",
                    fontSize: 15,
                    fontWeight: "bold",
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
                  onClick={handleOpenUpdateDialog}
                >
                  Update Profile
                </Button>
              </Grid>

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
                </DialogContent>
                <DialogActions>
                  <Button
                    sx={{
                      ml: "auto",
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "30px",
                      fontSize: 15,
                      fontWeight: "bold",
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
                    onClick={handleCloseUpdateDialog}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      ml: "auto",
                      backgroundColor: "white",
                      color: "#ff469e",
                      borderRadius: "30px",
                      fontSize: 15,
                      fontWeight: "bold",
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
                    onClick={handleSave}
                    color="primary"
                  >
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
