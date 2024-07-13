import React, { useState, useEffect } from "react";
import { KeyboardCapslock } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
    Tabs,
    Container,
    Box,
    Tab,
    Typography,
    CircularProgress,
    Card,
    Grid,
    Divider,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { allPackageApi, updatePackageApi } from "../../api/PackagesAPI";

export default function PackageManagement() {
    window.document.title = "Package Management";
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [openUpdatePackage, setOpenUpdatePackage] = useState(false);
    const [packages, setpackages] = useState({
        0: [],
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            setVisible(scrollY > 70);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const packageRes = await allPackageApi();
            const packageData = packageRes.data.data || [];

            setpackages({
                0: packageData,
            });

            console.log("Package", packageData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (e, newValue) => {
        setLoading(true);
        setpackages(newValue);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const openUpdate = (item) => {
        setOpenUpdatePackage(true);
        setSelectedPackage(item);
    };

    const closeUpdate = () => {
        setOpenUpdatePackage(false);
    };

    const handleChange = (field, value) => {
        setSelectedPackage((prevPackage) => ({
            ...prevPackage,
            [field]: value,
        }));
    };

    const handleEdit = () => {
        const trimmedPackageName = selectedPackage.package_name.trim();

        if (packages[0].some(packages => packages.package_name.toLowerCase() === trimmedPackageName.toLowerCase() && packages.id !== selectedPackage.id)) {
            toast.error('Package name already exists.', { autoClose: 1500 });
            return;
        }

        if (!selectedPackage) {
            toast.warn("No package selected for editing.", { autoClose: 1500 });
            return;
        }

        updatePackageApi(
            selectedPackage.id,
            trimmedPackageName,
            selectedPackage.price,
            selectedPackage.month,
            selectedPackage.description,
        )
            .then(() => {
                fetchData();
                closeUpdate();
                toast.success("Package updated successfully.", { autoClose: 1500 });
            })
            .catch((error) => {
                console.error("Error updating package:", error);
                toast.error("Failed to update package. Please try again later.", { autoClose: 1500 });
            });
    };

    const formatMonths = (months) => {
        return `${months} month${months > 1 ? 's' : ''}`;
    };

    const formatCurrency = (value) => {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(1)} Bil vnd`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(1)} Mil VND`;
        } else if (value >= 1_000) {
            return `${(value / 1_000).toFixed(1)}K VND`;
        } else {
            return value;
        }
    };

    return (
        <div
            style={{
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <Container sx={{ my: 4 }}>
                <Tabs
                    value={packages}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{ style: { display: "none" } }}
                    sx={{
                        border: "1px solid #ff469e",
                        backgroundColor: "white",
                        borderRadius: "30px",
                        opacity: 0.95,
                    }}
                >
                    <Tab
                        label="PACKAGE"
                        sx={{
                            backgroundColor: 0 === 0 ? "#ff469e" : "#fff4fc",
                            color: 0 === 0 ? "white" : "#ff469e",
                            borderRadius: "20px",
                            m: 1,
                            fontWeight: "bold",
                            boxShadow: "none",
                            transition:
                                "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out",
                            border: "1px solid #ff469e",
                            "&:hover": {
                                backgroundColor: "#ff469e",
                                color: "white",
                            },
                            "&.Mui-selected": {
                                color: "white",
                            },
                        }}
                    />
                </Tabs>

                <Box sx={{ marginTop: 2 }}>
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: "60vh",
                                maxWidth: "100vw",
                                backgroundColor: "#f5f7fd",
                            }}
                        >
                            <CircularProgress sx={{ color: "#ff469e" }} size={70} />
                        </Box>
                    ) : packages[tabValue].length === 0 ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "60vh",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#ff469e",
                                    fontSize: "1.75rem",
                                    textAlign: "center",
                                }}
                            >
                                There's no packages in this tab
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} direction="row">
                            {packages[tabValue].map((item) => (
                                <Grid item xs={12} md={4} key={item.id}>
                                    <Card
                                        sx={{
                                            mb: "16px",
                                            padding: "16px",
                                            backgroundColor: "#ffffff",
                                            borderRadius: "20px",
                                            boxShadow: 4,
                                            transition: "0.3s ease-in-out",
                                            "&:hover": {
                                                boxShadow: 6,
                                                transform: "scale(1.02)",
                                                border: "1px solid #ff469e",
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{ mb: "10px", fontWeight: "bold" }}
                                        >
                                            Package No. {item.id}{" "}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: "5px",
                                                mt: 2,
                                                fontWeight: "small",
                                                fontSize: "1.2rem",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    display: "block",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                Package Detail:
                                            </span>
                                            <Divider
                                                sx={{
                                                    width: "90%",
                                                    my: 1,
                                                    borderColor: "rgba(0, 0, 0, 0.4)",
                                                    borderWidth: "1px",
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        width: "90%",
                                                    }}
                                                >
                                                    <span style={{ opacity: 0.7 }}>Name: </span>
                                                    <span style={{ fontWeight: "600" }}>
                                                        {item.package_name}
                                                    </span>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        width: "90%",
                                                    }}
                                                >
                                                    <span style={{ opacity: 0.7 }}>Price: </span>
                                                    <span style={{ fontWeight: "600" }}>
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        width: "90%",
                                                    }}
                                                >
                                                    <span style={{ opacity: 0.7 }}>Month: </span>
                                                    <span style={{ fontWeight: "600" }}>
                                                        {formatMonths(item.month)}
                                                    </span>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        width: "90%",
                                                    }}
                                                >
                                                    <span style={{ opacity: 0.7 }}>Description: </span>
                                                    <span style={{ fontWeight: "600" }}>
                                                        {item.description}
                                                    </span>
                                                </Box>
                                            </Box>
                                        </Typography>
                                        {tabValue === 0 && (
                                            <Grid item xs={12} sx={{ textAlign: "right" }}>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "white",
                                                        color: "#ff469e",
                                                        borderRadius: "10px",
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                        my: 2,
                                                        mx: 1,
                                                        transition:
                                                            "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                                        border: "1px solid #ff469e",
                                                        "&:hover": {
                                                            backgroundColor: "#ff469e",
                                                            color: "white",
                                                            border: "1px solid white",
                                                        },
                                                    }}
                                                    onClick={() => openUpdate(item)}
                                                >
                                                    Update
                                                </Button>
                                            </Grid>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {selectedPackage && (
                    <Dialog open={openUpdatePackage} onClose={closeUpdate}
                        PaperProps={{
                            style: {
                                borderRadius: 7,
                                boxShadow: "0px 2px 8px #ff469e",
                            },
                        }}>
                        <DialogTitle style={{
                            fontWeight: "bold",
                            color: "#333",
                            textAlign: "center",
                        }}>Edit Package</DialogTitle>
                        <DialogContent >
                            <TextField
                                label="Package Name"
                                value={selectedPackage.package_name}
                                type="text"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleChange("package_name", e.target.value)}
                            />
                            <TextField
                                label="Package Price"
                                value={selectedPackage.price}
                                type="number"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleChange("price", e.target.value)}
                            />
                            <TextField
                                label="Package Month"
                                value={selectedPackage.month}
                                type="number"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleChange("month", e.target.value)}
                            />
                            <TextField
                                label="Package Description"
                                value={selectedPackage.description}
                                type="text"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeUpdate} sx={{
                                backgroundColor: "#F0F8FF",
                                color: "#757575",
                                borderRadius: "30px",
                                fontWeight: "bold",
                                transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                border: "1px solid #757575",
                                "&:hover": {
                                    backgroundColor: "#757575",
                                    color: "white",
                                    border: "1px solid white",
                                },
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} sx={{
                                backgroundColor: "#F0F8FF",
                                color: "#ff469e",
                                borderRadius: "30px",
                                fontWeight: "bold",
                                transition:
                                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border 0.3s ease-in-out",
                                border: "1px solid #ff469e",
                                "&:hover": {
                                    backgroundColor: "#ff469e",
                                    color: "white",
                                    border: "1px solid white",
                                },
                            }}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}

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
        </div >
    );
}
