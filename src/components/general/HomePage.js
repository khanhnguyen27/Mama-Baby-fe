import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import KeyboardCapslock from "@mui/icons-material/KeyboardCapslock";
import React, { useEffect, useState } from "react";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  const [age, setAge] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  var items = [
    {
      name: "Random Name #1",
      description: "Learn Carousel!",
      image: "https://cdn1.concung.com/img/adds/2024/04/1714120748-HOME.png",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      image:
        "https://cdn1.concung.com/img/adds/2024/04/1713941097-HOME-KIDESSENTIALS.png",
    },
    {
      name: "Random Name #3",
      description: "Bye World!",
      image: "https://cdn1.concung.com/img/adds/2024/05/1715592332-HOME.png",
    },
  ];

  useEffect(() => {
    allAgeApi()
      .then((res) => setAge(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    allBrandApi()
      .then((res) => setBrand(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    allCategorytApi()
      .then((res) => setCategory(res?.data?.data))
      .catch((err) => console.log(err));
  }, []);

    return (
    <div style={{ backgroundColor: "#f5f7fd" }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <div
              sx={{
                position: "sticky",
                top: "8rem",
                border: "1px solid #ff469e",
                borderRadius: "10px",
                backgroundColor: "white",
                width: "270px",
                marginTop: visible ? "7rem" : "",
                padding: "16px 4px",
              }}
            >
              {/* <Accordion disableGutters>
                <AccordionSummary>
                  <Typography sx={{fontWeight: "bold", fontSize: "18px", marginBottom: "2px"}}>Filter</Typography>
                </AccordionSummary>
              </Accordion> */}
              <Accordion
                disableGutters
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel1"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel1" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel1" ? "white" : "black",
                    },
                    "&:hover": {
                      backgroundPosition: "top",
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      "& .MuiSvgIcon-root": {
                        color: "#ff469e",
                      },
                    },
                  }}
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Age
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container>
                    {age?.map((item) => (
                      <Grid item xs={12} lg={6}>
                        <ListItem
                          key={item.id}
                          sx={{
                            padding: "0.5rem 1rem",
                            borderRadius: "30px",
                            background:
                              "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                            backgroundSize: "200% 100%",
                            cursor: "pointer",
                            transition:
                              "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                            "&:hover": {
                              backgroundPosition: "left",
                              color: "#ff469e",
                              border: "1px solid #ff496e",
                            },
                          }}
                        >
                          <ListItemText>• {item.rangeAge}</ListItemText>
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion
                disableGutters
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel2"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel2" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel2" ? "white" : "black",
                    },
                    "&:hover": {
                      backgroundPosition: "top",
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      "& .MuiSvgIcon-root": {
                        color: "#ff469e",
                      },
                    },
                  }}
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Brand
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container>
                    {brand?.map((item) => (
                      <Grid item xs={12} lg={6}>
                        <ListItem
                          key={item.id}
                          sx={{
                            padding: "0.5rem 1rem",
                            borderRadius: "30px",
                            background:
                              "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                            backgroundSize: "200% 100%",
                            cursor: "pointer",
                            transition:
                              "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                            "&:hover": {
                              backgroundPosition: "left",
                              color: "#ff469e",
                              border: "1px solid #ff496e",
                            },
                          }}
                        >
                          <ListItemText>• {item.name}</ListItemText>
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion
                disableGutters
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  sx={{
                    padding: "2px 1rem",
                    background:
                      expanded === "panel3"
                        ? "#ff469e"
                        : "linear-gradient(to top, white 50%, #fff4fc 50%) bottom",
                    color: expanded === "panel3" ? "white" : "black",
                    backgroundSize: "100% 200%",
                    border: "2px solid #fff4fc",
                    transition:
                      "background 0.4s ease-in-out, color 0.4s ease-in-out",
                    "& .MuiSvgIcon-root": {
                      color: expanded === "panel3" ? "white" : "black",
                    },
                    "&:hover": {
                      backgroundPosition: "top",
                      backgroundColor: "#fff4fc",
                      color: "#ff469e",
                      "& .MuiSvgIcon-root": {
                        color: "#ff469e",
                      },
                    },
                  }}
                  expandIcon={<ArrowDropDown />}
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Category
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {category?.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        padding: "0.5rem 1rem",
                        borderRadius: "30px",
                        background:
                          "linear-gradient(to left, white 50%, #fff4fc 50%) right",
                        backgroundSize: "200% 100%",
                        cursor: "pointer",
                        transition:
                          "background 0.5s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                        "&:hover": {
                          backgroundPosition: "left",
                          color: "#ff469e",
                          border: "1px solid #ff496e",
                        },
                      }}
                    >
                      <ListItemText>• {item.name}</ListItemText>
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>

          <Grid item xs={9}>
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
                border: "1px solid black",
                borderRadius: "16px",
                position: "relative",
                marginBottom: "2rem",
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
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body1">{item.description}</Typography>
                </div>
              ))}
            </Carousel>
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
  );
}
