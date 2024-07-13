import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { allPackageApi } from "../../api/PackagesAPI";

export default function FailedPackagePayment() {
  const [packageMap, setPackageMap] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = localStorage.getItem("accessToken");
  const decodedAccessToken = accessToken ? jwtDecode(accessToken) : null;
  const role = decodedAccessToken?.RoleID;

  useEffect(() => {
    if (!accessToken || role !== "STAFF") {
      window.location.replace("/staff/packages");
      return;
    }

    const fetchData = async () => {
      try {
        const packageRes = await allPackageApi();
        const packageData = packageRes?.data?.data || [];

        const packageMap = packageData.reduce((x, item) => {
          x[item.id] = item.package_name;
          return x;
        }, {});

        setPackageMap(packageMap);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [accessToken, role, location]);
  if (!accessToken || role !== "STAFF") {
    return null;
  }

  const query = new URLSearchParams(location.search);
  const packageId = query.get("packageId");

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        // padding: "50px 0",
        height: "100vh",
        background: "linear-gradient(to bottom, #ffe6f0 0%, #ff469e 50%) top",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            mt: 4,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <IconButton
            sx={{
              animation: "pulse 2s infinite alternate",
              "@keyframes pulse": {
                "0%": {
                  filter: "blur(0px)",
                },
                "50%": {
                  transform: "scale(1.2) skew(0deg)",
                },
                "100%": {
                  filter: "blur(0px)",
                },
              },
            }}
          >
            <Cancel sx={{ fontSize: 90, color: "white" }} />
          </IconButton>
          <Typography
            component="h1"
            sx={{
              mt: 3.5,
              ml: 3,
              color: "white",
              fontWeight: "bold",
              fontSize: "34px",
            }}
          >
            Payment Fail!
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{ mt: 2, color: "white", maxWidth: "65%" }}
        >
          Something wrong happened during your payment. Please contact admin to
          know more.
        </Typography>
        <Box
          sx={{
            display: "flex",
            mt: 5,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={() => navigate("/staff/packages")}
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#ff469e",
              borderRadius: "30px",
              fontSize: "1.25rem",
              fontWeight: "bold",
              mr: 4,
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
            Back To Packages Page
          </Button>
        </Box>
      </Box>
    </div>
  );
}
