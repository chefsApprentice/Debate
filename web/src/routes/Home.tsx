// import { Listbox } from "@headlessui/react";
import { useState } from "react";
import "../App.css";
import { Navbar } from "../components/Navbar";
import { PostCard } from "../components/PostCard";
import { SortBy } from "../components/Sortby";
import { chooseQuery } from "../utils/chooseQuery";

const Home = () => {
  let signedIn = false;
  const [selectedSort, setSelectedSort] = useState({
    id: 1,
    name: "Newest",
  });
  const [topicsSelected, setSelectedTopics] = useState([]);
  const [scrolledDown, setScrolledDown] = useState(0);
  let variables = chooseQuery(selectedSort, topicsSelected, scrolledDown);

  return (
    <div className="App">
      {/* This is the general navigation with home, search and profile */}
      <Navbar />
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
          <button className="w-full block flex-grow lg:flex lg:items-center lg:w-auto text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 ">
            All
          </button>
          <button
            disabled={!signedIn}
            className="ml-3 border border-indigo-300 w-full block flex-grow lg:flex lg:items-center lg:w-auto text-indigo-300 bg-white hover:text-white hover:bg-indigo-300 focus:ring-4 focus:outline-noen focus:ring-indigo-300 font-medium rounded-lg roudned-lg text-sm px-5 py-2.5 text-center mr-3 mdLmr-0"
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
