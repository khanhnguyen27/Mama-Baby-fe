import { Box, Breadcrumbs, Container, Typography } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Policy() {
  const navigate = useNavigate();
  return (
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
            Warranty Policy
          </Typography>
        </Breadcrumbs>
      </Container>
      <Container
        sx={{
          mt: 2,
          animation: "fadeInPolicy 1.5s ease-in-out",
          "@keyframes fadeInPolicy ": {
            from: {
              opacity: 0,
              transform: "translateY(10%)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Our policy while shopping
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "600", color: "#ff469e" }}>
          I/ Shopping Guide:
        </Typography>
        <br />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            1/ Online Shopping:
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              -{" "}
              <span
                style={{
                  color: "#ff469e",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
                onClick={() => navigate("/signin")}
              >
                Login
              </span>{" "}
              with your account, using username and password (Consider that your
              username must be unique, at least 6 characters and contain no
              spaces, while your password is at least 8 characters). Please sign
              up at{" "}
              <span
                style={{
                  color: "#ff469e",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
                onClick={() => navigate("/signup")}
              >
                here
              </span>
              .
            </Typography>
            <br />
            <Typography>
              - Registered at Mama-Baby helps you save your products in cart,
              review your orders' history and rating our products. Also can
              check your accumulated points received through shopping to earn
              our gift with exchange gifts events.
            </Typography>
          </Box>
          <br />
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            2/ Direct Shopping:
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              - Go to our nearest store and buy what you need, you can redeem
              some vouchers from our store to earn big sales for each time you
              go shopping. Also have a chance to join limited events with
              amazing prizes and official gifts from our sponsors.
            </Typography>
            <br />
            <Typography>
              - Contact to our hotline for more information (1900 0019)
            </Typography>
          </Box>
          <br />
          <Typography
            variant="h6"
            sx={{ color: "#ff469e", fontWeight: "600", fontStyle: "italic" }}
          >
            After complete shopping, we will call you using your phone number to
            confirm your order and get it ready to deliver.
          </Typography>
          <br />
        </Box>
        <br />
        <Typography variant="h5" sx={{ fontWeight: "600", color: "#ff469e" }}>
          II/ How to Pre-order:
        </Typography>
        <br />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            1/ What is Pre-order product:
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              - These are products shown as "COMING SOON" status in product
              list, have a long preparation time, the expected delivery date is
              maximum 15 days. Pre-order products are mainly items that are
              specifically ordered according to the Buyer's request or products
              that require special handling.
            </Typography>
            <br />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            2/ Pre-order process:
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              • Step 1: Customers contact the store to initiate a pre-order
              request. A staff from the store that has products you want to
              pre-order will assist you. process.
              <br />
              • Step 2: Customers must make a prepayment of 30% of the total
              price for the pre-order.
              <br />
              • Step 3: The pre-order will be processed, and an estimated
              delivery date will be provided. Please note that the delivery will
              typically occur after 15 days.
              <br />
              • Step 4: Mama-Baby will keep customers updated on the status of
              their pre-order.
              <br />• Step 5: Customers will receive their pre-ordered product
              as per the estimated delivery date.
            </Typography>
            <br />
          </Box>
        </Box>
        <br />
        <Typography variant="h5" sx={{ fontWeight: "600", color: "#ff469e" }}>
          III/ Exchange and Refund Policy:
        </Typography>
        <br />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            1/ Exchange/Return terms and conditions:
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              - The deadline for exchanging items purchased at Mama-Baby is 15
              days from the date of shipment. Exchanged goods must be 100% new
              and unused, with original labels, original boxes, accessories,
              warranty card and accompanying gifts (if any). Mama-Baby does not
              exchange used or warranty-activated goods. Products purchased at
              Mama-Baby supermarket can be exchanged at the supermarket where
              the product was purchased. For products purchased online, please
              contact hotline 1900 0019 or email Mama-Baby_Official@gmail.com
              for instructions. You can call the hotline for instructions.
            </Typography>
            <br />
            <Typography>
              - If the product is defective, you need to notify Mama-Baby within
              15 days from the date of sale. Mama-Baby commits to quickly
              replace the product immediately for customers. If the product is
              no longer available, Mama-Baby will refund the money without any
              requirements in this case. Returns are not supported for online
              vouchers or products in promotions.
            </Typography>
            <br />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            2/ Product exchange/return process:
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              • Step 1: Customers contact the store or hotline: 1900 0019 or
              email: Mama-Baby_Official@gmail.com to request to exchange/return
              the product, Mama-Baby will guide you how to exchange/return the
              product. If the customer's product exchange/return process is
              valid.
              <br />
              • Step 2: Customers send products to Mama-Baby to receive
              according to the instructions above, either at the store or by
              post for products purchased online.
              <br />
              • Step 3: Mama-Baby receives the product and checks the product.
              <br />
              • Step 4: Mama-Baby transfers the product to the Supplier to
              process the exchange/return.
              <br />• Step 5: Customers receive a replacement product.
            </Typography>
            <br />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            3/ Refund policy for Online shopping :
          </Typography>
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography>
              - Orders purchased and paid online via domestic card (ATM) will be
              refunded in full or part of the paid amount. In the following
              cases:
              <br />
              + Products that are defective or out of stock cannot be delivered
              to customers
              <br />+ One or several products in the order cannot be delivered
              to the customer (refund a portion equivalent to the item value)
              <br />+ If refund all of products from an order that using a
              voucher, the maximum value we refund will equal to the final
              amount of that order, not the total amount of all products
            </Typography>
          </Box>
        </Box>
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h6"
            sx={{ color: "#ff469e", fontWeight: "600", textAlign: "right" }}
          >
            Mama-Baby is very pleasure to serve you!
          </Typography>
        </Box>
      </Container>
    </div>
  );
}
