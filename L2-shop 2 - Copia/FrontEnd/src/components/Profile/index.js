import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Manager from "./contracts/Manager.json";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";
//const envirorment = process.env.NODE_ENV;
const API_URL = "https://sequoialabs.herokuapp.com";
/*process.env.envirorment === "production"
    ? "https://sequoialabs.herokuapp.com/"
    : "http://localhost:5000";*/

function Index() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [address, setAddress] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [userDDExists, setUserDDExists] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [contractBalance, setContractBalance] = useState(null);
  const { view: viewParam } = useParams();
  const [view, setView] = useState(viewParam || "personalData");
  const [customerName, setCustomerName] = useState("");
  const [customerSurname, setCustomerSurname] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [errorSavingDD, seterrorSavingDD] = useState(false);

  const initConnection = async () => {
    console.log("iniziando la connessione");
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      setAccount(accounts[0]);
      console.log("account sara' impostato a breve ", account);
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
  const withdrawFunds = async () => {
    if (contract) {
      const transaction = await contract.withdraw();
      await transaction.wait();
      console.log("Funds withdrawn successfully!");
    }
  };
  const saveData = async () => {
    console.log("dentro saveData");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setAddress(accounts[0]); // updated
      console.log(address); // updated

      const response = await fetch(`${API_URL}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          telegramHandle,
          address,
        }),
      });
      const data = await response.json();
      console.log(data);
      // After saving the data, get the updated user data
      getUserData();
      // Aggiorna lo stato 'userExists' a true
      setUserExists(true);
    } catch (error) {
      console.error("Errore durante il salvataggio dei dati:", error);
    }
  };
  const updateUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/update/${account}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          telegramHandle,
        }),
      });

      const data = await response.json();
      console.log(data);
      setEditMode(false);
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento dei dati dell'utente:",
        error
      );
    }
  };
  const getUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/getUser/${account}`);
      const data = await response.json();
      console.log(data);
      setUsername(data.username);
      setTelegramHandle(data.telegramHandle);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };
  const checkUserExists = async () => {
    console.log("sto controllando se l'account ", account, " esiste");
    const response = await fetch(`${API_URL}/api/check/${account}`);
    const data = await response.json();
    console.log(data.user);
    setUserExists(data.user); // Update the userExists state based on the response

    // If the user exists, get their data
    if (data.user) {
      getUserData();
    }
  };
  const checkUserDDExists = async () => {
    const response = await fetch(`${API_URL}/api/checkdelivery/${account}`);
    const data = await response.json();
    setUserDDExists(data.DData); // Update the userExists state based on the response

    // If the user exists, get their data
    if (data.DData) {
      console.log("l'user ha i dati di consegna");
      getDeliveryData();
    }
  };
  const handleInputChange = (e, setFunction) => {
    setFunction(e.target.value);
  };
  const getDeliveryData = async () => {
    console.log("dentro getDeliveryData");
    try {
      const response = await fetch(`${API_URL}/api/delivery/${account}`);
      const data = await response.json();
      console.log("data: ", data);
      setCustomerName(data.customerName);
      setCustomerSurname(data.customerSurname);
      setDeliveryAddress(data.deliveryAddress);
      setCity(data.city);
      setPostalCode(data.postalCode);
      setCountry(data.country);
      setEmail(data.email);
    } catch (error) {
      console.error("Errore durante il recupero dei dati di consegna:", error);
    }
  };
  const updateDeliveryData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/delivery/update/${account}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName,
            customerSurname,
            deliveryAddress,
            city,
            postalCode,
            country,
            email,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      setIsDataSaved(true);
      seterrorSavingDD(false);
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento dei dati di consegna:",
        error
      );
      seterrorSavingDD(true);
    }
  };
  const saveDeliveryData = async () => {
    if (userDDExists) {
      updateDeliveryData();
    } else {
      console.log("dentro svedd");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0]; // updated
        console.log("address: ", address);
        const response = await fetch(`${API_URL}/api/delivery/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
            customerName,
            customerSurname,
            deliveryAddress,
            city,
            postalCode,
            country,
            email,
          }),
        });

        if (response.ok) {
          console.log("Dati di consegna salvati con successo.");
          setIsDataSaved(true);
          seterrorSavingDD(false);
        } else {
          console.error("Errore durante il salvataggio dei dati di consegna.");
          seterrorSavingDD(true);
        }
      } catch (error) {
        console.error(
          "Errore durante il salvataggio dei dati di consegna:",
          error
        );
      }
    }
  };
  const handleDeliveryButtonClick = () => {
    // Cambiamo la vista in base al valore corrente
    console.log(view);
    if (view === "personalData") {
      setView("deliveryData");
    } else if (view === "deliveryData") {
      setView("personalData");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("sto per iniziare la connessione");
      await initConnection();
      console.log("connessione dovrebbe essere finita");

      if (contract) {
        const balance = await contract.getBalance();
        setContractBalance(ethers.utils.formatEther(balance));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await console.log("controllo se l'user esiste");
      await checkUserExists();
      await console.log("controllo se l'user ha i dati di consegna");
      await checkUserDDExists();
      await console.log("prima di entrare in getDeliveryData");
      await getDeliveryData();
      await console.log(account);
      // useEffect per contract
      if (contract) {
        const balance = await contract.getBalance();
        setContractBalance(ethers.utils.formatEther(balance));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (account) {
      console.log(account);
      checkUserExists();
      checkUserDDExists();
    }
  }, [account]);

  useEffect(() => {
    if (userExists) {
      getUserData(); // Get user data when we find out the user exists
    }
  }, [userExists]);

  useEffect(() => {
    if (userDDExists) {
      getDeliveryData(); // Get user Ddata when we find out the user DD exists
    }
  }, [userExists]);
  useEffect(() => {
    setView(viewParam || "personalData");
  }, [viewParam]);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" component={Box} marginTop={2}>
        <Stack
          className="app-main"
          spacing={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }} // Centra il contenuto
        >
          <Card style={{ width: "100%", backgroundColor: "#f0f0f0" }}>
            <CardContent>
              <Typography variant="h1">Benvenuto {username}</Typography>
              <header className="app-header">
                {account !== "" ? (
                  <>
                    <Box height={16} />
                    <Typography>
                      {"Address: " + account.substring(0, 9)}
                    </Typography>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={initConnection}
                  >
                    Connect
                  </Button>
                )}
              </header>
              {view === "deliveryData" ? (
                <Stack spacing={2}>
                  <TextField
                    id="customerName"
                    label="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <TextField
                    id="customerSurname"
                    label="Customer Surname"
                    value={customerSurname}
                    onChange={(e) => setCustomerSurname(e.target.value)}
                  />
                  <TextField
                    id="deliveryAddress"
                    label="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  <TextField
                    id="city"
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <TextField
                    id="postalCode"
                    label="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                  <TextField
                    id="country"
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    // Usa lo stato per cambiare il colore del pulsante
                    color={
                      errorSavingDD
                        ? "error"
                        : isDataSaved
                        ? "success"
                        : "primary"
                    }
                    onClick={saveDeliveryData}
                  >
                    Salva
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeliveryButtonClick}
                  >
                    Torna indietro
                  </Button>
                </Stack>
              ) : null}
              {account !== "" ? (
                userExists ? (
                  <>
                    {editMode ? (
                      <Stack spacing={2}>
                        <TextField
                          id="username"
                          label="Username"
                          value={username}
                          onChange={(e) => handleInputChange(e, setUsername)}
                        />
                        <TextField
                          id="telegramHandle"
                          label="Telegram Handle"
                          value={telegramHandle}
                          onChange={(e) =>
                            handleInputChange(e, setTelegramHandle)
                          }
                        />

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={updateUserData}
                        >
                          Salva
                        </Button>
                      </Stack>
                    ) : (
                      <Stack>
                        <Box height={10} />

                        <Typography>Username: {username}</Typography>
                        <Typography>
                          Telegram Handle: {telegramHandle}
                        </Typography>
                        <Box height={16} />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setEditMode(true)}
                        >
                          Modifica
                        </Button>
                      </Stack>
                    )}
                  </>
                ) : (
                  <Stack spacing={2}>
                    <TextField
                      id="username"
                      label="Username"
                      value={username}
                      onChange={(e) => handleInputChange(e, setUsername)}
                    />
                    <TextField
                      id="telegramHandle"
                      label="Telegram Handle"
                      value={telegramHandle}
                      onChange={(e) => handleInputChange(e, setTelegramHandle)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={saveData}
                    >
                      Crea account
                    </Button>
                  </Stack>
                )
              ) : (
                <Typography>
                  Per favore, collega il tuo account per continuare.
                </Typography>
              )}
              {account ===
              "0x3A4415e130EdDF0b978C7818782183a05818Ab21".toLowerCase() ? (
                <Box className="admin-section">
                  <Typography variant="h2">Sezione Admin</Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={withdrawFunds}
                    >
                      Withdraw
                    </Button>
                    <Typography>
                      Bilancio dello Smart Contract:{" "}
                      {contractBalance ? contractBalance : "Loading..."}
                    </Typography>
                  </Stack>
                </Box>
              ) : null}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {view === "personalData" && userExists ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDeliveryButtonClick}
                  >
                    {/* Se userDDExists è true, mostra "Visualizza dati consegna" */}
                    {userDDExists ? (
                      <>
                        Visualizza dati consegna
                        <CheckCircleIcon color="success" />
                      </>
                    ) : (
                      // Altrimenti, mostra un messaggio di errore
                      <Typography>
                        Per favore impostare dati consegna
                      </Typography>
                    )}
                  </Button>
                ) : null}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default Index;
