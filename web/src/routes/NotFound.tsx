import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { AutoLogin } from "../utils/AutoLogin";

export default function NotFound() {
  const [user, setUser]: any = useState();
  const [userSet, setUserSet] = useState(false);

  AutoLogin(setUser, userSet, setUserSet);
  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="flex h-screen -mt-20">
        <div className="m-auto text-center">
          <h1 className="text-7xl font-xl font-bold text-indigo-300">
            {" "}
            Error 404{" "}
          </h1>
          <br />
          <h2 className="text-4xl font-xl "> Page not found </h2>
        </div>
      </div>
    </div>
  );
}
