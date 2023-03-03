import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { AutoLogin } from "../utils/AutoLogin";
import { Errors } from "./SignIn";

export const CreatePost = () => {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  AutoLogin(setUser, userSet, setUserSet);
  let { topic } = useParams();
  console.log("topciname", topic);

  const CREATE_POST = gql`
    mutation ($inputs: createPostInput!) {
      createPost(inputs: $inputs) {
        errors {
          error
          field
        }
        post {
          id
        }
      }
    }
  `;

  const [createPostLazy, { loading, error, data }] = useMutation(CREATE_POST);

  try {
    topic = topic?.toString();
  } catch {
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
              I'm sorry, but the topic name must be a string.{" "}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const title = titleRef!.current!.value;
    const description = descriptionRef!.current!.value;

    let variables = {
      inputs: {
        topic: topic,
        title: title,
        description: description,
      },
    };

    console.log("variables", JSON.stringify(variables));

    createPostLazy({ variables });
  };

  if (data) {
    console.log("D", data);
    console.log("navigating");
    if (data.createPost.post.id) {
      return (
        <div>
          <Navbar user={user} setUser={setUser} />
          <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
            <div className="m-auto">
              <h1 className="text-4xl font-xl font-bold ">Create a debate:</h1>{" "}
              <br />
              <p className="font-base mb-5">
                Post created, visit the below link
              </p>
              <Link
                to={"/posts/" + data.createPost.post.id}
                className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center p-5 w-40 m-auto mt-20"
              >
                Visit your post
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

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

  if (data?.createPost?.errors) {
    return (
      <div>
        <Navbar user={user} setUser={setUser} />
        <div className="flex h-screen justify-center ml-32 mr-32 p-6 rounded-lg -mt-24 ">
          <div className="m-auto">
            <h1 className="text-4xl font-xl font-bold ">Create a debate:</h1>{" "}
            <br />
            <form className="mt-5">
              <div className="relative z-0 w-full mb-6 group">
                <input
                  name="titleInput"
                  id="titleInput"
                  ref={titleRef!}
                  className="block py-2.5 px-0 w-full h-20 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                  placeholder=""
                  required
                />
                <label
                  htmlFor="titleInput"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Title
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <textarea
                  name="descriptionInput"
                  id="descriptionInput"
                  ref={descriptionRef!}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                  placeholder=""
                  required
                />
                <label
                  htmlFor="descriptionInput"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Description
                </label>
              </div>
              <button
                type="button"
                className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            </form>
            <Errors errors={data.createPost.errors} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="flex flex-grow h-screen justify-center ml-15 mr-15 p-6 rounded-lg -mt-24 ">
        <div className="m-auto min-w-full">
          <h1 className="text-4xl font-xl font-bold ">Create a debate:</h1>{" "}
          <br />
          <form className="mt-5 min-w-max">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="titleInput"
                id="titleInput"
                ref={titleRef!}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="titleInput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Title
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <textarea
                name="descriptionInput"
                id="descriptionInput"
                ref={descriptionRef!}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-indigo-400 peer"
                placeholder=""
                required
              />
              <label
                htmlFor="descriptionInput"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Description
              </label>
            </div>
            <button
              type="button"
              className="text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 "
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
