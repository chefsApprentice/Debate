import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const UserId = () => {
  let { userId } = useParams();

  let userIdTyped: number = +userId!;
  if (isNaN(userIdTyped))
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
        <Navbar />
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
        <Navbar />
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
          <Navbar />
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

  return <p>User</p>;
};
