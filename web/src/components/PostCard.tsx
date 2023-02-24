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

  if (loading) return <p>Loading:..</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data.paginatedPosts.errors) {
    console.log("es", data.errors);
  }
  if (data) {
    console.log("D", data);
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
      <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow mt-2 mb-2 ">
        <div className="rounded bg-white hover:bg-indigo-100 ">
          <a href="#">
            <h6 className="text-xl font-bold tracking-tight text-gray-900 ">
              {user.username}
            </h6>
          </a>
        </div>
        <div className="rounded bg-white hover:bg-indigo-100 ">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              {topic} - {title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {description}
            </p>
          </a>
        </div>
        <Ranking ranking={ranking} />
      </div>
    )
  );
};
