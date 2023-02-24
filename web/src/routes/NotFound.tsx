import { Navbar } from "../components/Navbar";

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="flex h-screen -mt-28">
        <div className="m-auto text-center">
          <h1 className="text-9xl font-xl font-bold"> Error 404 </h1>
          <br />
          <h2 className="text-6xl font-xl "> Page not found </h2>
        </div>
      </div>
    </div>
  );
}
