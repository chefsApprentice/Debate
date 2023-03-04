import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { AutoLogin } from "../utils/AutoLogin";
import { postIdClass } from "./PostId";

export default function DeletePost() {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);

  const DELETE_POST = gql`
    mutation ($inputs: postIdClass!) {
      deletePost(inputs: $inputs) {
        errors {
          error
          field
        }
        success
      }
    }
  `;

  AutoLogin(setUser, userSet, setUserSet);

  const [deletePostLazy, { loading, error, data }] = useMutation(DELETE_POST);

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

  if (!user) {
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
          <div className="m-auto">
            <h1 className="text-4xl font-xl font-bold ">
              Sorry, try logging in
            </h1>
            <br />
          </div>
        </div>
      </div>
    );
  }

  if (data) {
    if (!data.deletePost.success) {
      return (
        <div>
          <Navbar user={user} setUser={setUser} />
          <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
            <div className="m-auto">
              <h1 className="text-4xl font-xl font-bold ">
                Error deleting post, try again later.
              </h1>
              <br />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Navbar user={user} setUser={setUser} />
          <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
            <div className="m-auto">
              <h1 className="text-4xl font-xl font-bold mb-5 ">
                Post deleted!
              </h1>
              <Link
                to={"/"}
                className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              >
                Return to home page
              </Link>
              <br />
            </div>
          </div>
        </div>
      );
    }
  }

  let variables: { inputs: postIdClass } = {
    inputs: { postId: postIdTyped! },
  };

  const handleDeletePost = () => {
    deletePostLazy({ variables });
  };

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
        <div className="m-auto">
          <h1 className="text-4xl font-xl font-bold ">
            Are you sure you want to delete your post?
          </h1>
          <br />
          <button
            type="button"
            className="text-white bg-red-300 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
            onClick={() => handleDeletePost()}
          >
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}