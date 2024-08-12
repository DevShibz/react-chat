import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import Chat from '../pages/chat';
import ChatDashboard from '../components/ChatDashboard';
import React, { useState } from "react";
const routes = (isLoggedIn) => [
  {
    path: "/",
    element: <><ChatDashboard></ChatDashboard></>,
  },
  {
    path:'/login',
    element: <LoginForm />,
  },
  {
    path: '/register',
    element: <RegistrationForm></RegistrationForm>
  },
  {
    path:'chat/:id',
    element: <Chat></Chat>
  }
];

export default routes;
