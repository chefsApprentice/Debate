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
    return { field: "orderBy", error: "Not proper order by message" };
  }
  switch (orderName) {
    case "newest":
      return { date_created: orderBy };
    case "rating":
      return { rating: orderBy };
    default:
      return { general: orderBy };
  }
};
