import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PostCard } from "../components/PostCard";
import { SortBy } from "../components/Sortby";
import { chooseQuery } from "../utils/chooseQuery";

export const Topic = () => {
  const [selectedSort, setSelectedSort] = useState({
    id: 1,
    name: "Newest",
  });
  const [topicsSelected, setSelectedTopics]: [string[], any] = useState([]);
  const [scrolledDown, setScrolledDown] = useState(0);
  let variables = chooseQuery(selectedSort, topicsSelected, scrolledDown);

  const { topic } = useParams();
  if (!topic) {
    return (
      <div>
        <Navbar />
        <div className="flex h-screen -mt-24">
          <div className="m-auto text-center">
            <h1 className="text-7xl font-xl font-bold text-indigo-300 ">
              {" "}
              Error 400{" "}
            </h1>
            <br />
            <h2 className="text-4xl font-xl ">
              {" "}
              I'm sorry, but you must include a named topic.{" "}
            </h2>
          </div>
        </div>
      </div>
    );
  } else {
    variables.inputs.topics = [topic];
    return (
      <div className="App">
        {/* This is the general navigation with home, search and profile */}
        <Navbar />
        {/* These divs contain search option that affects query used */}
        <div className="flex mt-10">
          <h2 className="text-7xl font-xl font-bold text-black m-auto">
            {topic}
          </h2>
        </div>

        <div>
          <nav className="flex items-center justify-end flex-wrap bg-white-500 m-6 ">
            <p className="font-medium p-3">Sort by:</p>
            <div className="mr-3">
              <SortBy
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
              />
            </div>
          </nav>
        </div>
        <div className="mt-2">
          <PostCard variables={variables} />
        </div>
      </div>
    );
  }
};
