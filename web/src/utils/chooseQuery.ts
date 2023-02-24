export type postsInput = {
  scrolledDown: number;
  sortBy: string[];
  topics?: string[];
};

export let chooseQuery = (
  selectedSort: { id: number; name: string },
  topics: string[],
  scrolledDown: number
) => {
  let variables: { inputs: postsInput } = {
    inputs: {
      scrolledDown,
      sortBy: ["newest", "desc"],
    },
  };

  if (topics.length >= 1) {
    variables.inputs.topics = topics;
  }

  let sortBy = ["newest", "desc"];
  switch (selectedSort.name) {
    case "Oldest":
      sortBy = ["newest", "asc"];
      break;
    case "Highest weighting":
      sortBy = ["ranking", "desc"];
      break;
    case "Lowest weighting":
      sortBy = ["ranking", "asc"];
      break;
  }
  variables.inputs.sortBy = sortBy;

  return variables;
};
