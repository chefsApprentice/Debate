import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useContext, useState } from "react";
import { AuthContext } from "./authUser";

export const AutoLogin = async (
  setUser: React.Dispatch<React.SetStateAction<undefined>>,
  userSet: boolean,
  setUserSet: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const AUTOLOGIN = gql`
    query {
      autoLogin {
        errors {
          error
          field
        }
        user {
          # email
          id
          # last_modified
          username
          likes
          dislikes
          argLikes
          argDislikes
        }
        # Id like to add a token field again
        # token
      }
    }
  `;
  const { loading, error, data } = await useQuery(AUTOLOGIN);
  console.log("token" + localStorage.getItem("token"));
  if (localStorage.getItem("token") == "null") {
    console.log("Ridden of");
    localStorage.removeItem("token");
    return;
  } else if (localStorage.getItem("token")) {
    return;
  }

  if (data.autoLogin && !loading && !userSet) {
    // console.log(data);
    console.log("ske");
    setUser(data.autoLogin.user);
    setUserSet(true);
  }
};
