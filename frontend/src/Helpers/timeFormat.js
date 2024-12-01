const timeFormat = (time)=>{
    let startTime = new Date(time);
    let current = new Date();

    var takeDate = current.getDate() - startTime.getDate();
    if (current.getMonth() > startTime.getMonth()){

        takeDate = 30 + takeDate;
    }
   
    
    if (takeDate === 1 && current.getMonth() >= startTime.getMonth()) return `Hôm qua`;
    
    if (takeDate > 1  && current.getMonth() >= startTime.getMonth() && (current.getMonth() - startTime.getMonth()===1 && takeDate < 30)) {
        return `${takeDate} ngày trước`;
    }
 

    if ( current.getMonth() > startTime.getMonth() && current.getFullYear() >= startTime.getFullYear()) {
        let date = new Date(time);
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        if (day.length === 1) day = "0" + day;
        if (month.length === 1) month = "0" + month;
        return `${day}/${month}/${date.getFullYear()}`
    }
    var takeHour = current.getHours() - startTime.getHours();
    if (takeHour <= 1) {
        var takeMinute =  current.getMinutes() - startTime.getMinutes();
        if(takeMinute < 0){
            takeMinute = startTime.getMinutes() - current.getMinutes();
        }
        takeMinute = 60 -takeMinute;
        var takeSecond = current.getSeconds() - startTime.getSeconds();
        if (takeMinute <= 1 && takeSecond <= 60) return `${takeSecond} giây trước`;
        if (takeMinute <= 60){
            return `${takeMinute} phút trước`;
        }   
        
    }
    console.log({
        takeHour,
        current: current.getHours(),
        startTime: startTime.getHours(),
        takeMinute: 60 -takeMinute,
        takeSecond
    });
    
    if (takeHour <= 24 ) return `${takeHour} giờ trước`;

}
export default timeFormat;