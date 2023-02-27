import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useContext } from "react";
import { AuthContext } from "./authUser";

export const AutoLogin = async (
  setUser: React.Dispatch<React.SetStateAction<undefined>>
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

  if (data.autoLogin.user) {
    setUser(data.autoLogin.user);
  }
};
