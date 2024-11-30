const timeFormat = (time)=>{
    let startTime = new Date(time);
    let current = new Date();

    if (current.getMonth() > startTime.getMonth() && current.getFullYear() >= startTime.getFullYear()){
        let date = new Date(time);
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        if(day.length === 1) day = "0" + day;
        if(month.length === 1) month = "0" + month;
        return `${day}/${month}/${date.getFullYear()}`
    }
    var takeDate = current.getDate() - startTime.getDate();
    if (takeDate > 1) {
        return `${takeDate} ngày trước`;
    }
    if (takeDate === 1) return `Hôm qua`;

    var takeHour = current.getHours() - startTime.getHours();

    if (takeHour <= 1) {
        var takeMinute = current.getMinutes() - startTime.getMinutes();
        var takeSecond = current.getSeconds() - startTime.getSeconds();
        if (takeMinute <= 1 && takeSecond <= 60) return `${takeSecond} giây trước`;
        if (takeMinute <= 60) return `${takeMinute} phút trước`;
    }
    
    if (takeHour <= 24 ) return `${takeHour} giờ trước`;
}
export default timeFormat;