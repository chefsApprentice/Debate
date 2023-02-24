import { Navbar } from "./components/Navbar";
// import Main from "./Main";

export default function App() {
  let signedIn = true;

  return (
    <div className="App">
      <Navbar signedIn={signedIn} />
      {/* <Main signedIn={signedIn} /> */}
    </div>
  );
}
