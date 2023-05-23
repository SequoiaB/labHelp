import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { useParams } from "react-router-dom";
import { NavLink as RouterLink } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Box, Button, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
const API_URL = "https://sequoialabs.herokuapp.com";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${id}`);
      setProduct(await response.json());
      setLoading(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <Box sx={{ width: 400, marginRight: 0.5, my: 5 }}>
          <Skeleton variant="rectangular" width={400} height={400} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </Box>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <Box sx={{ width: 400, my: 5 }}>
          <Box
            component="img"
            src={product.image}
            alt={product.title}
            sx={{
              width: 400,
              height: 400,
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Box>
        <Box sx={{ my: 5, width: 400 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {product.category}
          </Typography>
          <Typography variant="h4" component="div" gutterBottom>
            {product.title}
          </Typography>

          <Typography variant="h5" gutterBottom>
            $ {product.price}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {product.description}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            onClick={() => addProduct(product)}
            sx={{ mt: 2 }}
          >
            Add to cart
          </Button>

          <Button
            variant="contained"
            startIcon={<ArrowForwardIosIcon />}
            component={RouterLink}
            to="/cart"
            sx={{ mt: 2, ml: 2 }}
          >
            Go to cart
          </Button>

          <Button
            variant="contained"
            startIcon={<ArrowBackIosIcon />}
            component={RouterLink}
            to="/products"
            sx={{ mt: 2, ml: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ py: 5, display: "flex", justifyContent: "center", gap: 5 }}>
      {loading ? <Loading /> : <ShowProduct />}
    </Box>
  );
}
