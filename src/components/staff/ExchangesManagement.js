import {
  ArrowDownward,
  ArrowUpward,
  KeyboardCapslock,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  exchangeByStoreIdApi,
  updateStatusExchangeApi,
} from "../../api/ExchangeAPI";
import { allProductApi } from "../../api/ProductAPI";
import { allOrderDetailApi } from "../../api/OrderAPI";
import { jwtDecode } from "jwt-decode";
import { storeByUserIdApi } from "../../api/StoreAPI";
import { allUserApi } from "../../api/UserAPI";
import moment from "moment";
import { toast } from "react-toastify";

export default function ExchangeManagement() {
  window.document.title = "Exchanges Management";
  const [visible, setVisible] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = jwtDecode(accessToken);
  const userId = decodedAccessToken.UserID;
  const [store, setStore] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newStatus, setNewStatus] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    storeByUserIdApi(userId)
      .then((res) => {
        setStore(res?.data?.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const storeId = store.id;

  const fetchData = async () => {
    try {
      const [exchangesRes, orderDetailsRes, productRes, userRes] =
        await Promise.all([
          exchangeByStoreIdApi(storeId),
          allOrderDetailApi(),
          allProductApi(),
          allUserApi(),
        ]);

      const exchangesData = exchangesRes?.data?.data || [];
      const orderDetailsData = orderDetailsRes?.data?.data || [];
      const productData = productRes?.data?.data?.products || [];
      const userData = userRes?.data?.data || [];

      setExchanges(exchangesData);

      const orderDetailsMap = orderDetailsData.reduce((x, item) => {
        x[item.id] = item.product_id;
        return x;
      }, {});
      setOrderDetailsMap(orderDetailsMap);

      const productMap = productData.reduce((x, item) => {
        x[item.id] = [item.name, item.price];
        return x;
      }, {});
      setProductMap(productMap);

      const userMap = userData.reduce((x, item) => {
        x[item.id] = [item.username, item.phone_number];
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

  const [isReversed, setIsReversed] = useState(false);

  const handleSortToggle = () => {
    setIsReversed((prev) => !prev);
  };

  const sortedExchanges = isReversed ? [...exchanges].reverse() : exchanges;

  const formatDate = (date) => {
    return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSelectChange = (e, item) => {
    setNewStatus(e.target.value);
    if (e.target.value === "PROCESSING") {
      toast.error("Cannot change to this status", {
        autoClose: 1500,
      });
      return;
    }
    if (e.target.value === "PROCESSED") {
      setSelectedExchange(item);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateExchangeStatus = () => {
    const cart_items_exchange = selectedExchange?.exchange_detail_list?.map(
      (item) => ({ product_id: item.product_id, quantity: item.quantity })
    );
    console.log(
      selectedExchange.id,
      selectedExchange.description,
      selectedExchange.order_id,
      newStatus,
      selectedExchange.store_id,
      selectedExchange.user_id,
      cart_items_exchange
    );
    updateStatusExchangeApi(
      selectedExchange.id,
      selectedExchange.description,
      selectedExchange.order_id,
      newStatus,
      selectedExchange.store_id,
      selectedExchange.user_id,
      cart_items_exchange
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Changed exchange's status successfully", {
          autoClose: 1500,
        });
        handleClose();
        fetchData();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container
        sx={{
          my: 4,
          py: 2,
          borderRadius: "20px",
          backgroundColor: "white",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* <Grid container spacing={3}>
            {sortedExchanges?.map((item) => (
              <Grid item xs={6} md={4} lg={3} key={item.id}>
                <Card
                  key={item.id}
                  sx={{
                    px: 1.5,
                    py: 1,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "auto",
                    borderColor: "#ff469e",
                    borderWidth: 1,
                    borderStyle: "solid",
                    border: "1px solid #f5f7fd",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                    transition: "border 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      border: "1px solid #ff469e",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#ff469e" }}
                    gutterBottom
                  >
                    Request No. {item.id}
                  </Typography>
                  <Divider />
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "16px", color: "black" }}
                    >
                      <strong>Reason:</strong> {item.description}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{ color: "black" }}
                    >
                      <strong>Detail:</strong>
                      <br />
                      {item?.exchange_detail_list?.map((detail) => {
                        return (
                          <Typography
                            variant="body2"
                            component="span"
                            key={detail.id}
                          >
                            <strong>{productMap[detail.product_id][0]}</strong> - {formatCurrency(productMap[detail.product_id][1])} x{" "}
                            {detail.quantity}
                            <br />
                          </Typography>
                        );
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}
          <TableContainer
            sx={{
              borderRadius: "20px",
              boxShadow: "0 1px 2px rgba(0,0,0.16,0.5)",
              "&::-webkit-scrollbar": {
                width: "0.5rem",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f5f7fd",
                borderRadius: "0.8rem",
                mx: 0.9,
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#ff469e",
                borderRadius: "0.8rem",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#ffbbd0",
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ff469e",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      No.
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ff469e",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      Sender
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ff469e",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      Contact
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                      minWidth: "140px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        sx={{
                          mt: 0.85,
                          color: "#ff469e",
                          fontWeight: "600",
                          fontSize: "1rem",
                        }}
                      >
                        Sent at
                      </Typography>
                      <IconButton
                        onClick={handleSortToggle}
                        size="small"
                        sx={{
                          color: "#ff469e",
                          fontWeight: "bold",
                          "&:hover": {
                            color: "#ffbbd0",
                            backgroundColor: "#fff4fc",
                          },
                        }}
                      >
                        {!isReversed ? <ArrowUpward /> : <ArrowDownward />}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ff469e",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      Reason
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ff469e",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      Detail
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#fff4fc",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ff469e",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      Status
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedExchanges
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell
                        align="left"
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography sx={{ fontWeight: "bold", color: "black" }}>
                          {item.id}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography sx={{ fontSize: "14px", color: "black" }}>
                          {userMap[item.user_id][0]}
                        </Typography>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography sx={{ fontSize: "14px", color: "black" }}>
                          {userMap[item.user_id][1]}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ fontSize: "14px", color: "black" }}
                        >
                          {formatDate(item.create_date)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: "14px", color: "black" }}
                        >
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ color: "black" }}>
                          {item?.exchange_detail_list?.map((detail) => (
                            <Typography
                              variant="body2"
                              component="span"
                              key={detail.id}
                            >
                              <strong>
                                - {productMap[detail.product_id][0]}
                              </strong>{" "}
                              {/* {formatCurrency(
                                productMap[detail.product_id][1]
                              )}{" "} */}
                              x{detail.quantity}
                              <br />
                            </Typography>
                          ))}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          textAlign: "left",
                          borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Select
                          fullWidth
                          value={item.status}
                          onChange={(e) => handleSelectChange(e, item)}
                          // disabled={item.status === "PROCESSED"}
                          sx={{
                            backgroundColor: "#fff4fc",
                            color: "#ff469e",
                            borderRadius: "20px",
                            fontSize: "16px",
                            border: "1px solid #ff469e",
                            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
                            transition:
                              "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border 0.3s ease-in-out",
                            "&:hover": {
                              color: "white",
                              backgroundColor: "#ff469e",
                              border: "1px solid white",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "inherit",
                            },
                          }}
                          MenuProps={{
                            sx: {
                              "& .MuiMenu-list": {
                                backgroundColor: "white",
                                borderRadius: "10px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.16)",
                              },
                            },
                          }}
                        >
                          <MenuItem
                            value={"PROCESSING"}
                            sx={{
                              color: "black",
                              fontSize: "16px",
                              transition:
                                "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#fff4fc",
                                color: "#ff469e",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "#ff469e",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                              },
                            }}
                          >
                            PROCESSING
                          </MenuItem>
                          <MenuItem
                            value={"PROCESSED"}
                            sx={{
                              color: "black",
                              fontSize: "16px",
                              transition:
                                "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
                              "&:hover": {
                                backgroundColor: "#fff4fc",
                                color: "#ff469e",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "#ff469e",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#fff4fc",
                                  color: "#ff469e",
                                },
                              },
                            }}
                          >
                            PROCESSED
                          </MenuItem>
                        </Select>
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
                              width: 700,
                              borderRadius: "20px",
                              backgroundColor: "#fff4fc",
                              border: "2px solid #ff469e",
                              boxShadow: 10,
                              p: 4,
                            }}
                          >
                            <Typography variant="h6" component="h2">
                              Confirm Update Request's Status
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                              Are you sure you want to update the status of
                              exchange to PROCESSED? (This cannot be undone and
                              changed back to the previous status)
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
                                onClick={() => handleUpdateExchangeStatus()}
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
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={exchanges.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
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
