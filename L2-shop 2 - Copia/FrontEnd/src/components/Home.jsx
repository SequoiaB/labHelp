import React from "react";
import Products from "./Products";
import theme from "./theme"; // il percorso al file del tema
import {
  ThemeProvider,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundImage: `url(${"/assets/sfondo.jpg"})`,
          backgroundSize: "cover",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "5%",
        }}
      >
        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            marginBottom: "1em",
            backgroundColor: theme.palette.verdeAcqua.main,
          }}
        >
          Open app
        </Button>
        <Card
          sx={{
            maxWidth: "50%",
            marginBottom: "1em",
            backgroundColor: theme.palette.grigio.main,
            borderColor: theme.palette.arancione.main,
            borderWidth: 8,
            borderStyle: "solid",
          }}
        >
          <CardContent>
            <Typography variant="h2" gutterBottom style={{ color: "#ffffff" }}>
              La nostra missione
            </Typography>
            <Typography variant="body1" style={{ color: "#ffffff" }}>
              La nostra ambizione è chiara e precisa: permettere alle
              criptovalute di manifestare il loro pieno potenziale nel panorama
              economico mondiale. La nostra missione è di creare un collegamento
              tra l'innovativo universo della blockchain e la vita di tutti i
              giorni, tracciando nuovi percorsi d'uso tangibili. Insieme,
              possiamo delineare il futuro del commercio.
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            maxWidth: "50%",
            marginTop: "1em",
            backgroundColor: theme.palette.grigio.main,
            borderColor: theme.palette.arancione.main,
            borderWidth: 8,
            borderStyle: "solid",
          }}
        >
          <CardContent>
            <Typography variant="h2" gutterBottom style={{ color: "#ffffff" }}>
              Chi siamo
            </Typography>
            <Typography variant="body1" style={{ color: "#ffffff" }}>
              O per meglio dire chi sono: uno studente di ingegneria
              dell'informazione di Padova, innamorato della tecnologia. Il mio
              desiderio di innovazione, di andare oltre i limiti convenzionali,
              mi ha spinto a creare questo servizio unico. Attratto dal
              progresso e dalla profonda curiosità verso il mondo delle
              criptovalute, mi impegno a trasformare questa passione in realtà,
              dando vita a un mondo commerciale completamente nuovo.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
