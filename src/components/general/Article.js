import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { allAgeApi } from "../../api/AgeAPI";
import { allBrandApi } from "../../api/BrandAPI";
import { allCategorytApi } from "../../api/CategoryAPI";
import { allProductApi } from "../../api/ProductAPI";
import Carousel from "react-material-ui-carousel";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import { allStoreApi } from "../../api/StoreAPI";
import { allArticleApi } from "../../api/ArticleAPI";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { KeyboardCapslock } from "@mui/icons-material";
export default function HomePage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [age, setAge] = useState([]);
  const [ageMap, setAgeMap] = useState({});
  const [brand, setBrand] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [category, setCategory] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [product, setProduct] = useState([]);
  const [ageFilter, setAgeFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [store, setStore] = useState([]);
  const [storeMap, setStoreMap] = useState([]);
  const [article, setArticle] = useState([]);

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
      image:
        "https://cdn1.concung.com/storage/data/2021/thong-tin-bo-ich/2024/04/Vitamin-D3K2-the-he-moi---chia-khoa-giup-tre-tang-chieu-cao-toi-da-anh-1-1678954379-524-width1082height443.webp",
    },
    {
      image:
        "https://cdn1.concung.com/storage/data/2021/thong-tin-bo-ich/2021/11/moony-natural-gia-bao-nhieu.webp",
    },
    {
      image:
        "https://cdn1.concung.com/storage/data/2021/thong-tin-bo-ich/2024/03/friso%20pro.webp",
    },
  ];

  // useEffect(() => {  // Old way to get data from API
  //   allAgeApi({ brand_id: 1, category_id: 4})
  //     .then((res) => {
  //       setAge(res?.data?.data);
  //       const ageMap = age.reduce((x, item) => { // Create a list of item based on id of other variables (age, brand, category, etc.) from product
  //         x[item.id] = item.rangeAge;
  //         return x;
  //       }, {});
  //       setAgeMap(ageMap);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const fetchData = async () => {
    try {
      const [ageRes, brandRes, categoryRes, productRes, storeRes, articleRes] =
        await Promise.all([
          allAgeApi(),
          allBrandApi(),
          allCategorytApi(),
          allProductApi({
            age_id: ageFilter,
            brand_id: brandFilter,
            category_id: categoryFilter,
          }),
          allStoreApi(),
          allArticleApi(),
        ]);

      const ageData = ageRes?.data?.data || [];
      const brandData = brandRes?.data?.data || [];
      const categoryData = categoryRes?.data?.data || [];
      const productData = productRes?.data?.data || [];
      const storeData = storeRes?.data?.data || [];
      const articleData = articleRes?.data?.data || [];

      setAge(ageData);
      setBrand(brandData);
      setCategory(categoryData);
      setProduct(productData);
      setStore(storeData);
      setArticle(articleData);
      console.log(store);

      const ageMap = ageData.reduce((x, item) => {
        x[item.id] = item.rangeAge;
        return x;
      }, {});
      setAgeMap(ageMap);

      const brandMap = brandData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setBrandMap(brandMap);

      const categoryMap = categoryData.reduce((x, item) => {
        x[item.id] = item.name;
        return x;
      }, {});
      setCategoryMap(categoryMap);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setTimeout(() => {}, 1000);
    console.log(fetchData());
    fetchData();
  }, [ageFilter, brandFilter, categoryFilter]);

  return (
    <Container>
      {/* Banner */}
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
          {items?.map((item, i) => (
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
            ></div>
          ))}
        </Carousel>
      </Grid>

      <Grid container spacing={3}>
        {/* List Store */}
        <Grid item xs={12} md={15}>
          <Grid container spacing={3}>
            {article?.map((item, index) => (
              <Grid item xs={40} sm={5} md={4} key={index}>
                <Tooltip
                  title={item.content}
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
                    //   onClick={() => navigate(`/stores/${item.id}`)}
                    sx={{
                      minWidth: 180,
                      padding: 2,
                      border: "1px solid #f5f7fd",
                      borderRadius: "16px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                      transition: "border 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        border: "1px solid #ff469e",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image="https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                      alt={item.content}
                      sx={{ width: "64px", height: "64px", margin: "auto" }}
                    />
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          marginTop: "0.75rem",
                          textAlign: "left",
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
                        {item.content.length > 40
                          ? `${item.content.substring(0, 40)}...`
                          : item.content}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "gray", textAlign: "left" }}
                      >
                        ${item.header}
                      </Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
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
  );
}