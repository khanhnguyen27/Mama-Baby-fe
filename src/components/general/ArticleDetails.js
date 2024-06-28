import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Card, CardContent, Grid, Paper, Box, Button, Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import { articleByIdApi } from "../../api/ArticleAPI";

export default function ArticleDetail() {
    const { state } = useLocation();
    const [article, setArticle] = useState(null);
    const articleId = state?.articleId;

    const fetchData = async () => {
        try {
            const articleRes = await articleByIdApi(articleId);
            const articleData = articleRes?.data?.data || {};
            setArticle(articleData);
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
        return <Typography>Loading...</Typography>;
    }

    // Chia nội dung thành các đoạn
    const paragraphs = article.content.split("\n");

    return (
        <div
            style={{
                backgroundColor: "#f5f7fd",
                padding: "20px",
            }}
        >
            <Container sx={{ my: 4 }}>
                <Breadcrumbs separator=">" sx={{ color: "black" }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
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
                    <Link to="/article" style={{ textDecoration: "none" }}>
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
                    <Typography sx={{ fontWeight: "700", fontSize: 20, color: "#ff469e" }}>
                        {article.header}
                    </Typography>
                </Breadcrumbs>
            </Container>
            <Container
                sx={{
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card
                    style={{
                        backgroundColor: "#fff4fc",
                        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.24)",
                        border: "3px solid #ff469e",
                        color: "black",
                        padding: "20px",
                        maxWidth: "900px",
                        width: "100%",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            style={{
                                wordWrap: "break-word",
                                fontWeight: "700",
                                textAlign: "left",
                                marginBottom: "20px",
                            }}
                        >
                            {article.header}
                        </Typography>
                        <Typography
                            variant="body2"
                            style={{
                                wordWrap: "break-word",
                                textAlign: "left",
                                color: "#888",
                                marginBottom: "20px",
                            }}
                        >
                            Created at: {new Date(article.created_at).toLocaleDateString()}
                        </Typography>
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
                                {index === Math.floor(paragraphs.length / 2) && (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <img
                                            style={{
                                                width: "100%",
                                                maxWidth: "600px",
                                                height: "auto",
                                                borderRadius: "10px",
                                            }}
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
                                        />
                                    </Box>
                                )}
                            </React.Fragment>
                        ))}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="contained"
                                href={article.link_product}
                                target="_blank"
                                sx={{
                                    backgroundColor: "white",
                                    color: "#ff469e",
                                    borderRadius: "20px",
                                    fontSize: "0.95rem",
                                    fontWeight: "bold",
                                    boxShadow: "none",
                                    transition:
                                        "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                                    border: "1px solid #ff469e",
                                    "&:hover": {
                                        backgroundColor: "#ff469e",
                                        color: "white",
                                    },
                                }}
                            >
                                View Product
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
