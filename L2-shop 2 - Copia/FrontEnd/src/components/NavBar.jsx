import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
export default function NavBar() {
  const state = useSelector((state) => state.handleCart);

  return (
    <AppBar position="static" style={{ backgroundColor: "#6677A3" }}>
      <Container>
        <Toolbar disableGutters>
          <Typography variant="h6">
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "#D8D8D8" }}
            >
              Sequoia Store (alpha version)
            </NavLink>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={2}>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: 10 }}
                >
                  Home
                </Button>
              </NavLink>

              <NavLink to="/products" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: 10 }}
                >
                  Products
                </Button>
              </NavLink>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavLink to="/orders" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginLeft: 10 }}
              >
                Orders
              </Button>
            </NavLink>
            <NavLink to="/profile" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginLeft: 10 }}
              >
                Profile
              </Button>
            </NavLink>
            <NavLink to="/cart" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ShoppingCartIcon />}
                style={{ marginLeft: 10 }}
              >
                Cart ({state.length})
              </Button>
            </NavLink>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
