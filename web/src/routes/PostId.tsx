import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Ranking } from "../components/Ranking";
import { AutoLogin } from "../utils/AutoLogin";

export let argumentsCard = (
  argumentsArr: any,
  extraUserIdArr?: [string, number]
) => {
  return argumentsArr.map(
    ({
      id,
      title,
      type,
      points,
      ranking,
      references,
      referencedBy,
      user,
    }: {
      id: number;
      title: string;
      type: string;
      points: string[];
      ranking: number;
      references: number[];
      referencedBy: number[];
      user: any;
    }) => (
      <div
        className="  ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg mt-4 mb-4 "
        key={id}
      >
        <div className="rounded bg-white hover:text-indigo-300 text-gray-900 ">
          <Link
            to={
              extraUserIdArr
                ? "/users/" + extraUserIdArr![1]
                : "/users/" + user.id
            }
          >
            <h6 className="text-xl font-bold tracking-tight ">
              {extraUserIdArr ? extraUserIdArr![0] : user.username}
            </h6>
          </Link>
        </div>
        <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
              {type} - {title}
            </h5>
          </a>
        </div>
        <div className="font-normal ">
          {points.map((p, i) => (
            <div className="mt-4 mb-4">
              {i + 1}: {p}
            </div>
          ))}
        </div>
        <Ranking ranking={ranking} />
        <div className="flex mt-2">
          <p className="font-bold">References :</p>
          {references.map((ref) => (
            <div>
              <a href="#" className="mr-1 text-indigo-400 font-bold">
                {ref} ,
              </a>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <p className="font-bold">{"Referenced By : "} </p>
          {referencedBy.map((ref) => (
            <div>
              <a href="#" className="mr-1 text-indigo-400 font-bold">
                {" "}
                {ref} ,
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export const PostId = () => {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  AutoLogin(setUser, userSet, setUserSet);
  let { postId } = useParams();
  let postIdTyped: number = +postId!;
  if (isNaN(postIdTyped))
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
              I'm sorry, but the post ID must be a number.{" "}
            </h2>
          </div>
        </div>
      </div>
    );

  type postIdClass = {
    postId: number;
  };

  let variables: { inputs: postIdClass } = {
    inputs: { postId: postIdTyped! },
  };

  const FETCH_POST = gql`
    query ($inputs: postIdClass!) {
      fetchPost(inputs: $inputs) {
        errors {
          field
          error
        }
        post {
          id
          description
          topic
          ranking
          title
          user {
            id
            username
          }
          arguments {
            id
            title
            type
            points
            ranking
            references
            referencedBy
            user {
              id
              username
            }
          }
        }
      }
    }
  `;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, error, data } = useQuery(FETCH_POST, { variables });

  if (loading)
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
          <h2 className="text-xl font-bold font-lg text-indigo-300">
            Loading...
          </h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
          <h2 className="text-xl font-bold font-lg text-indigo-300">
            Error : {error.message}
          </h2>
        </div>
      </div>
    );

  if (data.fetchPost.errors) {
    // Work with errors here
    console.log("es", data.errors);
    if (data.fetchPost.errors[0].error === "That post doesn't exist")
      return (
        <div>
          <Navbar user={user} setUser={setUser} />
          <div className="flex h-screen -mt-24">
            <div className="m-auto text-center">
              <h1 className="text-7xl font-xl font-bold text-indigo-300 ">
                {" "}
                Error 404{" "}
              </h1>
              <br />
              <h2 className="text-4xl font-xl ">
                {" "}
                I'm sorry, but that debate doesn't exist.{" "}
              </h2>
            </div>
          </div>
        </div>
      );
  }

  if (data.fetchPost) {
    console.log("D", data.fetchPost);
  }

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />

      <div className="flex items-center justify-between flex-wrap p-10 ">
        <div className="rounded bg-white text-gray-900 m-auto text-center ">
          <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
            <Link to={"/topics/" + `${data.fetchPost.post.topic}`}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
                {data.fetchPost.post.topic}
              </h5>
            </Link>
          </div>
          <h1 className="text-7xl font-bold font-lg mb-2">
            {data.fetchPost.post.title}
          </h1>
          <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
            <Link to={"/users/" + data.fetchPost.post.user.id}>
              <h5 className="mb-2 text-lg font-bold tracking-tight  ">
                <p className="font-normal">posted by:</p>{" "}
                {data.fetchPost.post.user.username}
              </h5>
            </Link>
          </div>
          <p className="font-normal font-lg">
            {data.fetchPost.post.description}
          </p>
          <div className="flex items-center justify-between text-center mt-2">
            <Ranking ranking={data.fetchPost.post.ranking} />
            <div id="modal">
              <button
                type="button"
                data-modal-target="authentication-modal"
                data-modal-toggle="authentication-modal"
                className=" ml-5 text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              >
                Create Argument
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="block min-w-max ml-10 mr-10 border border-indigo-400 mb-10"> */}
      <div>{argumentsCard(data.fetchPost.post.arguments)}</div>
    </div>
  );
};
