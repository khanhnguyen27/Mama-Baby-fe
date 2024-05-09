import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress, TextField, InputAdornment } from '@mui/material'
import { useState } from "react";

const ProductSearch = () => {
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ position: 'relative', zIndex: '99' }}>
      <TextField
        label="What do you want to buy?"
        size="small"
        variant="outlined"
        // value={searchTerm}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {
                loading
                  ? <CircularProgress color="inherit" size={24} />
                  : <SearchIcon sx={{ color: "black", cursor: "pointer" }} />
              }
            </InputAdornment>
          ),
          sx: {
            width: { md: "650px" },
            backgroundColor: "white",
            boxShadow: 1,
            "&:hover": {
              boxShadow: 3,
            },
          },
        }}
      />
    </div >
  )
}

export default ProductSearch