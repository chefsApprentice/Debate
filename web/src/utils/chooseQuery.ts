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
  try {
    if (topics.length) {
      variables.inputs.topics = topics;
    }
  } catch {}

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
