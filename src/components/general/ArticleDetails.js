import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Box,
  Button,
  Avatar,
  Breadcrumbs,
  CardHeader,
  CircularProgress,
  Tooltip,
  Fade,
  CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";
import { articleByIdApi, getArticlesNoPageApi } from "../../api/ArticleAPI";
import { allProductCHApi } from "../../api/ProductAPI";
import { storeByIdApi } from "../../api/StoreAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [article, setArticle] = useState(null);
  const [allArticle, setAllArticle] = useState(null);
  const [store, setStore] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const articleId = state?.articleId;
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);

  const fetchData = async () => {
    try {
      const [articleRes, allArticleRes, productRes] = await Promise.all([
        articleByIdApi(articleId),
        getArticlesNoPageApi(),
        allProductCHApi({
          type: "WHOLESALE",
        }),
      ]);

      const articleData = articleRes?.data?.data || {};
      const allArticleData = allArticleRes?.data?.data?.articles || {};
      const productData = productRes?.data?.data.products || [];
      setAllArticle(allArticleData);
      setArticle(articleData);

      const filterProduct = productData.filter(
        (product) => product.id === articleData.product_recom
      );
      setProduct(filterProduct[0]);

      const storeId = articleData.store_id;
      storeByIdApi(storeId)
        .then((storeRes) => {
          const storeData = storeRes?.data?.data || {};
          setStore(storeData);
        })
        .catch((err) => {
          console.log("Error fetching store data:", err);
        });

      const filterArticles = allArticleData.filter(
        (item) => item.id !== articleId
      );

      const getRandomArticles = (articles, num) => {
        let shuffled = articles.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      };
      setRelatedArticles(getRandomArticles(filterArticles, 3));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchData();
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [articleId]);

  if (loading) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return (
      <Container sx={{ mb: 2 }}>
        <Grid sx={{ my: 4 }}>
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
            <Link
              to="/articles"
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
                Articles
              </Typography>
            </Link>
          </Breadcrumbs>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              maxWidth: "100vw",
            }}
          >
            <CircularProgress sx={{ color: "#ff469e" }} size={100} />
          </Box>
        </Grid>
      </Container>
    );
  }

  // Chia nội dung thành các đoạn
  const paragraphs = article?.content.split("\n");

  return (
    <Container sx={{ mb: 2 }}>
      <Grid sx={{ my: 4 }}>
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
          <Link
            to="/articles"
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
              Articles
            </Typography>
          </Link>
          <Typography
            sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
          >
            {article?.header.length > 30
              ? `${article?.header.substring(0, 30)}...`
              : article?.header}
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box
        sx={{
          backgroundColor: "#ff69b4",
          padding: 1,
          textAlign: "center",
          color: "white",
          borderRadius: "10px",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4">{article?.header}</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: "10px",
              boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    border: "2px solid #ff469e",
                    height: 40,
                    width: 40,
                  }}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdZJVlDPE_mC28sugfpG-HdgSViHPXDHL5ww&s"
                    alt="Shop Logo"
                    style={{
                      borderRadius: "50%",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </Avatar>
              }
              title={
                <Typography
                  onClick={() => {
                    navigate(`/stores/${store.id}`, {
                      state: { storeId: store.id },
                    });
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "#ff469e",
                    },
                  }}
                >
                  {store?.name_store}
                </Typography>
              }
              subheader={new Date(article?.created_at).toLocaleDateString()}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    article?.link_image.includes("Article_")
                      ? `http://localhost:8080/mamababy/article/images/${article?.link_image}`
                      : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                  }
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                  }}
                  alt={article?.header}
                  style={{
                    width: "600px",
                    height: "400px",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </Box>

              <Typography variant="body1" mt={5}>
                {/* Nội dung bài báo ở đây */}
                {paragraphs?.map((paragraph, index) => (
                  <React.Fragment key={index}>
                    <Typography
                      variant="body1"
                      style={{
                        wordWrap: "break-word",
                        textAlign: "justify",
                        marginBottom: "20px",
                      }}
                    >
                      {paragraph}
                    </Typography>
                  </React.Fragment>
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: "sticky",
              top: -200,
            }}
          >
            <Card
              sx={{
                borderRadius: "10px",
                boxShadow:
                  "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
              }}
            >
              <CardContent>
                <Typography variant="h6">Related Articles</Typography>
                <Box mt={2}>
                  {relatedArticles?.map((relatedArticle) => (
                    <Card
                      sx={{
                        mb: 2,
                        padding: 2,
                        backgroundColor: "#fff0f5",
                        borderRadius: "10px",
                        boxShadow:
                          "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
                        cursor: "pointer",
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            "0 4px 8px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.22)",
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => {
                        navigate(
                          `/article/${relatedArticle.header
                            .toLowerCase()
                            .replace(/\s/g, "-")}`,
                          { state: { articleId: relatedArticle.id } }
                        );
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1">
                          {relatedArticle.header.length > 30
                            ? `${relatedArticle.header.substring(0, 30)}...`
                            : relatedArticle.header}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "gray", textAlign: "left" }}
                        >
                          {relatedArticle.content.length > 100
                            ? relatedArticle.content.substring(0, 100) + "..."
                            : relatedArticle.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
            <Card
              sx={{
                mt: 3,
                borderRadius: "10px",
                boxShadow:
                  "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
              }}
            >
              <CardContent>
                <Typography variant="h6">Product Recommendation</Typography>
                <Box
                  mt={2}
                  textAlign="center"
                  sx={{
                    padding: "10px",
                    position: "relative",
                    minHeight: "150px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip
                    title={product?.name}
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
                    <img
                      src={
                        product?.image_url &&
                        product?.image_url.includes("Product_")
                          ? `http://localhost:8080/mamababy/products/images/${product?.image_url}`
                          : "https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-3328225-2809510.png?f=webp"
                      }
                      onError={(e) => {
                        e.target.src =
                          "https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-3328225-2809510.png?f=webp";
                      }}
                      alt={product?.name}
                      style={{
                        width: "300px",
                        height: "200px",
                        objectFit: "contain",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onClick={() => {
                        if (!product) {
                          toast.warn(
                            "Sorry, the product is currently not available."
                          );
                        } else {
                          navigate(
                            `/products/${product.name
                              .toLowerCase()
                              .replace(/\s/g, "-")}`,
                            { state: { productId: product.id } },
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            })
                          );
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0px 4px 8px rgba(0, 0, 0, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.95)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                    />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
