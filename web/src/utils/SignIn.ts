import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useContext } from "react";
import { AuthContext } from "./authUser";

export const SignInGql = (variables: any) => {
  const SIGNIN_USER = gql`
    mutation ($inputs: loginInput!) {
      login(inputs: $inputs) {
        errors {
          error
          field
        }
        user {
          email
          id
          username
        }
      }
    }
  `;

  const [signInLazy, { loading, error, data }] = useMutation(SIGNIN_USER, {
    variables,
  });

  return { data };
};
