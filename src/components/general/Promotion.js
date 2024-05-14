import React from "react";
import {
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const Promotion = () => {
  return (
    <>
      <Container>
        <Breadcrumbs separator=">" sx={{ color: "black" }}>
          <Link
            to="/"
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
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
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
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                marginTop: "5px",
              }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 8,
                backgroundColor: "white",
                color: "#ff469e",
                border: "1px solid #ff469e",
                "&:hover": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  border: "1px solid white",
                },
              }}
            >
              <Link
                to="/signin"
                style={{ color: "inherit", textDecoration: "none" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                Join to get these valuable deals
              </Link>
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "left" }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Special Promotion: Nutritious Milk for Moms & Babies
            </Typography>
            <Typography variant="body1" gutterBottom>
              Nourish yourself and your little one with our exclusive offer on
              premium milk products designed for mothers and babies! Introducing
              our special promotion: "MOM & BABY ESSENTIALS - 0% INTEREST
              INSTALLMENTS," now available for all purchases.
              <br />
              <br />
              Our innovative program allows you to provide essential nutrition
              for both you and your baby without any upfront costs. Instead of
              paying the full amount immediately, enjoy convenient 0% interest
              installments over periods of 3, 6, or 9 months.
              <br />
              <br />
              Say goodbye to financial worries and embrace the journey of
              motherhood with confidence. Explore our curated selection of milk
              products tailored to support the health and well-being of moms and
              their precious little ones.
              <br />
              <br />
              Don't let this opportunity slip away to ensure a healthy start for
              you and your baby. Join us now and take the first step towards
              providing the best nutrition for your growing family!
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Promotion;
