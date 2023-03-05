import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Ranking } from "../components/Ranking";
import { AutoLogin } from "../utils/AutoLogin";

export type argIdClass = {
  argId: number;
};

export const ArgumentId = () => {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  AutoLogin(setUser, userSet, setUserSet);
  let { argumentId } = useParams();
  let argumentIdTyped: number = +argumentId!;
  if (isNaN(argumentIdTyped))
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
              I'm sorry, but the argument ID must be a number.{" "}
            </h2>
          </div>
        </div>
      </div>
    );

  let variables: { inputs: argIdClass } = {
    inputs: { argId: argumentIdTyped! },
  };

  const FETCH_ARGUMENT = gql`
    query ($inputs: argumentIdClass!) {
      fetchArgument(inputs: $inputs) {
        errors {
          field
          error
        }
        argument {
          id
          user {
            id
            username
          }
          title
          type
          points
          ranking
          references
          referencedBy
          post {
            id
            topic
            title
            description
            ranking
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
  const { loading, error, data } = useQuery(FETCH_ARGUMENT, { variables });

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

  if (data.fetchArgument.errors) {
    // Work with errors here
    console.log("es", data.errors);
    if (data.fetchArgument.errors[0].error === "That argument doesn't exist")
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
                I'm sorry, but that argument doesn't exist.{" "}
              </h2>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />

      <div className="flex items-center justify-between flex-col p-10 ">
        <div className="rounded bg-white text-gray-900 m-auto text-center p-5 border-b-2 min-w-full border-indigo-200">
          <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
            <Link to={"/topics/" + `${data.fetchArgument.argument.post.topic}`}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
                {data.fetchArgument.argument.post.topic}
              </h5>
            </Link>
          </div>
          <h1 className="text-7xl font-bold font-lg mb-2">
            {data.fetchArgument.argument.post.title}
          </h1>
          <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
            <Link to={"/users/" + data.fetchArgument.argument.post.user.id}>
              <h5 className="mb-2 text-lg font-bold tracking-tight  ">
                <p className="font-normal">posted by:</p>{" "}
                {data.fetchArgument.argument.post.user.username}
              </h5>
            </Link>
          </div>
          <p className="font-normal font-lg">
            {data.fetchArgument.argument.post.description}
          </p>
          <div className="flex items-center justify-between text-center mt-2">
            <Ranking
              ranking={data.fetchArgument.argument.post.ranking}
              targetId={data.fetchArgument.argument.post.id}
              typeRank="post"
            />
            <div id="modal">
              <Link
                to={"/createArgument/" + data.fetchArgument.argument.post.id}
                className=" ml-5 text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              >
                Create Argument
              </Link>
            </div>
            <Link
              hidden={
                data.fetchArgument.argument.post.user.id !== user.id
                  ? true
                  : false
              }
              to={"/deleteArgument/" + argumentIdTyped}
              className=" ml-5 text-white bg-red-300 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
            >
              Delete post
            </Link>
          </div>
        </div>

        <div className="rounded bg-white text-gray-900 m-auto text-center mt-10 ">
          <div className="rounded bg-white hover:text-indigo-300 text-gray-900"></div>
          <h1 className="text-3xl font-bold font-base mb-2">
            {data.fetchArgument.argument.type}
          </h1>
          <h1 className="text-7xl font-bold font-lg mb-2">
            {data.fetchArgument.argument.title}
          </h1>
          <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
            <Link to={"/users/" + data.fetchArgument.argument.user.id}>
              <h5 className="mb-2 text-lg font-bold tracking-tight  ">
                <p className="font-normal">posted by:</p>{" "}
                {data.fetchArgument.argument.user.username}
              </h5>
            </Link>
          </div>
          <p className="font-normal font-lg">
            {data.fetchArgument.argument.points.map((p: any, i: any) => (
              <div className="mt-4 mb-4">
                {i + 1}: {p}
              </div>
            ))}
          </p>
          <div className="flex mt-2">
            <p className="font-bold">References :</p>
            {data.fetchArgument.argument.references.map((ref: any) => (
              <div>
                <Link
                  to={"/arguments/" + ref}
                  className="mr-1 text-indigo-400 font-bold"
                >
                  {ref} ,
                </Link>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <p className="font-bold">{"Referenced By : "} </p>
            {data.fetchArgument.argument.referencedBy.map((ref: any) => (
              <div>
                <Link
                  to={"/arguments/" + ref}
                  className="mr-1 text-indigo-400 font-bold"
                >
                  {ref} ,
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-center mt-2">
            <Ranking
              ranking={data.fetchArgument.argument.ranking}
              targetId={data.fetchArgument.argument.id}
              typeRank="argument"
            />
            <Link
              hidden={
                data.fetchArgument.argument.user.id !== user.id ? true : false
              }
              to={"/deleteArgument/" + argumentIdTyped}
              className=" ml-5 text-white bg-red-300 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
            >
              Delete argument
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="block min-w-max ml-10 mr-10 border border-indigo-400 mb-10"> */}
    </div>
  );
};
