import React from "react";
import {
  Button,
  Container,
  Divider,
  FormControl,
  Input,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (
    pathname.includes("staff") ||
    pathname.includes("admin") ||
    pathname.includes("successPayment") ||
    pathname.includes("failedPayment")
  ) {
    return <></>;
  }
  return (
    <div
      style={{
        backgroundColor: "#fff4fc",
        // color: "#ff469e",
        color: "#ff469e",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        boxShadow: "1px 1px 3px rgba(0,0,0.16)",
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
            paddingBottom: "0.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "0.5rem",
              padding: "1rem",
              borderRadius: "20px",
              border: "1px solid #ff469e",
              backgroundColor: "#ffe4ec",
            }}
          >
            <Typography variant="h5" sx={{ mb: 0.25, fontWeight: "bold" }}>
              ABOUT US
            </Typography>
            <Divider
              sx={{
                borderColor: "#ff469e",
                borderWidth: "1px",
                width: "35%",
                my: 0.5,
              }}
            />
            <Link
              to="/introduction"
              style={{ textDecoration: "none" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Typography
                sx={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                  fontSize: "1.15rem",
                  "&:hover": {
                    scale: "1.02",
                    color: "#ff469e",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "28.5%",
                    height: 2,
                    backgroundColor: "#ff469e",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom right",
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
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
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                  fontSize: "1.15rem",
                  "&:hover": {
                    scale: "1.02",
                    color: "#ff469e",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "25%",
                    height: 2,
                    backgroundColor: "#ff469e",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom right",
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
                  },
                }}
              >
                Promotion
              </Typography>
            </Link>
            <Link
              to="/policy"
              style={{ textDecoration: "none" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Typography
                sx={{
                  textDecoration: "none",
                  color: "black",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "color 0.2s ease-in-out, scale 0.3s ease-in-out",
                  fontSize: "1.15rem",
                  "&:hover": {
                    scale: "1.02",
                    color: "#ff469e",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "37.5%",
                    height: 2,
                    backgroundColor: "#ff469e",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom right",
                    transition: "transform 0.3s ease-in-out",
                  },
                  "&:hover::before": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
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
              padding: "1rem",
              borderRadius: "20px",
              border: "1px solid #ff469e",
              backgroundColor: "#ffe4ec",
            }}
          >
            <Typography variant="h5" sx={{ mb: 0.25, fontWeight: "bold" }}>
              OUR OFFICE
            </Typography>
            <Divider
              sx={{
                borderColor: "#ff469e",
                borderWidth: "1px",
                width: "42%",
                my: 0.5,
              }}
            />
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#ff469e",
                display: "flex",
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <LocationOnIcon style={{ marginRight: "0.5rem" }} />
              <Typography
                sx={{
                  color: "black",
                  "&:hover": {
                    color: "#ff469e",
                  },
                }}
              >
                123 ABC Street, XYZ City
              </Typography>
            </Link>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "#ff469e",
                display: "flex",
                marginTop: "0.5rem",
              }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <EmailIcon style={{ marginRight: "0.5rem" }} />
              <Typography
                sx={{
                  color: "black",
                  "&:hover": {
                    color: "#ff469e",
                  },
                }}
              >
                Mama-Baby_Official@gmail.com
              </Typography>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "0.5rem",
              padding: "1rem",
              borderRadius: "20px",
              border: "1px solid #ff469e",
              backgroundColor: "#ffe4ec",
            }}
          >
            <Typography variant="h5" sx={{ mb: 0.25, fontWeight: "bold" }}>
              NEWSLETTER
            </Typography>
            <Divider
              sx={{
                borderColor: "#ff469e",
                borderWidth: "1px",
                width: "48%",
                my: 0.5,
              }}
            />
            <Typography sx={{ color: "black" }}>
              Please leave your email to receive new information of new
              products, as well as offers from Mama-Baby.
            </Typography>
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
                  disableUnderline
                  style={{
                    backgroundColor: "white",
                    color: "#ff469e",
                    border: "1px solid #59595e",
                    padding: "5px",
                    borderRadius: "10px"
                  }}
                />
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#ff469e",
                  borderRadius: "10px",
                  fontSize: 16,
                  fontWeight: "bold",
                  height: "100%",
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
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Typography
          variant="body2"
          style={{
            color: "gray",
            marginTop: "2rem",
          }}
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
