import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Skeleton } from "@mui/material";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";
const API_URL = "https://sequoialabs.herokuapp.com";

const categories = ["1", "2", "3", "4"];

export default function Products() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products`);
        const responseData = await response.json();
        setData(responseData);
        setFilter(responseData);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filterProduct = (cat) => {
    const updatedList = data.filter((x) => x.category === cat);
    setFilter(updatedList);
  };

  return (
    <>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Products
      </Typography>
      <hr />

      <Box display="flex" justifyContent="center" marginBottom={2}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outlined"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={() => filterProduct(cat)}
          >
            {cat}
          </Button>
        ))}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setFilter(data)}
        >
          All
        </Button>
      </Box>

      <Grid container spacing={4}>
        {loading
          ? [1, 2, 3, 4].map((n) => (
              <Grid item xs={3} key={n}>
                <Skeleton variant="rectangular" width="100%" height={118} />
                <Skeleton />
                <Skeleton width="60%" />
              </Grid>
            ))
          : filter.map((product) => (
              <Grid item xs={3} key={product.id}>
                <Card sx={{ backgroundColor: "#f5f5f5" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.title.substring(0, 12)}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${product.price}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/products/${product.id}`}
                      variant="outlined"
                      color="primary"
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </>
  );
}
