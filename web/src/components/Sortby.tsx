import { Listbox } from "@headlessui/react";
import React from "react";

interface SortByProps {
  selectedSort: {
    id: number;
    name: string;
  };
  setSelectedSort: React.Dispatch<
    React.SetStateAction<{
      id: number;
      name: string;
    }>
  >;
}

export const SortBy: React.FC<SortByProps> = ({
  selectedSort,
  setSelectedSort,
}) => {
  const sortByOpt = [
    { id: 1, name: "Newest" },
    { id: 2, name: "Oldest" },
    { id: 3, name: "Highest weighting" },
    { id: 4, name: "Lowest weighting" },
  ];

  // const [selectedSort, setSelectedSort] = useState({ id: 1, name: "Newest" });
  return (
    <div className="zindex-2 relative w-full cursor-default rounded-lg bg-indigo-300 text-sm text-white py-2 pl-3 pr-10 text-left font-medium hover:bg-indigo-400 focus:ring-4 focus:outline-none focus:ring-indigo-300">
      <Listbox value={selectedSort} onChange={setSelectedSort}>
        <Listbox.Button>{selectedSort.name}</Listbox.Button>
        <Listbox.Options>
          {sortByOpt.map((sortBy) => (
            <Listbox.Option key={sortBy.id} value={sortBy} disabled={false}>
              <button className="p-1  hover:text-indigo-700">
                {sortBy.name}
              </button>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};
