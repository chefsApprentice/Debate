import { gql, useMutation } from "@apollo/client";

interface RankingProps {
  ranking: number;
  targetId: number;
  typeRank: string;
}

export const RANK_POST = gql`
  mutation ratePost($inputs: rateInput!) {
    ratePost(inputs: $inputs) {
      errors {
        error
        field
      }
      post {
        id
        ranking
      }
    }
  }
`;

export const RANK_ARG = gql`
  mutation rateArgument($inputs: rateInput!) {
    rateArgument(inputs: $inputs) {
      argument {
        id
        ranking
      }
      errors {
        error
        field
      }
    }
  }
`;

export const handleRankPost = (
  direction: string,
  targetId: number,
  createPostLazy: any
) => {
  let variables = { inputs: { direction, targetId } };
  createPostLazy({ variables });
};

export const handleRankArg = (
  direction: string,
  targetId: number,
  createArgLazy: any
) => {
  let variables = { inputs: { direction, targetId } };
  createArgLazy({ variables });
};

export const Ranking: React.FC<RankingProps> = (props) => {
  if (props.typeRank === "post") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [createPostLazy, { loading, error, data }] = useMutation(RANK_POST);
    return (
      <nav className="flex items-center justify-left flex-wrap bg-white-500 mt-2">
        <button
          onClick={() => {
            handleRankPost("up", props.targetId, createPostLazy);
          }}
          className=" rounded-lg bg-indigo-100 px-1 py-1 text-left text-sm font-small text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            handleRankPost("down", props.targetId, createPostLazy);
          }}
          className="ml-1 rounded-lg bg-indigo-100 px-1 py-1 text-left text-sm font-small text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
        </button>
        <p className="ml-1 font-medium">
          {!data?.ratePost?.post?.ranking
            ? props.ranking
            : data.ratePost.post.ranking}
        </p>
      </nav>
    );
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [createArgLazy, { loading, error, data }] = useMutation(RANK_ARG);
    return (
      <nav className="flex items-center justify-left flex-wrap bg-white-500 mt-2">
        <button
          onClick={() => {
            handleRankPost("up", props.targetId, createArgLazy);
          }}
          className=" rounded-lg bg-indigo-100 px-1 py-1 text-left text-sm font-small text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
            />
          </svg>
        </button>
        <button
          onClick={() => {
            handleRankPost("down", props.targetId, createArgLazy);
          }}
          className="ml-1 rounded-lg bg-indigo-100 px-1 py-1 text-left text-sm font-small text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
        </button>
        <p className="ml-1 font-medium">
          {!data?.ratePost?.post?.ranking
            ? props.ranking
            : data.ratePost.post.ranking}
        </p>
      </nav>
    );
  }
};
