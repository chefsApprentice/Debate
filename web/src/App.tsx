import "./App.css";
import { Navbar } from "./components/Navbar";
import { SortBy } from "./components/Sortby";

function App() {
  let signedIn = false;

  const [selectedSort, setSelectedSort] = useState(sortByOpt[0]);

  return (
    <div className="App">
      {/* This is the general navigation with home, search and profile */}
      <Navbar signedIn={signedIn} />
      {/* These divs contain search option that affects query used */}
      <div>
        <nav className="flex items-center justify-between flex-wrap bg-white-500 m-6 ">
          <p className="text-md p-3">Sort by:</p>
          <SortBy />
          <button className="w-full block flex-grow lg:flex lg:items-center lg:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            All
          </button>
          <button className="ml-3 border border-blue-700 w-full block flex-grow lg:flex lg:items-center lg:w-auto text-blue-700 bg-white hover:text-white hover:bg-blue-700 focus:ring-4 focus:outline-noen focus:ring-blue-300 font-medium rounded-lg roudned-lg text-sm px-5 py-2.5 text-center mr-3 mdLmr-0">
            Followed
          </button>
        </nav>
      </div>

      {/* <!-- Dropdown menu --> */}
    </div>
  );
}

export default App;
