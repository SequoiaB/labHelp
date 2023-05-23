import { createTheme } from "@mui/material/styles";

// Create a new theme using the specified colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#023859", // Blu scuro
    },
    secondary: {
      main: "#026873", // Blu navy
    },
    verdeAcqua: {
      main: "#04BFAD", // Verde acqua
    },
    grigio: {
      main: "#77A9B3", // Grigio
    },
    arancione: {
      main: "#F29D35", // Arancione
    },
  },
  typography: {
    fontFamily: "'Roboto Slab', serif",
    h1: {
      fontSize: "2rem",
    },
    h2: {
      fontSize: "1.5rem",
    },
  },
});

export default theme;
