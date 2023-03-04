import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
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
import { setContext } from "@apollo/client/link/context";
import { CreatePost } from "./routes/CreatePost";
import { CreateArgument } from "./routes/CreateArgument";
import DeletePost from "./routes/DeletePost";

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
      <Route path="/createPost/:topic" element={<CreatePost />} />
      <Route path="/createArgument/:postId" element={<CreateArgument />} />
      <Route path="/deletePost/:postId" element={<DeletePost />} />
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
  // <AuthProvider>
  <ApolloProvider client={client}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ApolloProvider>
  // </AuthProvider>
);
