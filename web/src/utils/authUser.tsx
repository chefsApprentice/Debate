// import jwtDecode from "jwt-decode";
// import { useReducer } from "react";
// import { createContext } from "vm";

// const intitalState = { user: null };

// if (localStorage.getItem("token")) {
//   const decodedToken: any = jwtDecode(localStorage.getItem("token")!);
//   if (decodedToken.exp * 1000 < Date.now()) {
//     localStorage.removeItem("token");
//   } else {
//     intitalState.user = decodedToken;
//   }
// }

// const AuthContext = createContext({
//   user: null,
//   login: (userData: any) => {},
//   logout: () => {},
// });

// function authReducer(state: any, action: any) {
//   switch (action.type) {
//     case "Login":
//       return { ...state, user: action.payload };
//     case "Logout":
//       return { ...state, user: null };
//     default:
//       return state;
//   }
// }

// function AuthProvider(props: any) {
//   const [state, dispatch] = useReducer(authReducer, intitalState);

//   const login = (userData: any) => {
//     localStorage.setItem("token", userData.token);
//     dispatch({
//       type: "Login",
//       payload: userData,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     dispatch({ type: "Logout" });
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user: state.user, login, logout }}
//       {...props}
//     />
//   );
// }

let AuthContext = {};
let AuthProvider = {};

export { AuthContext, AuthProvider };
