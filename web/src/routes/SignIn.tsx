import { gql, useMutation } from "@apollo/client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, redirect } from "react-router-dom";
// import { Input } from "../components/Input";
import { Navbar } from "../components/Navbar";
import { AutoLogin } from "../utils/AutoLogin";

let Errors = (err: any) => {
  if (typeof err != "undefined") {
    return err.errors.map((fieldError: any) => {
      return (
        <div className="mt-4">
          <label className="bg-rose-300 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 mb-10 ">
            Error: {fieldError.error}
          </label>
        </div>
      );
    });
  }
};

export default function SignIn() {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  const emailUsernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  console.log("L");
  AutoLogin(setUser, userSet, setUserSet);

  console.log(localStorage.getItem("token"));

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
        token
      }
    }
  `;

  const [signInLazy, { loading, error, data }] = useMutation(SIGNIN_USER);

  if (data) {
    console.log("D", data);
    if (data.login.token) {
      localStorage.setItem("token", data.login.token);
      if (userSet === false) {
        setUser(data.login.user);
        setUserSet(true);
      }
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
          <div className="m-auto">
            <h1 className="text-4xl font-xl font-bold ">
              Welcome, please sign in:
            </h1>

            <div className="mb-10 mt-10">
              <label className="bg-emerald-300 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 mb-10 ">
                Querying server
              </label>
            </div>

            <br />
          </div>
        </div>
      </div>
    );
  }

  // AutoLogin();
  const handleSubmit = () => {
    const emailUsername = emailUsernameRef!.current!.value;
    const password = passwordRef!.current!.value;

    let variables = { inputs: { usernameOrEmail: emailUsername, password } };

    signInLazy({ variables });
  };
  try {
    if (data.login.errors) {
      return (
        <div>
          <Navbar user={user} setUser={setUser} />
          <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
            <div className="m-auto">
              <h1 className="text-4xl font-xl font-bold ">
                Welcome, please sign in:
              </h1>{" "}
              <br />
              <form className="mt-5">
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="string"
                    name="userOrEmailInput"
                    id="userOrEmailInput"
                    ref={emailUsernameRef!}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                    placeholder=""
                    required
                  />
                  <label
                    htmlFor="userOrEmailinput"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email address or username
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="password"
                    name="passwordInput"
                    id="passwordInput"
                    ref={passwordRef!}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                    placeholder=""
                    required
                  />
                  <label
                    htmlFor="passwordInput"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Password
                  </label>
                </div>
                <button
                  type="button"
                  className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
              <div>
                <Errors errors={data.login.errors} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  } catch {}

  if (user) {
    console.log("hit");
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
        <div className="m-auto">
          <h1 className="text-4xl font-xl font-bold ">
            Welcome, please sign in:
          </h1>{" "}
          <br />
          <form className="mt-5">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="string"
                name="userOrEmailInput"
                id="userOrEmailInput"
                ref={emailUsernameRef!}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="userOrEmailinput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address or username
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="passwordInput"
                id="passwordInput"
                ref={passwordRef!}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="passwordInput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            <button
              type="button"
              className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
          {/* <Errors errors={data.login.errors} /> */}
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="mb-10">
  <label className="bg-rose-300 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 mb-10 ">
    Error: Emails must include an @ symbol
  </label>
</div>; */
}
