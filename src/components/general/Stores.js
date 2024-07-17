import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import { allStoreApi } from "../../api/StoreAPI";
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardMedia,
  Container,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import { KeyboardCapslock } from "@mui/icons-material";

export default function HomePage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [store, setStore] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    {
      image: "https://cdn1.concung.com/img/adds/2024/04/1714120748-HOME.png",
    },
    {
      image:
        "https://cdn1.concung.com/img/adds/2024/04/1713941097-HOME-KIDESSENTIALS.png",
    },
    {
      image: "https://cdn1.concung.com/img/adds/2024/05/1715592332-HOME.png",
    },
  ];

  const fetchData = async () => {
    try {
      const storeRes = await allStoreApi({
        page: currentPage - 1,
      });
      setStore(storeRes?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    fetchData();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return (
      <div style={{ backgroundColor: "#f5f7fd" }}>
        <Container>
          <Grid item xs={12}>
            <Carousel
              PrevIcon={<ArrowLeft />}
              NextIcon={<ArrowRight />}
              height="240px"
              animation="slide"
              duration={500}
              navButtonsProps={{
                style: {
                  backgroundColor: "white",
                  color: "#ff469e",
                },
              }}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "16px",
                position: "relative",
                marginBottom: "2rem",
                overflow: "hidden",
              }}
              indicatorContainerProps={{
                style: {
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 99,
                },
              }}
              indicatorIconButtonProps={{
                style: {
                  color: "whitesmoke",
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: "12px",
                  height: "12px",
                  margin: "0 4px",
                },
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: "#ff469e",
                  backgroundColor: "#ff469e",
                  border: "1px solid white",
                  borderRadius: "8px",
                  width: "28px",
                  height: "12px",
                },
              }}
            >
              {items.map((item, i) => (
                <div
                  onClick={() => navigate("/article")}
                  key={i}
                  style={{
                    padding: 20,
                    textAlign: "center",
                    backgroundImage: `url(${item.image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    color: "white",
                    borderRadius: "16px",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </Carousel>
          </Grid>
          <Container sx={{ my: 4 }}>
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
                Store List
              </Typography>
            </Breadcrumbs>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                maxWidth: "100vw",
                mt: -20,
              }}
            >
              <CircularProgress sx={{ color: "#ff469e" }} size={100} />
            </Box>
          </Container>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f7fd" }}>
      <Container>
        <Grid item xs={12}>
          <Carousel
            PrevIcon={<ArrowLeft />}
            NextIcon={<ArrowRight />}
            height="240px"
            animation="slide"
            duration={500}
            navButtonsProps={{
              style: {
                backgroundColor: "white",
                color: "#ff469e",
              },
            }}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "16px",
              position: "relative",
              marginBottom: "2rem",
              overflow: "hidden",
            }}
            indicatorContainerProps={{
              style: {
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99,
              },
            }}
            indicatorIconButtonProps={{
              style: {
                color: "whitesmoke",
                backgroundColor: "black",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                margin: "0 4px",
              },
            }}
            activeIndicatorIconButtonProps={{
              style: {
                color: "#ff469e",
                backgroundColor: "#ff469e",
                border: "1px solid white",
                borderRadius: "8px",
                width: "28px",
                height: "12px",
              },
            }}
          >
            {items.map((item, i) => (
              <div
                onClick={() => navigate("/article")}
                key={i}
                style={{
                  padding: 20,
                  textAlign: "center",
                  backgroundImage: `url(${item.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
              ></div>
            ))}
          </Carousel>
        </Grid>

        <Container sx={{ my: 4 }}>
          <Breadcrumbs separator=">" sx={{ color: "black" }}>
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
              Store List
            </Typography>
          </Breadcrumbs>
        </Container>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {store?.stores?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Tooltip
                    title={item.name_store}
                    enterDelay={500}
                    leaveDelay={50}
                    placement="right-start"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 250 }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: "white",
                          boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.16)",
                          color: "black",
                          borderRadius: "8px",
                          border: "1px solid black",
                          fontSize: "12px",
                        },
                      },
                    }}
                  >
                    <Card
                      onClick={() => (
                        navigate(`/stores/${item.id}`, {
                          state: { storeId: item.id },
                        }),
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      )}
                      sx={{
                        padding: 2,
                        border: "1px solid #f5f7fd",
                        borderRadius: "16px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        transition: "border 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          border: "1px solid #ff469e",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                        alt={item.name_store}
                        sx={{ width: "64px", height: "64px", margin: "auto" }}
                      />
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            marginTop: "0.75rem",
                            textAlign: "center",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            maxWidth: "100%",
                            lineHeight: "1.2rem",
                            maxHeight: "2.4rem",
                          }}
                        >
                          {item.name_store.length > 40
                            ? `${item.name_store.substring(0, 40)}...`
                            : item.name_store}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "gray", textAlign: "center" }}
                        >
                          {item.address}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={store.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton={store.totalPages !== 1}
            showLastButton={store.totalPages !== 1}
            hidePrevButton={currentPage === 1}
            hideNextButton={currentPage === store.totalPages}
            size="large"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2.5rem",
              width: "70%",
              p: 1,
              opacity: 0.9,
              borderRadius: "20px",
              "& .MuiPaginationItem-root": {
                backgroundColor: "white",
                borderRadius: "20px",
                border: "1px solid black",
                boxShadow: "0px 2px 3px rgba(0, 0, 0.16, 0.5)",
                mx: 1,
                transition:
                  "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#fff4fc",
                  color: "#ff469e",
                  border: "1px solid #ff469e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ff469e",
                  color: "white",
                  border: "1px solid #ff469e",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    border: "1px solid #ff469e",
                  },
                },
                fontSize: "1.25rem",
              },
              "& .MuiPaginationItem-ellipsis": {
                mt: 1.25,
                fontSize: "1.25rem",
              },
            }}
            componentsProps={{
              previous: {
                sx: {
                  fontSize: "1.5rem",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  },
                },
              },
              next: {
                sx: {
                  fontSize: "1.5rem",
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    transition:
                      "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  },
                },
              },
            }}
          />
        </Box>

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
  );
}
