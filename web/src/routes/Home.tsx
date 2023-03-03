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
    if (user.topicsSelected) {
      setSelectedTopics(user!.topicsFollowed);
    }
  }

  let variables = chooseQuery(selectedSort, topicsSelected, scrolledDown);

  // useEffect(() => {
  // if (!user) {
  AutoLogin(setUser, userSet, setUserSet);
  // } else {
  // console.log("user", user);
  console.log("welp");

  // }, []);

  // useEffect(() => {
  // AutoLogin(setUser, userSet, setUserSet);
  // }, [userSet]);

  useEffect(() => {
    if (!followedSelected) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(user!.topicsFollowed);
    }
  }, [followedSelected, user]);

  return (
    <div className="App">
      {/* This is the general navigation with home, search and profile */}
      <div>
        <Navbar user={user} setUser={setUser} />
      </div>
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
          <div className="w-max flex-grow">
            <AllFollowed
              followedSelected={followedSelected}
              setFollowedSelected={setFollowedSelected}
              user={user}
              // topicsSelected={topicsSelected}
              setSelectedTopics={setSelectedTopics}
            />
          </div>
        </nav>
      </div>
      <div className="mt-2">
        <PostCard variables={variables} />

        <nav className="flex">
          <button
            disabled={scrolledDown === 0}
            className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 mb-10 ml-10"
            onClick={() => setScrolledDown(scrolledDown - 1)}
          >
            Previous page
          </button>
          <button
            className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 mb-10 ml-10"
            onClick={() => setScrolledDown(scrolledDown + 1)}
          >
            Next page
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Home;
