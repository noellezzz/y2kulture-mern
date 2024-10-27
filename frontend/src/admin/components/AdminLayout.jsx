import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import { IoPersonSharp } from "react-icons/io5";
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Shared.css'
import mainLogo from '../../assets/main-logo.png'

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'admin/orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'admin/users',
    title: 'Users',
    icon: <IoPersonSharp />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Management',
  },
  {
    segment: 'admin/crud',
    title: 'CRUD Manager',
    icon: <NoteAltIcon />,
    children: [
      {
        segment: 'product',
        title: 'Product',
        icon: <CheckroomIcon />,
      },
      {
        segment: 'category',
        title: 'Clothes Categories and Types',
        icon: <CategoryIcon />,
      },
      {
        segment: 'promo',
        title: 'Promos',
        icon: <LoyaltyIcon />,
      },
    ],
  },
];

const demoTheme = createTheme({
  palette: {
    primary: {
      main: '#fd552e',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
  },
  typography: {
    h1: {
      fontSize: '2rem', 
    },
    h2: {
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontSize: '0.875rem', 
    },
    navigation: {
      fontSize: '5rem', 
    },
  },
});

function AdminLayout(props) {
  const { window } = props;

  const navigate = useNavigate();  
  const location = useLocation();  
  
  const router = React.useMemo(() => {
    return {
      pathname: location.pathname,   
      searchParams: new URLSearchParams(location.search), 
      navigate: (path) => navigate(path),  
    };
  }, [location, navigate]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: <img src={mainLogo} alt="MUI logo" />,
        title: '',
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

AdminLayout.propTypes = {

};

export default AdminLayout;
