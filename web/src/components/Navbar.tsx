import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

// export type signedIn = true | false;

interface NavbarProps {
  user?: {
    id: number;
    username: string;
    likes: number[];
    dislikes: number[];
    argLikes: number[];
    argDislikes: number[];
  };
  setUser: any;
  setFollowed?: any;
}

let signOut = (setUser: any, navigate: any) => {
  setUser(null);
  localStorage.clear();
  navigate(0);
};

export const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between flex-wrap bg-white-500 p-6 border-indigo-300 border-b">
      <div className="flex items-center flex-shrink-0 text-indigo-300 mr-6">
        <a
          href="/"
          className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-indigo-200 dark:hover:bg-indigo-300 dark:focus:ring-indigo-400"
          // text-white-300 border border-white-300 hover:bg-white-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-white-500 dark:text-white-500 dark:hover:text-white dark:focus:ring--400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="sr-only">Home button</span>
        </a>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="search"
            placeholder="Enter a topic or post here!"
          ></input>
        </div>
        <div className="pl-4">
          {props.user ? (
            <div>
              <Link
                to={"/users/" + props!.user!.id}
                className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-indigo-200 dark:hover:bg-indigo-300 dark:focus:ring-indigo-400"
              >
                Profile:
              </Link>
              <button
                onClick={() => signOut(props.setUser, navigate)}
                className="m-2 text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-indigo-200 dark:hover:bg-indigo-300 dark:focus:ring-indigo-400"
              >
                Log out
              </button>
            </div>
          ) : (
            <div>
              <Link
                to={"/signin"}
                className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-indigo-200 dark:hover:bg-indigo-300 dark:focus:ring-indigo-400"
              >
                Sign in
              </Link>
              <Link
                to={"/signup"}
                className="m-2 text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-indigo-200 dark:hover:bg-indigo-300 dark:focus:ring-indigo-400"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
