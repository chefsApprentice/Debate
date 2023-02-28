import { useQuery } from "@apollo/client";
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

  const { loading, error, data } = await useQuery(AUTOLOGIN);
  let token = await localStorage.getItem("token");
  console.log("token" + token);
  if (token === "null") {
    console.log("Ridden of");
    await localStorage.clear();
    setUserSet(false);
    // setUser(undefined);
  } else if (userSet) {
  } else if (token) {
    console.log("ls", token);
    if (data?.autoLogin?.user && !loading) {
      // console.log(data);
      console.log("ske");
      let userNew = { ...data!.autoLogin!.user };
      setUser(userNew);
      setUserSet(true);
    }
  } else {
    console.log("OOH sppooy");
    // if (data?.autoLogin?.user && !loading) {
    //   // console.log(data);
    //   console.log("ske");
    //   setUser(data!.autoLogin!.user);
    //   setUserSet(true);
    // }
  }
};
