import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const PostId = () => {
  let { postId } = useParams();
  let postIdTyped: number = +postId!;
  if (isNaN(postIdTyped))
    return (
      <div>
        <Navbar />
        <div className="flex h-screen -mt-24">
          <div className="m-auto text-center">
            <h1 className="text-7xl font-xl font-bold"> Error 400 </h1>
            <br />
            <h2 className="text-4xl font-xl ">
              {" "}
              I'm sorry, but the post ID must be a string.{" "}
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
          description
          id
          ranking
          title
          user {
            username
          }
          arguments {
            id
            title
            user {
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
        <Navbar />
        <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
          <h2 className="text-xl font-bold font-lg">Loading...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <Navbar />
        <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
          <h2 className="text-xl font-bold font-lg">Error : {error.message}</h2>
        </div>
      </div>
    );

  if (data.fetchPost.errors) {
    // Work with errors here
    console.log("es", data.errors);
  }

  if (data.fetchPost) {
    console.log("D", data.fetchPost);
  }

  return (
    <div className="App">
      <Navbar />
      <div className="flex items-center justify-between flex-wrap m-6 "></div>
    </div>
  );
};
