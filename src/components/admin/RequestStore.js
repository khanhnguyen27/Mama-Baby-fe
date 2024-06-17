import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { allUserApi, updateRollUserApi } from "../../api/UserAPI";

import {
  requestStoreApi,
  storeByUserIdApi,
  allStoreApi,
} from "../../api/StoreAPI";
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
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ExpandMore, KeyboardCapslock } from "@mui/icons-material";

export default function RequestStore() {
  window.document.title = "Request of Store";
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [requestStore, setRequestStores] = useState({
    PROCESSING: [],
    APPROVED: [],
    REFUSE: [],
  });
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [storeMap, setStoreMap] = useState([]);
  const [user, setUser] = useState();
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [storeRes, userRes] = await Promise.all([
        allStoreApi(),
        allUserApi(),
      ]);

      // Check if storeRes, storeRes.data, and storeRes.data.stores are defined
      const storeData = storeRes?.data?.data?.stores || [];
      const userData = userRes?.data?.data || [];

      // Ensure storeData is an array
      if (!Array.isArray(storeData)) {
        throw new Error("storeData is not an array");
      }

      const categorizedOrders = {
        PROCESSING: [],
        APPROVED: [],
        REFUSE: [],
      };

      storeData.forEach((store) => {
        const latestStatus = store.status;
        if (latestStatus) {
          categorizedOrders[latestStatus]?.push(store);
        }
      });

      for (const status in categorizedOrders) {
        categorizedOrders[status].reverse();
      }

      setRequestStores(categorizedOrders);
      setUser(userData);

      // Create storeMap assuming storeData is an array of objects
      const storeMap = storeData.reduce((x, item) => {
        x[item.id] = [
          item.address,
          item.description,
          item.phone,
          item.status,
          item.name_store,
          item.is_active,
          item.user_id,
        ];
        return x;
      }, {});

      setStoreMap(storeMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (e, newValue) => {
    setLoading(true);
    setTabValue(newValue);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const handleAccept = (
    storeId,
    nameStore,
    address,
    description,
    phone,
    status,
    isActive,
    userId
  ) => {
    requestStoreApi(
      storeId,
      nameStore,
      address,
      description,
      phone,
      status,
      isActive,
      userId
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Request Accepted!", {
          autoClose: 1500,
        });
        handleClose();
        setLoading(true);
        setTimeout(() => {
          navigate("/admin/requeststore");
        }, 1500);
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 2500);
      })
      .catch((error) => console.log(error));
  };
  const handleReject = (
    storeId,
    nameStore,
    address,
    description,
    phone,
    status,
    isActive,
    userId
  ) => {
    requestStoreApi(
      storeId,
      nameStore,
      address,
      description,
      phone,
      status,
      isActive,
      userId
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Request Rejected!", {
          autoClose: 1500,
        });
        handleClose();
        setLoading(true);
        setTimeout(() => {
          navigate("/admin/requeststore");
        }, 1500);
        setTimeout(() => {
          fetchData();
          setLoading(false);
        }, 2500);
      })
      .catch((error) => console.log(error));
  };

  const handleOpen = (type) => {
    setActionType(type);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  console.log(storeMap);

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
                  <Typography
                    variant="h5"
                    sx={{
                      mb: "10px",
                      fontWeight: "bold",
                      backgroundColor: "#ff469e",
                      borderRadius: "0 4px 4px 0",
                      padding: "5px 10px",
                      color: "white",
                      marginTop: "0px",
                      marginLeft: "auto",
                    }}
                  >
                    {item.status}{" "}
                  </Typography>
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
                          <span style={{ opacity: 0.7 }}>User Name:</span>
                          <span style={{ fontWeight: "600" }}>
                            {user.full_name}
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
                            {user.phone_number}
                          </span>
                        </Box>
                      </Box>
                    </Typography>
                  </Grid>
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
                      onClick={() => handleOpen("Reject")}
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
                      onClick={() => handleOpen("Accept")}
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
                              {
                                // storeId, nameStore, address, description, phone, status, isActive, userId
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
                              }
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
                </Grid>
              </Card>
            ))
          )}
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
