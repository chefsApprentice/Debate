import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { AutoLogin } from "../utils/AutoLogin";

export default function SignUp() {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  AutoLogin(setUser, userSet, setUserSet);
  return (
    <div>
      <Navbar user={user} />
      <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
        <div className="m-auto">
          <h1 className="text-4xl font-xl font-bold ">
            Welcome, please sign up:
          </h1>{" "}
          <br />
          <form className="mt-5">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="emailInput"
                id="emailInput"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="emailInput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="username"
                name="usernameInput"
                id="usernameInput"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="usernameInput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Username
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="passwordInput"
                id="passwordInput"
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

            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="repeatPassInput"
                id="repeatPassInput"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="repeatPassInput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Confirm password
              </label>
            </div>
            <button
              type="submit"
              className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
            >
              Submit
            </button>
          </form>
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
