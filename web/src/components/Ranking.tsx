interface RankingProps {
  ranking: number;
}

export const Ranking: React.FC<RankingProps> = (ranking) => {
  return (
    <nav className="flex items-center justify-left flex-wrap bg-white-500 mt-2">
      <button className=" rounded-lg bg-indigo-100 px-1 py-1 text-left text-sm font-small text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
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
      <button className="ml-1 rounded-lg bg-indigo-100 px-1 py-1 text-left text-sm font-small text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
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
      <p className="ml-1 font-medium">#{ranking.ranking}</p>
    </nav>
  );
};
