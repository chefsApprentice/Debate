import { Link } from "react-router-dom";
import { Ranking } from "./Ranking";

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
        <div className="flex justify-between">
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
          <div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${id}`);
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
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="rounded bg-white hover:text-indigo-300 text-gray-900">
          <Link to={"/arguments/" + id}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight  ">
              {type} - {title}
            </h5>
          </Link>
        </div>

        <div className="font-normal ">
          {points.map((p, i) => (
            <div className="mt-4 mb-4">
              {i + 1}: {p}
            </div>
          ))}
        </div>
        <Ranking ranking={ranking} targetId={id} typeRank="argument" />
        <div className="flex mt-2">
          <p className="font-bold">References :</p>
          {references.map((ref) => (
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
          {referencedBy.map((ref) => (
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
      </div>
    )
  );
};
