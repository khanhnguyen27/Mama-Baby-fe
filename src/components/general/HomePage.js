import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [visible, setVisible] = useState(false);
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
  return (
    <div style={{ backgroundColor: "#f5f7fd" }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <List
              sx={{
                position: "sticky",
                top: "8rem",
                border: "1px solid #ff469e",
                borderRadius: "10px",
                backgroundColor: "white",
                marginTop: visible ? "7rem" : "",
              }}
            >
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemText primary="Mama's Milks" />
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowRight sx={{ color: "inherit" }} />
                  {/* <svg
                    width="20"
                    height="20"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 1.51807 0.857178 L 5.04307 4.54289 C 5.41807 4.91789 5.64307 5.51789 5.64307 6.11789 C 5.64307 6.71789 5.41807 7.31789 4.96807 7.69289 L 1.51807 11.1429"
                      stroke="black"
                      fill="none"
                    />
                  </svg> */}
                </ListItemIcon>
              </ListItem>
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemText primary="Baby's Milks" />
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowRight sx={{ color: "inherit" }} />
                </ListItemIcon>
              </ListItem>
              <ListItem
                sx={{
                  "&:hover": {
                    backgroundColor: "#fff4fc",
                    color: "#ff469e",
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemText primary="Other Milks" />
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowRight sx={{ color: "inherit" }} />
                </ListItemIcon>
              </ListItem>
            </List>
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
      </Container>
    </div>
  );
}
