import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import ChatScreen from '../pages/chat';
import ChatDashboard from '../components/ChatDashboard';
import React, { useState } from "react";
const routes = (isLoggedIn) => [
  {
    path: "/",
    element: isLoggedIn ? <ChatDashboard></ChatDashboard> : <LoginForm></LoginForm>
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
    path:'chat/:room_id/:user_id',
    element: <ChatScreen></ChatScreen>
  }
];

export default routes;
