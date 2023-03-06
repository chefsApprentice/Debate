import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PostCard } from "../components/PostCard";
import { SortBy } from "../components/Sortby";
import { AutoLogin } from "../utils/AutoLogin";
import { chooseQuery } from "../utils/chooseQuery";

export const Topic = () => {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  const [followed, setFollowed]: [boolean, any] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    id: 1,
    name: "Newest",
  });
  const [topicsSelected, setSelectedTopics]: [string[], any] = useState([]);
  const [scrolledDown, setScrolledDown] = useState(0);
  AutoLogin(setUser, userSet, setUserSet);
  let variables = chooseQuery(selectedSort, topicsSelected, scrolledDown);

  const FOLLOW_TOPIC = gql`
    mutation ($topic: String!) {
      addTopic(topic: $topic) {
        errors {
          error
          field
        }
        user {
          username
          topicsFollowed
        }
      }
    }
  `;

  const [
    lazyFollow,
    { loading: followedLoading, error: followedError, data: followedData },
  ] = useMutation(FOLLOW_TOPIC);

  useEffect(() => {
    setFollowed((prevFollowed: any) => !prevFollowed);
  }, []);

  const { topic } = useParams();
  let followVariables = { topic: topic };

  // if (followedData) {
  //   console.log("follwoed Data 1", followedData);
  //   try {
  //     if (followedData.addTopic.errors[0].error === "Topic already followed") {
  //       setFollowed(true);
  //     }
  //   } catch {}
  // }

  if (!topic) {
    return (
      <div>
        <Navbar user={user} setUser={setUser} />

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

        <Navbar user={user} setUser={setUser} />

        {/* These divs contain search option that affects query used */}
        <div className="flex flex-col justify-center mt-10">
          <h2 className="text-7xl font-xl font-bold text-black m-auto">
            {topic}
          </h2>
          <nav className="flex flex-auto">
            <button
              // This requires quite a bit of logic

              onClick={
                !followed
                  ? () => {
                      lazyFollow({ variables: followVariables });
                      setFollowed(true);
                    }
                  : () => {}
              }
              className={
                "text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center p-5 w-40 m-auto mt-5"
              }
              disabled={followed}
            >
              {!followed ? "Follow topic" : "Topic followed"}
            </button>
            <Link
              to={"/createPost/" + topic}
              className={
                "ml-2 text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center p-5 w-40 m-auto mt-5"
              }
            >
              Create post
            </Link>
          </nav>
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
  }
};
