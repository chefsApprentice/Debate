export const outputTopics = (topicsArr: string[]) => {
  let topicsOutput = [];
  for (let i = 0; i < topicsArr.length; i++) {
    topicsOutput.push({ topic: topicsArr[i] });
  }
  console.log("topics output", topicsOutput);
  return topicsOutput;
};

export const orderSwitch = (orderName: string, orderBy: string) => {
  if (orderBy != "asc" && orderBy != "desc") {
    // If not correct, default is asc
    orderBy = "asc";
  }
  switch (orderName) {
    case "newest":
      return { date_created: orderBy };
    case "ranking":
      return { ranking: orderBy };
    case "arguments":
      return { arguments: orderBy };
    case "id":
      return { id: orderBy };
    default:
      return { last_modified: orderBy };
  }
};
