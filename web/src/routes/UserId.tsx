import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PostCard, postsJsx } from "../components/PostCard";
import { AutoLogin } from "../utils/AutoLogin";
import { argumentsCard } from "./PostId";

export const UserId = () => {
  let { userId } = useParams();
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  AutoLogin(setUser, userSet, setUserSet);

  let userIdTyped: number = +userId!;
  if (isNaN(userIdTyped))
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
              I'm sorry, but the user ID must be a number.{" "}
            </h2>
          </div>
        </div>
      </div>
    );

  let variables: { inputs: { userId: number } } = {
    inputs: { userId: userIdTyped! },
  };

  const FETCH_USER = gql`
    query ($inputs: userIdClass!) {
      fetchUser(inputs: $inputs) {
        errors {
          error
          field
        }
        user {
          id
          username
          posts {
            topic
            title
            description
            id
            ranking
          }
          arguments {
            id
            title
            type
            points
            ranking
            referencedBy
            references
          }
        }
      }
    }
  `;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, error, data } = useQuery(FETCH_USER, { variables });

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

  if (data.fetchUser.errors) {
    // Work with errors here
    console.log("es", data.errors);
    if (data.fetchPost.errors[0].error === "That user doesn't exist")
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
                I'm sorry, but that user doesn't exist.{" "}
              </h2>
            </div>
          </div>
        </div>
      );
  }

  if (data.fetchUser.user) {
    console.log("user", data.fetchUser);
  }

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />

      <div className="flex items-center justify-between flex-wrap p-10 ">
        <div className="rounded bg-white text-gray-900 m-auto text-center ">
          <h1 className="text-7xl font-bold font-lg mb-2">
            {data.fetchUser.user.username}
          </h1>
        </div>
      </div>
      <div>
        {" "}
        <h6 className="ml-10 text-3xl font-bold font-xl tracking-tight ">
          Posts:
        </h6>
        {data.fetchUser.user.posts?.length >= 0 ? (
          postsJsx(data.fetchUser.user.posts, [
            data.fetchUser.user.username,
            data.fetchUser.user.id,
          ])
        ) : (
          <p className="font-normal text-xl">No posts</p>
        )}
        <br />
        <h6 className="ml-10 text-3xl font-bold font-xl tracking-tight ">
          Arguments:
        </h6>
        {data.fetchUser.user.arguments?.length >= 0 ? (
          argumentsCard(data.fetchUser.user.arguments, [
            data.fetchUser.user.username,
            data.fetchUser.user.id,
          ])
        ) : (
          <p className="font-normal text-xl">No arguments</p>
        )}
      </div>
    </div>
  );
};
