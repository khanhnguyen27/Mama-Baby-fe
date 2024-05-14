import React from "react";
import { Breadcrumbs, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Introduction = () => {
  return (
    <>
      <div style={{ marginLeft: "1rem" }}>
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
            <Typography sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}>
              {" "}
              Introduction
            </Typography>
          </Breadcrumbs>
        </Container>
        <section style={{ marginLeft: "1rem" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Welcome to Mama-Baby
          </Typography>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Providing Nutritious Milk for Moms & Babies
          </Typography>
        </section>
      </div>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          style={{ textAlign: "left" }}
        >
          Introduction
        </Typography>
        <Typography variant="body1" gutterBottom style={{ textAlign: "left" }}>
          Mama-Baby is a specialized shop dedicated to providing high-quality,
          nutritious milk for pregnant moms and babies. Established in 2024,
          Mama-Baby has quickly become a trusted source for premium milk
          products.
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
        <Typography variant="body1" gutterBottom style={{ textAlign: "left" }}>
          Our mission at Mama-Baby is to ensure the health and well-being of
          expecting mothers and their babies by offering a wide range of milk
          products that are rich in essential nutrients and vitamins. We strive
          to promote a healthy lifestyle for both moms and babies from pregnancy
          through infancy.
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
        <Typography variant="body1" gutterBottom style={{ textAlign: "left" }}>
          Mama-Baby provides a variety of services including personalized
          consultations with lactation experts, curated milk selections tailored
          to individual needs, and delivery options for added convenience.
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
        <Typography variant="body1" gutterBottom style={{ textAlign: "left" }}>
          Our target market includes pregnant mothers, new mothers, and families
          seeking high-quality milk products for their babies. With a growing
          awareness of the importance of nutrition during pregnancy and infancy,
          Mama-Baby aims to meet the increasing demand for premium milk
          products in the market.
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
        <Typography variant="body1" gutterBottom style={{ textAlign: "left" }}>
          Mama-Baby stands out in the market due to our commitment to quality,
          personalized service, and focus on customer satisfaction. We source
          our milk products from trusted suppliers, ensuring they meet the
          highest standards of safety and quality.
        </Typography>
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
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
            onClick={() => window.scrollTo(0, 0)}
          >
            Explore more
          </Link>
        </Button>
      </Container>
    </>
  );
};

export default Introduction;