"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSwitch = exports.outputTopics = void 0;
const outputTopics = (topicsArr) => {
    let topicsOutput = [];
    for (let i = 0; i < topicsArr.length; i++) {
        topicsOutput.push({ topic: topicsArr[i] });
    }
    console.log("topics output", topicsOutput);
    return topicsOutput;
};
exports.outputTopics = outputTopics;
const orderSwitch = (orderName, orderBy) => {
    if (orderBy != "asc" && orderBy != "desc") {
        return { field: "orderBy", error: "Not proper order by message" };
    }
    switch (orderName) {
        case "newest":
            return { date_created: orderBy };
        case "ranking":
            return { ranking: orderBy };
        default:
            return { general: orderBy };
    }
};
exports.orderSwitch = orderSwitch;
//# sourceMappingURL=paginated%20Utils.js.map