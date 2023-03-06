import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
          topicsFollowed
        }
        # Id like to add a token field again
        # token
      }
    }
  `;

  const LOGOUT = gql`
    mutation {
      logout {
        error {
          error
          field
        }
        success
      }
    }
  `;

  const [lazyLogout, { loading: loadingOut, error: errorOut, data: dataOut }] =
    useMutation(LOGOUT);
  const { loading, error, data } = await useQuery(AUTOLOGIN);

  let token = await localStorage.getItem("token");
  if (token === "null") {
    await localStorage.clear();
    setUserSet(false);
    if (dataOut?.logout) return;
    // setUser(undefined);
  } else if (userSet) {
  } else if (token) {
    if (data?.autoLogin?.user && !loading) {
      let userNew = { ...data!.autoLogin!.user };
      setUser(userNew);
      setUserSet(true);
    }
  }
};
