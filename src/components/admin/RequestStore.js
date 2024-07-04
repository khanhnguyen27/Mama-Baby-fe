import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { allUserApi, updateRollUserApi } from "../../api/UserAPI";
import {
  requestStoreApi,
  allStoreByAdminApi,
  deleteStoreApi,
} from "../../api/StoreAPI";
import { environment } from "../../environments/environment";
import {
  Modal,
  Button,
  Badge,
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  Divider,
  IconButton,
  Dialog,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function RequestStore() {
  window.document.title = "Request of Store";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const userId = decodedAccessToken.UserID;
  const [requestStore, setRequestStores] = useState({
    PROCESSING: [],
    APPROVED: [],
  });
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [storeMap, setStoreMap] = useState([]);
  const [userMap, setUserMap] = useState();
  const [actionType, setActionType] = useState("");
  const [openLicense, setOpenLicense] = useState(false);
  const [image, setImage] = useState({
    file: null,
    url: "",
  });
  const [selectedLicense, setSelectedLicense] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const storeId = storeMap.id;

  const fetchData = async () => {
    try {
      const [storeRes, userRes] = await Promise.all([
        allStoreByAdminApi({
          limit:1000,
        }),
        allUserApi(),
      ]);

      const storeData = storeRes?.data?.data?.stores || [];
      const userData = userRes?.data?.data || [];

      if (!Array.isArray(storeData)) {
        throw new Error("storeData is not an array");
      }

      const categorizedOrders = {
        PROCESSING: [],
        APPROVED: [],
      };

      storeData.forEach((store) => {
        const latestStatus = store.status;
        categorizedOrders[latestStatus]?.unshift(store);
      });

      setRequestStores(categorizedOrders);

      const storeMap = storeData.reduce((x, item) => {
        x[item.id] = [
          item.address,
          item.description,
          item.phone,
          item.status,
          item.name_store,
          item.is_active,
          item.user_id,
          item.license_url,
        ];

        return x;
      }, {});
      console.log(storeData);

      setStoreMap(storeMap);
      const userMap = userData.reduce((x, item) => {
        x[item.id] = [
          item.username,
          item.full_name,
          item.address,
          item.phone_number,
        ];
        return x;
      }, {});
      setUserMap(userMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const handleTabChange = (e, newValue) => {
    setLoading(true);
    setTabValue(newValue);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleAccept = () => {
    if (selectedStoreId === null) return;
    const selectedStore = storeMap[selectedStoreId];
    if (!selectedStore) return;

    const [address, description, phone, status, nameStore, isActive, userId] =
      selectedStore;

    requestStoreApi(
      selectedStoreId,
      nameStore,
      address,
      description,
      phone,
      "APPROVED",
      1,
      userId
    )
      .then((res) => {
        toast.success("Request Accepted!", {
          autoClose: 3000,
        });
        handleApproveUserStatus(userId, 2); // Pass userId and new roleId
        updateRequestStatus(selectedStoreId, "APPROVED");
        handleClose();
        setLoading(true);
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 1500);
      })
      .catch((error) => console.log(error));
  };

  const handleReject = () => {
    if (selectedStoreId === null) return;
    const selectedStore = storeMap[selectedStoreId];
    if (!selectedStore) return;

    const [address, description, phone, status, nameStore, isActive, userId] =
      selectedStore;

    handleApproveUserStatus(userId, 1); 

    deleteStoreApi(selectedStoreId)
      .then(() => {
        toast.success("Store deleted successfully!");
        setLoading(true);
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 3000);
      })
      .catch((error) => {
        console.log("Error deleting store:", error);
        setLoading(false); 
      });

    handleClose();
  };

  const updateRequestStatus = (storeId, newStatus) => {
    setRequestStores((prevOrders) => {
      const updatedRequest = { ...prevOrders };

      let updatedStore = null;
      for (const status in updatedRequest) {
        const storeIndex = updatedRequest[status].findIndex(
          (store) => store.id === storeId
        );
        if (storeIndex !== -1) {
          updatedStore = updatedRequest[status].splice(storeIndex, 1)[0];
          break;
        }
      }
      if (updatedStore) {
        updatedStore.status = newStatus;
        updatedRequest[newStatus] = [
          updatedStore,
          ...updatedRequest[newStatus],
        ];
      }
      return updatedRequest;
    });
  };

  const handleApproveUserStatus = async (userId, newRoleId) => {
    const selectedUser = userMap[userId];
    if (selectedUser) {
      try {
        console.log("UserAPI:", {
          username: selectedUser[0],
          full_name: selectedUser[1],
          address: selectedUser[2],
          phone_number: selectedUser[3],
          status: true, 
          roleId: newRoleId,
        });

        await updateRollUserApi(
          selectedUser[0], // username
          selectedUser[1], // full_name
          selectedUser[2], // address
          selectedUser[3], // phone_number
          true, 
          newRoleId 
        );
        toast.success("User role and status updated successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error updating user status:", error);
        toast.error("Failed to update user status.");
      }
    } else {
      alert("Selected user not found in the list");
    }
  };
  const handleOpenLicense = (item) => {
    setOpenLicense(true);
    setSelectedLicense(item);
  };

  const handleCloseLicense = () => {
    setOpenLicense(false);
  };

  const handleOpen = (type, storeId) => {
    setActionType(type);
    setSelectedStoreId(storeId);
    const selectedStore = storeMap[storeId];
    if (selectedStore) {
      setSelectedUserId(selectedStore[6]); // Set the userId from the store details
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStoreId(null);
    setSelectedUserId(null);
  };



  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container sx={{ my: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            border: "1px solid #ff469e",
            backgroundColor: "white",
            borderRadius: "30px",
            opacity: 0.95,
          }}
        >
          {Object.keys(requestStore).map((status, index) => (
            <Tab
              key={status}
              label={status.charAt(0) + status.slice(1).toLowerCase()}
              sx={{
                backgroundColor: tabValue === index ? "#ff469e" : "#fff4fc",
                color: tabValue === index ? "white" : "#ff469e",
                borderRadius: "20px",
                minHeight: "30px",
                minWidth: "100px",
                m: 1,
                fontWeight: "bold",
                boxShadow: "none",
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                },
                "&.Mui-selected": {
                  color: "white",
                },
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ marginTop: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                maxWidth: "100vw",
                backgroundColor: "#f5f7fd",
              }}
            ></Box>
          ) : requestStore[Object.keys(requestStore)[tabValue]].length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#ff469e",
                  fontSize: "1.75rem",
                  textAlign: "center",
                }}
              >
                There's no request of store
              </Typography>
            </Box>
          ) : (
            requestStore[Object.keys(requestStore)[tabValue]].map((item) => (
              <Card
                sx={{
                  mb: "16px",
                  padding: "16px",
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <Typography
                      variant="h5"
                      sx={{ mb: "10px", fontWeight: "bold" }}
                    >
                      Request No. {item.id}{" "}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "5px",
                        fontWeight: "medium",
                        fontSize: "1.25rem",
                      }}
                    ></Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "5px",
                        mt: 2,
                        fontWeight: "medium",
                        fontSize: "1.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Store Detail:
                      </span>{" "}
                      <Divider
                        sx={{
                          width: "70%",
                          my: 1,
                          borderColor: "rgba(0, 0, 0, 0.4)",
                          borderWidth: "1px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Store Name:</span>
                          <span style={{ fontWeight: "600" }}>
                            {item.name_store}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Address:</span>
                          <span style={{ fontWeight: "600" }}>
                            {item.address}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Description:</span>
                          <span style={{ fontWeight: "600" }}>
                            {item.description}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Phone:</span>
                          <span style={{ fontWeight: "600" }}>
                            {item.phone}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
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
                        borderRadius: 20, // Adjust border radius as per your requirement
                        boxShadow: "0px 4px 8px #ff469e", // Add boxShadow for a raised effect
                      },
                    }}
                  >
                    {/* <FormControl fullWidth margin="normal">
                      <div
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      > */}
                        <img
                          src={`${environment.apiBaseUrl}/stores/license/${selectedLicense}`}
                          alt="Selected"
                          style={{ width: "100%" }}
                        />
                      {/* </div>
                    </FormControl> */}
                  </Dialog>

                  <Grid item xs={12} md={5}>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "5px",
                        mt: 2,
                        fontWeight: "medium",
                        fontSize: "1.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        User Detail:
                      </span>{" "}
                      <Divider
                        sx={{
                          width: "70%",
                          my: 1,
                          borderColor: "rgba(0, 0, 0, 0.4)",
                          borderWidth: "1px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Username:</span>
                          <span style={{ fontWeight: "600" }}>
                            {userMap[item.user_id][0]}
                          </span>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "70%",
                          }}
                        >
                          <span style={{ opacity: 0.7 }}>Phone:</span>
                          <span style={{ fontWeight: "600" }}>
                            {userMap[item.user_id][3]}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>

                  {item.status === "PROCESSING" && (
                    <Grid item xs={12} sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "10px",
                          fontSize: 16,
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
                        onClick={() => handleOpenLicense(item.license_url)}
                      >
                        See The License
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "10px",
                          fontSize: 16,
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
                        onClick={() => handleOpen("Reject", item.id)}
                      >
                        REJECT REQUEST
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "10px",
                          fontSize: 16,
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
                        onClick={() => handleOpen("Accept", item.id)}
                      >
                        ACCEPT REQUEST
                      </Button>

                      <Modal
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          backdrop: {
                            style: {
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            borderRadius: "20px",
                            backgroundColor: "#fff4fc",
                            border: "2px solid #ff469e",
                            boxShadow: 20,
                            p: 4,
                          }}
                        >
                          <Typography variant="h6" component="h2">
                            {actionType === "Accept"
                              ? "Accept Order"
                              : "Reject Order"}
                          </Typography>
                          <Typography sx={{ mt: 2 }}>
                            {actionType === "Accept"
                              ? "Are you sure you want to accept this order?"
                              : "Are you sure you want to reject this order?"}
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "white",
                                color: "#ff469e",
                                borderRadius: "20px",
                                fontSize: 16,
                                fontWeight: "bold",
                                my: 0.2,
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
                              onClick={() => {
                                actionType === "Accept"
                                  ? handleAccept(
                                      item.id,
                                      item.name_store,
                                      item.address,
                                      item.description,
                                      item.phone,
                                      "APPROVED",
                                      1,
                                      item.user_id
                                    )
                                  : handleReject(
                                      item.id,
                                      item.name_store,
                                      item.address,
                                      item.description,
                                      item.phone,
                                      "REFUSE",
                                      1,
                                      item.user_id
                                    );
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "white",
                                color: "#ff469e",
                                borderRadius: "20px",
                                fontSize: 16,
                                fontWeight: "bold",
                                my: 0.2,
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
                              onClick={handleClose}
                            >
                              No
                            </Button>
                          </Box>
                        </Box>
                      </Modal>
                    </Grid>
                  )}
                  {item.status === "APPROVED" && (
                    <Grid item xs={12} sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "white",
                          color: "#ff469e",
                          borderRadius: "10px",
                          fontSize: 16,
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
                        onClick={() => handleOpenLicense(item.license_url)}
                      >
                        See The License
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Card>
            ))
          )}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Box>
        </Box>
        {visible && (
          <IconButton
            size="large"
            sx={{
              position: "fixed",
              right: 25,
              bottom: 25,
              border: "1px solid #ff469e",
              backgroundColor: "#fff4fc",
              color: "#ff469e",
              transition:
                "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#ff469e",
                color: "white",
              },
            }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <KeyboardCapslock />
          </IconButton>
        )}
      </Container>
    </div>
  );
}
