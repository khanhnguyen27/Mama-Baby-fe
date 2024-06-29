import { Close } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') {
      return;
    }
    setLoading(true);
    if (searchTerm.length > 0 && searchTerm.length < 2){
      setLoading(false);
      return;
    }
    if (searchTerm === "") {
      setTimeout(() => {
        setLoading(false);
        navigate("/products");
      }, 2000);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      navigate(
        {
          pathname: "/products",
          search: `?keyword=${searchTerm}`,
        },
        { state: { keyword: searchTerm } }
      );
    }, 2000);
    setSearchTerm(null);
  };

  return (
    <div style={{ position: "relative", zIndex: "99" }}>
      <TextField
        placeholder="What do you want to buy?"
        size="small"
        variant="outlined"
        value={searchTerm}
        onKeyDown={handleSearch}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress sx={{ color: "#ff469e", mx: 2 }} size={24} />
              ) : (
                <>
                {searchTerm && (
                  <IconButton onClick={() => setSearchTerm("")} size="small">
                    <Close fontSize="small" />
                  </IconButton>
                )}
                <Button
                  onClick={handleSearch}
                  sx={{
                    backgroundColor: "#ff469e",
                    color: "white",
                    height: "40px",
                    borderRadius: "5px",
                    boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                    transition: "0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      opacity: 0.8,
                      color: "white",
                      boxShadow: "inset 1px 1px 3px rgba(0, 0, 0.16)",
                    },
                    "&:active": {
                      backgroundColor: "white",
                      color: "#ff469e",
                      boxShadow: "inset 1px 1px 3px rgba(255, 70, 158, 0.8)",
                    },
                  }}
                >
                  <SearchIcon
                    sx={{
                      color: "inherit",
                      cursor: "pointer",
                      fontSize: "35px",
                    }}
                  />
                </Button>
                </>
              )}
            </InputAdornment>
          ),
          sx: {
            width: { sm: "400px", md: "520px" },
            padding: 0,
            border: "2px solid #ff469e",
            borderRadius: "7px",
            backgroundColor: "white",
            transition: "0.2s ease-in-out",
            "&:hover": {
              border: "2px solid #ff469e",
            },
            "&:focus": {
              backgroundColor: "#F8F8F8",
            },
            "&.Mui-focused": {
              border: "1px solid #ff469e",
              backgroundColor: "#F8F8F8",
              boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.32)",
              outline: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default ProductSearch;
