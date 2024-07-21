import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { KeyboardCapslock } from "@mui/icons-material";

const Introduction = () => {
  window.document.title = "Introduction";
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
              Introduction
            </Typography>
          </Breadcrumbs>
        </Container>
        <Container
          sx={{
            textAlign: "center",
            marginTop: "1rem",
            animation: "fadeIn 1s ease-in-out",
            "@keyframes fadeIn ": {
              from: {
                opacity: 0,
              },
              to: {
                opacity: 1,
              },
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Welcome to Mama-Baby
          </Typography>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Providing Nutritious Milk for Pregnant Moms & Babies
          </Typography>

          <Box
            maxWidth="lg"
            sx={{
              mt: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Introduction
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Welcome to Mama-Baby, your premier destination for high-quality,
              nutritious milk products specially designed for expecting mothers
              and their babies. Established in 2024, Mama-Baby has swiftly
              earned a reputation as a trusted and reliable source for premium
              milk, ensuring that the health and well-being of mothers and their
              little ones are always a top priority.
            </Typography>
            <br />
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Mission
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              At Mama-Baby, our mission is to support the health and well-being
              of pregnant mothers and their babies through our extensive range
              of milk products, rich in essential nutrients and vitamins. We are
              dedicated to promoting a healthy lifestyle from pregnancy through
              infancy, ensuring that both mom and baby receive the nourishment
              they need.
            </Typography>
            <br />
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Services
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Mama-Baby offers a suite of services including personalized
              consultations with lactation experts, carefully curated milk
              selections tailored to individual nutritional needs, and
              convenient delivery options. Our goal is to provide a seamless and
              supportive experience for all our customers.
            </Typography>
            <br />
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Market
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Our target market includes pregnant mothers, new mothers, and
              families who prioritize high-quality nutrition for their babies.
              As awareness of the importance of nutrition during pregnancy and
              early childhood grows, Mama-Baby is committed to meeting the
              increasing demand for superior milk products in this vital market.
            </Typography>
            <br />
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              Competitive Advantages
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "left" }}
            >
              What sets Mama-Baby apart is our unwavering commitment to quality,
              personalized service, and customer satisfaction. We source our
              milk products from reputable suppliers to ensure they meet the
              highest safety and quality standards, providing peace of mind to
              our customers.
            </Typography>
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/");
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
                  width: "200px",
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
                Explore more
              </Button>
            </div>
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
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Introduction;
