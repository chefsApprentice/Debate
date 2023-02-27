// import { Listbox } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import "../App.css";
import { AllFollowed } from "../components/AllFollowed";
import { Navbar } from "../components/Navbar";
import { PostCard } from "../components/PostCard";
import { SortBy } from "../components/Sortby";
import { AutoLogin } from "../utils/AutoLogin";
import { chooseQuery } from "../utils/chooseQuery";
// import { FollowBttn } from "../components/FollowBttn";

const Home = () => {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    id: 1,
    name: "Newest",
  });
  const [followedSelected, setFollowedSelected] = useState(false);
  const [topicsSelected, setSelectedTopics] = useState([]);
  const [scrolledDown, setScrolledDown] = useState(0);
  const [errors, setErrors] = useState([]);

  if (followedSelected === true) {
    if (typeof user.topicsSelected != "undefined") {
      setSelectedTopics(user!.topicsSelected);
    }
  }

  let variables = chooseQuery(selectedSort, topicsSelected, scrolledDown);
  AutoLogin(setUser, userSet, setUserSet);

  useEffect(() => {
    setFollowedSelected((prevSelected) => !prevSelected);
  }, []);

  return (
    <div className="App">
      {/* This is the general navigation with home, search and profile */}
      <Navbar user={user} />
      {/* These divs contain search option that affects query used */}
      <div>
        <nav className="flex items-center justify-between flex-wrap bg-white-500 m-6 ">
          <p className="font-medium p-3">Sort by:</p>
          <div className="mr-3">
            <SortBy
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
            />
          </div>
          {/* <AllFollowed
            followedSelected={followedSelected}
            setFollowedSelected={setFollowedSelected}
            signedIn={user ? true : false}
          /> */}
          <button
            className={
              !followedSelected
                ? "w-full block flex-grow lg:flex lg:items-center lg:w-auto text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2 "
                : "border border-indigo-300 w-full block flex-grow lg:flex lg:items-center lg:w-auto text-indigo-300 bg-white hover:text-white hover:bg-indigo-300 focus:ring-4 focus:outline-noen focus:ring-indigo-300 font-medium rounded-lg roudned-lg text-sm px-5 py-2.5 text-center ml-2"
            }
            onClick={() => setFollowedSelected(false)}
          >
            All
          </button>
          <button
            disabled={!user}
            // onClick={FollowBttn}
            className={
              followedSelected
                ? "w-full block flex-grow lg:flex lg:items-center lg:w-auto text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2"
                : " border border-indigo-300 w-full block flex-grow lg:flex lg:items-center lg:w-auto text-indigo-300 bg-white hover:text-white hover:bg-indigo-300 focus:ring-4 focus:outline-noen focus:ring-indigo-300 font-medium rounded-lg roudned-lg text-sm px-5 py-2.5 text-center  ml-2"
            }
            onClick={() => setFollowedSelected(true)}
          >
            Followed
          </button>
        </nav>
      </div>
      <div className="mt-2">
        <PostCard variables={variables} />
      </div>
    </div>
  );
};

export default Home;
