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
                    height: "40px",
                    borderRadius: "7px",
                    "&:hover": {
                      backgroundColor: "#fbafcb",
                    },
                  }}
                >
                  <SearchIcon
                    sx={{ color: "white", cursor: "pointer", fontSize: "35px" }}
                  />
                </Button>
              )}
            </InputAdornment>
          ),
          sx: {
            width: { md: "650px" },
            padding: 0,
            border: "2px solid #ff469e",
            borderRadius: "10px",
            backgroundColor: "white",
            "&:hover": {
              border: "2px solid #ff469e",
            },
            "&:focus": {
              boxShadow: 2,
              backgroundColor: "#F8F8F8"
            },
            "&.Mui-focused": {
              border: "2px solid #ff469e",
              backgroundColor: "#F8F8F8",
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
