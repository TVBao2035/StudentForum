const getTimeNow = () => {
    let currentDate = new Date();
    let time = `${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;
    return time;
}

module.exports = getTimeNow;