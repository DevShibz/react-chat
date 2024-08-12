import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import React from "react";
import "./App.css";
function App() {
  const routeInfo = useRoutes(routes(true));
  return <>{routeInfo}</>;
}

export default App;
