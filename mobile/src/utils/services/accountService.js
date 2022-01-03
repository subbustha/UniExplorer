import chalk from "chalk";
const fileName = "accountService.js";

const getChalkData = (name) => {
    if(name===1) {
        return 2;
    } else {
        return 1;
    }
}

export {getChalkData}