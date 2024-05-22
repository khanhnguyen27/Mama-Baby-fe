import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { useState } from "react";

const ProductSearch = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div style={{ position: "relative", zIndex: "99" }}>
      <TextField
        placeholder="What do you want to buy?"
        size="small"
        variant="outlined"
        // value={searchTerm}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#ff469e",
                    color: "white",
                    height: "40px",
                    marginRight: "0.6px",
                    borderRadius: "5px",
                    boxShadow: "1px 1px 3px rgba(0, 0, 0.16)",
                    transition: "0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#ff469e",
                      opacity: 0.8,
                      color: "white",
                      boxShadow: "inset 1px 1px 3px rgba(0, 0, 0.16)"
                    },
                    "&:active": {
                      backgroundColor: "white",
                      color: "#ff469e",
                      boxShadow: "inset 1px 1px 3px rgba(255, 70, 158, 0.8)"
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
              )}
            </InputAdornment>
          ),
          sx: {
            width: { md: "650px" },
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
            // "& .MuiOutlinedInput-input": {
            //   "&:hover": {
            //     outline: "none",
            //   },
            //   "&:focus": {
            //     outline: "none",
            //     boxShadow: "none",
            //   },
            // },
          },
        }}
      />
    </div>
  );
};

export default ProductSearch;
