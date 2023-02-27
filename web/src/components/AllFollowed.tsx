import { useState } from "react";

//unused

interface AllFollowedProps {
  followedSelected: any;
  setFollowedSelected: any;
  signedIn: boolean;
}

export const AllFollowed: React.FC<AllFollowedProps> = (
  props: AllFollowedProps
) => {
  //   const [followedSelected, setfollowedSelected] = useState(false);
  return (
    <div className="flex items-center justify-between flex-wrap bg-white-500 m-6 min-w-max ">
      <button
        className={
          !props.followedSelected
            ? "w-full block flex-grow lg:flex lg:items-center lg:w-auto text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2 "
            : "border border-indigo-300 w-full block flex-grow lg:flex lg:items-center lg:w-auto text-indigo-300 bg-white hover:text-white hover:bg-indigo-300 focus:ring-4 focus:outline-noen focus:ring-indigo-300 font-medium rounded-lg roudned-lg text-sm px-5 py-2.5 text-center ml-2"
        }
        onClick={() => props.setFollowedSelected(false)}
      >
        All
      </button>
      <button
        disabled={!props.signedIn}
        // onClick={FollowBttn}
        className={
          props.followedSelected
            ? "w-full block flex-grow lg:flex lg:items-center lg:w-auto text-white bg-indigo-300 hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2"
            : " border border-indigo-300 w-full block flex-grow lg:flex lg:items-center lg:w-auto text-indigo-300 bg-white hover:text-white hover:bg-indigo-300 focus:ring-4 focus:outline-noen focus:ring-indigo-300 font-medium rounded-lg roudned-lg text-sm px-5 py-2.5 text-center  ml-2"
        }
        onClick={() => props.setFollowedSelected(true)}
      >
        Followed
      </button>
    </div>
  );
};