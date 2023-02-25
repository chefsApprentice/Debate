import { Ranking } from "./Ranking";
import { useQuery, gql } from "@apollo/client";
import { postsInput } from "../utils/chooseQuery";

interface PostCardProps {
  variables: { inputs: postsInput };
}

export const PostCard: React.FC<PostCardProps> = (variables) => {
  const GET_POSTS = gql`
    query ($inputs: postsInput!) {
      paginatedPosts(inputs: $inputs) {
        errors {
          error
          field
        }
        posts {
          id
          description
          title
          ranking
          topic
          user {
            username
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_POSTS, variables);

  if (loading)
    return (
      <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
        <h2 className="text-xl font-bold font-lg">Loading...</h2>
      </div>
    );
  if (error)
    return (
      <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
        <h2 className="text-xl font-bold font-lg">Error : {error.message}</h2>
      </div>
    );

  if (data.paginatedPosts.errors) {
    // Work with errors here
    console.log("es", data.errors);
  }

  return data.paginatedPosts.posts.map(
    ({
      id,
      description,
      ranking,
      title,
      topic,
      user,
    }: {
      id: number;
      description: string;
      ranking: number;
      title: string;
      topic: string;
      user: any;
    }) => (
      <div
        className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg mt-4 mb-4 "
        key={id}
      >
        <div className="rounded bg-white hover:text-indigo-300 text-gray-900 ">
          <a href="#">
            <h6 className="text-xl font-bold tracking-tight ">
              {user.username}
            </h6>
          </a>
        </div>
        <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
              {topic} - {title}
            </h5>
            <p className="font-normal ">{description}</p>
          </a>
        </div>
        <Ranking ranking={ranking} />
      </div>
    )
  );
};
