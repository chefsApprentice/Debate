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
exports.orderSwitch = orderSwitch;
//# sourceMappingURL=paginated%20Utils.js.map