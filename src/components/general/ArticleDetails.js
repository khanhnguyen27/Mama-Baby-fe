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
} from "@mui/material";
import { Link } from "react-router-dom";
import { articleByIdApi, getArticlesNoPageApi } from "../../api/ArticleAPI";
import { storeByIdApi } from "../../api/StoreAPI";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

export default function ArticleDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [article, setArticle] = useState(null);
  const [allArticle, setAllArticle] = useState(null);
  const [store, setStore] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const articleId = state?.articleId;

  const fetchData = async () => {
    try {
      const [articleRes, allArticleRes] = await Promise.all([
        articleByIdApi(articleId),
        getArticlesNoPageApi(),
      ]);

      const articleData = articleRes?.data?.data || {};
      const allArticleData = allArticleRes?.data?.data?.articles || {};
      setAllArticle(allArticleData);
      setArticle(articleData);

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
  }, [articleId]);

  if (!article) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          height: "100vh",
          animation: "fadeIn 10s ease-in",
          margin: "auto",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  // Chia nội dung thành các đoạn
  const paragraphs = article.content.split("\n");

  return (
    // <div
    //   style={{
    //     backgroundColor: "#f5f7fd",
    //     padding: "20px",
    //   }}
    // >
    //   <Container sx={{ my: 4 }}>
    //     <Breadcrumbs separator=">" sx={{ color: "black" }}>
    //       <Link to="/" style={{ textDecoration: "none" }}>
    //         <Typography
    //           sx={{
    //             color: "black",
    //             transition: "color 0.2s ease-in-out",
    //             fontSize: 20,
    //             fontWeight: "bold",
    //             "&:hover": {
    //               textDecoration: "underline",
    //             },
    //           }}
    //         >
    //           Home
    //         </Typography>
    //       </Link>
    //       <Link to="/article" style={{ textDecoration: "none" }}>
    //         <Typography
    //           sx={{
    //             color: "black",
    //             transition: "color 0.2s ease-in-out",
    //             fontSize: 20,
    //             fontWeight: "bold",
    //             "&:hover": {
    //               textDecoration: "underline",
    //             },
    //           }}
    //         >
    //           Articles
    //         </Typography>
    //       </Link>
    //       <Typography
    //         sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}
    //       >
    //         {article.header}
    //       </Typography>
    //     </Breadcrumbs>
    //   </Container>
    //   <Container
    //     sx={{
    //       my: 4,
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //     }}
    //   >
    //     <Card
    //       style={{
    //         backgroundColor: "#fff4fc",
    //         boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.24)",
    //         border: "3px solid #ff469e",
    //         color: "black",
    //         padding: "20px",
    //         maxWidth: "900px",
    //         width: "100%",
    //       }}
    //     >
    //       <CardContent>
    //         <Typography
    //           variant="h4"
    //           style={{
    //             wordWrap: "break-word",
    //             fontWeight: "700",
    //             textAlign: "left",
    //             marginBottom: "20px",
    //           }}
    //         >
    //           {article.header}
    //         </Typography>
    //         <Typography
    //           variant="body2"
    //           style={{
    //             wordWrap: "break-word",
    //             textAlign: "left",
    //             color: "#888",
    //             marginBottom: "20px",
    //           }}
    //         >
    //           Created at: {new Date(article.created_at).toLocaleDateString()}
    //         </Typography>
    //         {paragraphs.map((paragraph, index) => (
    //           <React.Fragment key={index}>
    //             <Typography
    //               variant="body1"
    //               style={{
    //                 wordWrap: "break-word",
    //                 textAlign: "justify",
    //                 marginBottom: "20px",
    //               }}
    //             >
    //               {paragraph}
    //             </Typography>
    //             {index === Math.floor(paragraphs.length / 2) && (
    //               <Box
    //                 sx={{
    //                   textAlign: "center",
    //                   marginBottom: "20px",
    //                 }}
    //               >
    //                 <img
    //                   style={{
    //                     width: "100%",
    //                     maxWidth: "600px",
    //                     height: "auto",
    //                     borderRadius: "10px",
    //                   }}
    //                   src={
    //                     article.link_image.includes("Article_")
    //                       ? `http://localhost:8080/mamababy/article/images/${article.link_image}`
    //                       : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
    //                   }
    //                   onError={(e) => {
    //                     e.target.src =
    //                       "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
    //                   }}
    //                   alt={article.header}
    //                 />
    //               </Box>
    //             )}
    //           </React.Fragment>
    //         ))}
    //         {/* <Box
    //                         sx={{
    //                             display: "flex",
    //                             justifyContent: "center",
    //                         }}
    //                     >
    //                         <Button
    //                             variant="contained"
    //                             href={article.link_product}
    //                             target="_blank"
    //                             sx={{
    //                                 backgroundColor: "white",
    //                                 color: "#ff469e",
    //                                 borderRadius: "20px",
    //                                 fontSize: "0.95rem",
    //                                 fontWeight: "bold",
    //                                 boxShadow: "none",
    //                                 transition:
    //                                     "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
    //                                 border: "1px solid #ff469e",
    //                                 "&:hover": {
    //                                     backgroundColor: "#ff469e",
    //                                     color: "white",
    //                                 },
    //                             }}
    //                         >
    //                             View Product
    //                         </Button>
    //                     </Box> */}
    //       </CardContent>
    //     </Card>
    //   </Container>
    // </div>
    <Container sx={{ mb: 2 }}>
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
        <Typography variant="h4">{article.header}</Typography>
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
              subheader={new Date(article.created_at).toLocaleDateString()}
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
                    article.link_image.includes("Article_")
                      ? `http://localhost:8080/mamababy/article/images/${article.link_image}`
                      : "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid"
                  }
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.freepik.com/256/2652/2652218.png?semt=ais_hybrid";
                  }}
                  alt={article.header}
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
                {paragraphs.map((paragraph, index) => (
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
                  {relatedArticles.map((relatedArticle) => (
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
                <Typography variant="h6">Advertisement</Typography>
                <Box mt={2} textAlign="center">
                  <img
                    src="https://via.placeholder.com/300x200" // Thay bằng link hình ảnh quảng cáo của bạn
                    alt="Advertisement"
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
