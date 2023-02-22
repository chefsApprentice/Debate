import { Ranking } from "./Ranking";

export const PostCard = () => {
  return (
    <div className="block max-w ml-10 mr-10 p-6 bg-white border border-indigo-200 rounded-lg shadow ">
      <div className="rounded bg-white hover:bg-indigo-100 dark:bg-indigo-800 dark:border-indigo-700 dark:hover:bg-indigo-700 ">
        <a>
          <h6 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Username
          </h6>
        </a>
      </div>
      <div className="rounded bg-white hover:bg-indigo-100 dark:bg-indigo-800 dark:border-indigo-700 dark:hover:bg-indigo-700 ">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Noteworthy technology acquisitions 2021
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </a>
      </div>
      <Ranking />
    </div>
  );
};
