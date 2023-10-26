import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// This is for materialUI, so fonts work properly, see https://mui.com/material-ui/getting-started/installation/#roboto-font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Import pages we might route to
import Master from './pages/Master.jsx';
import ToDos from './pages/ToDos.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Logout from './pages/Logout.jsx';

// Import global styles
import './styles.css';

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Master />, // The master component wraps all it's child pages, it draws the background and Card component
    children: [
      {
        index: true,
        element: <ToDos />, // TODO: prevent opening ToDos component when not logged in
      },
      {
        path: 'login',
        element: <Login />, // TODO: when logged in already, navigate to ToDos
      },
      {
        path: 'register',
        element: <Register />, // TODO: when logged in already, navigate to ToDos
      },
      {
        path: 'logout',
        element: <Logout />, // TODO: logout user and navigate to Login
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
