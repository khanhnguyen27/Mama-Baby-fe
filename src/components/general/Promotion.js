import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { KeyboardCapslock } from "@mui/icons-material";

const Promotion = () => {
  window.document.title = "Promotion";
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div style={{ backgroundColor: "#f5f7fd" }}>
        <Container>
          <Breadcrumbs separator=">" sx={{ color: "black", pt: 4 }}>
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                sx={{
                  color: "black",
                  transition: "color 0.2s ease-in-out",
                  fontSize: 20,
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Home
              </Typography>
            </Link>
            <Typography
              sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
            >
              {" "}
              Promotion
            </Typography>
          </Breadcrumbs>
        </Container>
        <Container
          sx={{
            mt: 4,
            pb: 8,
            animation: "slideIn 1.5s ease-in-out",
            "@keyframes slideIn": {
              from: {
                transform: "translateY(50%)",
              },
              to: {
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVTF03m76I30qrNhD6qm04chuvoaqiW6OS486iXwPr7A&s"
                alt="Promotion Image1"
                style={{
                  width: "60%",
                  height: "auto",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              />
              <img
                src="https://www.shutterstock.com/shutterstock/videos/1088535213/thumb/5.jpg?ip=x480"
                alt="Promotion Image2"
                style={{
                  marginTop: "-8px",
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Special Promotion
              </Typography>
              <Typography variant="body1" gutterBottom>
                Nourish yourself and your little one with our exclusive offer on
                premium milk products designed for mothers and babies!
                Introducing our special promotion: "MOM & BABY ESSENTIALS - 0%
                INTEREST INSTALLMENTS," now available for all purchases.
                <br />
                <br />
                Our innovative program allows you to provide essential nutrition
                for both you and your baby without any upfront costs. Enjoy
                convenient 0% interest installments over periods of 3, 6, or 9
                months.
                <br />
                <br />
                But that's not all! As part of this promotion, we're excited to
                offer additional benefits:
                <br />
                <br />
                • **Exclusive Vouchers:** Receive vouchers worth up to 20% off
                on your next purchase when you participate in our MOM & BABY
                ESSENTIALS program.
                <br />
                <br />
                • **Sales Events:** Join us for our special sales events where
                you can find amazing discounts on a wide range of products
                tailored for moms and babies.
                <br />
                <br />
                • **Gift Exchange Program:** Earn points with every purchase and
                exchange them for exciting gifts. Accumulate points faster by
                shopping during promotional periods and unlock a variety of baby
                essentials and special items for moms.
                <br />
                <br />
                Say goodbye to financial worries and embrace the journey of
                motherhood with confidence. Explore our curated selection of
                milk products tailored to support the health and well-being of
                moms and their precious little ones.
                <br />
                <br />
                Don't miss out on this fantastic opportunity to ensure a healthy
                start for you and your baby. Join us now and take the first step
                towards providing the best nutrition for your growing family!
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/signin");
                  window.scrollTo({
                    top: 0,
                    behavior: "instant",
                  });
                }}
                size="large"
                sx={{
                  backgroundColor: "white",
                  color: "#ff469e",
                  borderRadius: "10px",
                  fontSize: 16,
                  fontWeight: "bold",
                  width: "100%",
                  mt: 8,
                  mb: 4,
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
                Join to get these valuable deals
              </Button>
            </Grid>
          </Grid>
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
    </>
  );
};

export default Promotion;
