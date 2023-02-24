import React from "react";
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./routes/Home";
import Signup from "./routes/SignUp";

interface MainProps {
  signedIn: boolean;
}

const Main: React.FC<MainProps> = (signedIn) => {
  return <p>asd</p>;
};

export default Main;
