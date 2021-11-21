import chalk from "chalk";
const fileName = "accountService.js";

const getChalkData = (name) => {
    if(name===1) {
        return 2;
    } else {
        console.log(chalk.red.bgGreen("This is working."));
        return 1;
    }
}

export {getChalkData}