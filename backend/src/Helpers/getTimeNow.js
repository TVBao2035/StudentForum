const getTimeNow = () => {
    let currentDate = new Date();
    let hour = currentDate.getHours().toString();
    let minute = currentDate.getMinutes().toString();
    let day = currentDate.getDate().toString();
    let month = (currentDate.getMonth() + 1).toString();
    if(hour.length === 1) hour = "0" + hour;
    if(minute.length === 1) minute = "0" + minute;
    if(day.length === 1) day = "0"+day;
    if(month.length === 1) month = "0" +month;
    let time = `${hour}:${minute} ${day}/${month}/${currentDate.getFullYear()}`;
    return time;
}

module.exports = getTimeNow;