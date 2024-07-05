import React, { useEffect, useRef, useState } from "react";
import { profileUserApi } from "../../api/UserAPI";
import { Card, CardContent, Typography, Grid, Paper, Box, Container } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    profileUserApi()
      .then((res) => setUser(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);
  window.document.title = `${user?.username}`;

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
        minHeight: "65vh",
        backgroundColor: "#f5f7fd",
        padding: "20px",
      }}
    >
      <Container>
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
                      >

                      </IconButton>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      </Container>
    </div>
  );
}
