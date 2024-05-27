import React, { useEffect, useState } from "react";
import { profileUserApi } from "../../api/UserAPI";
import { Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    profileUserApi()
      .then((res) => setUser(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

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
          style={{
            backgroundColor: "#fff4fc",
            boxShadow: "2px 2px 4px rgba(0, 0, 0.24)",
            border: "3px solid #ff469e",
            color: "black",
            padding: "20px",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              style={{
                color: "#ff469e",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              YOUR PROFILE
            </Typography>
            {user && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper
                    style={{
                      padding: "10px",
                      backgroundColor: "#ffe6f0",
                      textAlign: "center",
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
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Full Name
                        </Typography>
                        <Typography style={{ color: "black" }}>
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
                          }}
                        >
                          Address
                        </Typography>
                        <Typography style={{ color: "black" }}>
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
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography style={{ color: "black" }}>
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
                          }}
                        >
                          Role
                        </Typography>
                        <Typography style={{ color: "black" }}>
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
      <Card
        style={{
          backgroundColor: "#fff4fc",
          boxShadow: "2px 2px 4px rgba(0, 0, 0.24)",
          border: "3px solid #ff469e",
          color: "black",
          padding: "20px",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            style={{
              color: "#ff469e",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            YOUR PROFILE
          </Typography>
          {user && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper
                  style={{
                    padding: "10px",
                    backgroundColor: "#ffe6f0",
                    textAlign: "center",
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
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography
                        style={{
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Full Name
                      </Typography>
                      <Typography style={{ color: "black" }}>
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
                        }}
                      >
                        Address
                      </Typography>
                      <Typography style={{ color: "black" }}>
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
                        }}
                      >
                        Phone Number
                      </Typography>
                      <Typography style={{ color: "black" }}>
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
                        }}
                      >
                        Accumulated Points
                      </Typography>
                      <Typography style={{ color: "black" }}>
                        {user.accumulated_points}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div>
                      <Typography
                        style={{
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Role
                      </Typography>
                      <Typography style={{ color: "black" }}>
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
