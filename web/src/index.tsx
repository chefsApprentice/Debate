import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // gql,
} from "@apollo/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import SignUp from "./routes/SignUp";
import { Navbar } from "./components/Navbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
let router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Signup", element: <SignUp /> },
]);

// root.render(
//   <ApolloProvider client={client}>
//     <BrowserRouter>
//       <RouterProvider router={router} />;
//     </BrowserRouter>
//   </ApolloProvider>
// );

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <Navbar />
    <RouterProvider router={router} />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
