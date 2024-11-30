const db = require("../../Models");
const checkUser = require("../checks/checkUser");

const createHistory =  ({userId, title, content}) => {
    return new Promise(async (resolve, reject) => {
        await db.History.create({
            userId,
            title,
            content
        })
    })
}

module.exports = createHistory;