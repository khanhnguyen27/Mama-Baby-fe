import React from "react";
import { Button, Container, FormControl, Input, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname.includes("staff") || pathname.includes("admin") || pathname.includes("successPayment") || pathname.includes("failedPayment")) {
    return <></>;
  }
  return (
    <div
      style={{
        backgroundColor: "#303036",
        color: "#f8f8f8",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: "2rem 0",
        paddingBottom: "1rem",
      }}
    >
      <Container style={{ width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            borderBottom: "1px solid #59595e",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "0.5rem",
            }}
          >
            <Typography variant="h5" style={{ marginBottom: "0.5rem" }}>
              ABOUT US
            </Typography>
            <Link
              to="/introduction"
              style={{ textDecoration: "none" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Typography
                sx={{
                  color: "#F8F8F8",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Introduction
              </Typography>
            </Link>
            <Link
              to="/promotion"
              style={{ textDecoration: "none" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Typography
                sx={{
                  color: "#F8F8F8",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Promotion
              </Typography>
            </Link>
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Typography
                sx={{
                  color: "#F8F8F8",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Warranty Policy
              </Typography>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "0.5rem",
            }}
          >
            <Typography variant="h5" style={{ marginBottom: "0.5rem" }}>
              OUR OFFICE
            </Typography>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#F8F8F8",
                display: "flex",
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <LocationOnIcon style={{ marginRight: "0.5rem" }} />
              <span>123 ABC Street, XYZ City</span>
            </Link>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#F8F8F8",
                display: "flex",
                marginTop: "0.5rem",
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <EmailIcon style={{ marginRight: "0.5rem" }} />
              <span>123Socket@gmail.com</span>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "0.5rem",
            }}
          >
            <Typography variant="h5" style={{ marginBottom: "0.5rem" }}>
              NEWSLETTER
            </Typography>
            <div>
              Please leave your email to receive new information of new
              products, as well as offers from Mama-Baby.
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormControl style={{ flex: 1, marginRight: "0.5rem" }}>
                <Input
                  placeholder="Enter your email here"
                  style={{
                    backgroundColor: "#43434a",
                    color: "#F8F8F8",
                    border: "1px solid #59595e",
                    padding: "5px",
                  }}
                />
              </FormControl>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#f8f8f8",
                  color: "#303036",
                  height: "100%",
                }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Typography
          variant="body2"
          style={{ color: "gray", marginTop: "2rem" }}
        >
          Copyright © 2024 - Copyright of Mama-Baby - SWP391 <br />
          Since 1999 - Trademark registered number 822024 by the Intellectual
          Property Office
        </Typography>
      </Container>
    </div>
  );
};

export default Footer;
