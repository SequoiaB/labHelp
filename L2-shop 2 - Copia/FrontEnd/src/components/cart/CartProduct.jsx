import React from "react";
import { addCart, delCart, rmvCart } from "../../redux/action";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartProduct({ cartProduct, dispatch }) {
  const handleRemove = () => {
    dispatch(rmvCart(cartProduct));
  };
  const handleReduce = () => {
    if (cartProduct.qty === 0) return;
    dispatch(delCart(cartProduct));
  };
  const handleAdd = () => {
    dispatch(addCart(cartProduct));
  };

  return (
    <Card sx={{ display: "flex", m: 2, backgroundColor: "#FFFEF4" }}>
      <CardMedia
        component="img"
        sx={{ width: 160 }}
        image={cartProduct.image}
        alt={cartProduct.title}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="h6" variant="h6">
            {cartProduct.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <IconButton size="small" onClick={handleReduce}>
              <RemoveIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              {cartProduct.qty}
            </Typography>
            <IconButton size="small" onClick={handleAdd}>
              <AddIcon />
            </IconButton>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            Price: $ {cartProduct.price}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Sub - Total: $ {cartProduct.sub_total}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="error" onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
