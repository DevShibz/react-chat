import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import React from "react";
import "./App.css";
function App() {
  const routeInfo = useRoutes(routes(localStorage.getItem("token")!=null));
  return <>{routeInfo}</>;
}

export default App;
