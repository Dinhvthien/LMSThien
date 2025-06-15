import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';

const demoTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a202c',
          color: '#ffffff',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <ThemeProvider theme={demoTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Router>
);