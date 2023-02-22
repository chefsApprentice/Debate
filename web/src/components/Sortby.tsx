import { Listbox } from "@headlessui/react";
import { useState } from "react";

const sortByOpt = [
  { id: 1, name: "Newest" },
  { id: 2, name: "Oldest" },
  { id: 3, name: "Highest weighting" },
  { id: 4, name: "Lowest weighting" },
];

interface sortByProps {
  selectedSort: ;
}

export const SortBy = () => {
  return (
    <Listbox value={selectedSort} onChange={setSelectedSort}>
      <Listbox.Button>{selectedSort.name}</Listbox.Button>
      <Listbox.Options>
        {sortByOpt.map((sortBy) => (
          <Listbox.Option key={sortBy.id} value={sortBy}>
            {sortBy.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
