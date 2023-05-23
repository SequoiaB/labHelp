import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // il percorso al file del tema
const API_URL = "https://sequoialabs.herokuapp.com";

const Orders = () => {
  const [account, setAccount] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const connectedAccount = accounts[0];
      setAccount(connectedAccount);

      const response = await fetch(`${API_URL}/getorders/${connectedAccount}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not fetch orders.");
      }
      setOrders(data);
    };

    getOrders().catch((error) => {
      console.error("An error occurred:", error);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: "70%", margin: "auto" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Order Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) =>
                order.items.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {index === 0 && (
                      <TableCell rowSpan={order.items.length}>
                        {order._id}
                      </TableCell>
                    )}
                    <TableCell component="th" scope="row">
                      {item.productName}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    {index === 0 && (
                      <TableCell align="center" rowSpan={order.items.length}>
                        {order.total}
                      </TableCell>
                    )}
                    {index === 0 && (
                      <TableCell align="center" rowSpan={order.items.length}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default Orders;
