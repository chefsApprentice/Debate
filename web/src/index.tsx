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
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./routes/Home";
import SignUp from "./routes/SignUp";
import { Navbar } from "./components/Navbar";
import NotFound from "./routes/NotFound";
import SignIn from "./routes/SignIn";
import { PostId } from "./routes/PostId";
import { Topic } from "./routes/Topic";
import { UserId } from "./routes/UserId";
import { AuthProvider } from "./utils/authUser";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route element={<AppLayout />}>
    <>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/posts/:postId" element={<PostId />} />
      <Route path="/topics/:topic" element={<Topic />} />
      <Route path="/users/:userId" element={<UserId />} />
      <Route path="*" element={<NotFound />} />
    </>

    // </Route>
  )
);

// root.render(
//   <ApolloProvider client={client}>
//     <BrowserRouter>
//       <RouterProvider router={router} />;
//     </BrowserRouter>
//   </ApolloProvider>
// );

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </ApolloProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
