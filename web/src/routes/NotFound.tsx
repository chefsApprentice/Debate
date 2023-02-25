import { Navbar } from "../components/Navbar";

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="flex h-screen -mt-20">
        <div className="m-auto text-center">
          <h1 className="text-7xl font-xl font-bold"> Error 404 </h1>
          <br />
          <h2 className="text-4xl font-xl "> Page not found </h2>
        </div>
      </div>
    </div>
  );
}
