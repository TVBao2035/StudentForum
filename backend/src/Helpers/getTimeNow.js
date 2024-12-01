const getTimeNow = () => {
    let currentDate = new Date();
    let time = `${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;
    return time;
}

module.exports = getTimeNow;