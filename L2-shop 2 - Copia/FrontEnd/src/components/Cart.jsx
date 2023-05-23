import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import CartProduct from "./cart/CartProduct";
import { ethers } from "ethers";
import Manager from "./Profile/contracts/Manager.json";
import { utils } from "ethers";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"; // Add this line
const API_URL = "https://sequoialabs.herokuapp.com";

export default function Cart() {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  let total = 0;
  //nuove
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [deliveryDataExists, setDeliveryDataExists] = useState(false);
  const [isGoerliNetwork, setIsGoerliNetwork] = useState(false);
  const [loading, setLoading] = useState(false); // Add this line
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      setAccount(accounts[0]);
      const newContract = new ethers.Contract(
        "0x967118b99f19C9c7fe5165F3ef8fbE64Ffb11c0D",
        Manager.abi,
        newSigner
      );
      setContract(newContract);

      // Aggiungi questo controllo per assicurarti che il contratto sia definito prima di chiamare owner()
      if (newContract) {
      }
    } else {
      console.log("Please install MetaMask.");
    }
  };
  const checkNetwork = async () => {
    if (window.ethereum) {
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
      if (networkId === "5") {
        setIsGoerliNetwork(true);
      } else {
        setIsGoerliNetwork(false);
      }
    }
  };
  const checkUserDDExists = async () => {
    console.log("dentro checkDD", account);
    console.log();
    const response = await fetch(`${API_URL}/api/checkdelivery/${account}`);
    const data = await response.json();
    setDeliveryDataExists(data.DData); // Update the userExists state based on the response

    // If the user exists, get their data
    if (data.DData) {
      console.log("l'user ha i dati di consegna");
    }
  };
  const getPriceInETH = async (amountInUSD) => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const priceInUSD = response.data.ethereum.usd;
      return amountInUSD / priceInUSD;
    } catch (error) {
      console.log("Error getting Ethereum price:", error.message);
      return null;
    }
  };
  const createOrder = async () => {
    try {
      // Costruisci l'oggetto ordine con le informazioni necessarie
      const order = {
        buyerAddress: account, // Indirizzo del compratore
        items: state.map((cartProduct) => {
          return {
            productId: cartProduct.id, // ID del prodotto
            productName: cartProduct.name, //nome del pordotto
            quantity: cartProduct.qty, // Quantità del prodotto
          };
        }),
        total: total, // Totale dell'ordine
      };
      console.log(order);
      // Effettua la richiesta POST per salvare l'ordine nel database
      const response = await fetch(`${API_URL}/neworder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        // Ordine salvato con successo
        console.log("Order created and saved to the database!");
        // Effettua eventuali azioni aggiuntive dopo il salvataggio dell'ordine
        setOrderSuccess(true);
      } else {
        // Errore durante il salvataggio dell'ordine
        console.log("Error saving the order to the database");
      }
    } catch (error) {
      console.log("Error creating and saving the order:", error.message);
      setErrorMessage("Error creating and saving the order: " + error.message);
    }
  };

  const buyCart = async (amount) => {
    if (contract) {
      try {
        await setLoading(true);
        console.log("loading: ", loading);
        const amountInETH = await getPriceInETH(amount);
        const roundedAmountInETH = Math.round(amountInETH * 1e18) / 1e18; // round to 18 decimal places
        const valueToSend = ethers.utils.parseEther(
          roundedAmountInETH.toString()
        );

        const transaction = await contract.buy({ value: valueToSend });
        await transaction.wait();
        console.log("Transaction successful!");
        createOrder();
      } catch (error) {
        console.log("Error in transaction:", error.message);
        setErrorMessage("Error in transaction: " + error.message);
      } finally {
        setLoading(false);
        console.log("loading: ", loading);
      }
    }
  };

  useEffect(() => {
    initConnection();
  }, []);
  useEffect(() => {
    checkUserDDExists();
  }, [account]);
  useEffect(() => {
    checkNetwork();
  }, [account]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item md={6}>
          {state?.map((cartProduct) => (
            <CartProduct cartProduct={cartProduct} dispatch={dispatch} />
          ))}
          {state.length === 0 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="h4">Your Cart is Empty...!</Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/products"
              >
                Start Shopping...
              </Button>
            </Box>
          )}
        </Grid>
        <Grid item md={6}>
          <Typography variant="h4">Cart Status</Typography>
          {state.map((x) => {
            total += x.sub_total;
          })}

          <Typography variant="h6">
            Total: $ {parseFloat(total).toFixed(2)}
          </Typography>

          {loading && <CircularProgress />}
          {orderSuccess && (
            <Typography
              variant="body2"
              style={{
                backgroundColor: "green",
                fontSize: "2em",
                color: "white",
                padding: "10px",
                borderRadius: "20px",
              }}
            >
              Order confirmed!
            </Typography>
          )}
          <Container>
            {/* Aggiungi questo blocco per visualizzare i messaggi di errore */}
            {errorMessage && (
              <Typography
                variant="body2"
                style={{
                  backgroundColor: "#e06d2f",
                  fontSize: "1em",
                  color: "white",
                  padding: "10px",
                  borderRadius: "20px",
                }}
              >
                {errorMessage}
              </Typography>
            )}
          </Container>
          {account !== "" ? (
            <Typography variant="body1">
              Account: {account.substring(0, 9)}
            </Typography>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={initConnection}
            >
              Connect
            </Button>
          )}

          {account !== "" && isGoerliNetwork && (
            <Tooltip
              title={
                !deliveryDataExists
                  ? "Per favore, impostare i dati di consegna nel tuo profilo."
                  : ""
              }
            >
              <span>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => buyCart(total)}
                  disabled={!deliveryDataExists}
                >
                  Buy Cart
                </Button>

                {!deliveryDataExists && (
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/profile/deliveryData"
                  >
                    Vai ai dati di consegna
                  </Button>
                )}
              </span>
            </Tooltip>
          )}

          {account !== "" && !isGoerliNetwork && (
            <Typography variant="body2">
              Please switch to the Goerli Test Network.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
