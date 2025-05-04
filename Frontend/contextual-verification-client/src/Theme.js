// src/Theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#ff5555' },
    secondary: { main: '#112b1e' },
    background: { default: '#333' },
    text: { primary: '#fff' }
  },
  typography: { fontFamily: 'Roboto, sans-serif' }
});

export default theme;