const timeFormat = (time)=>{
    let startTime = new Date(time);
    let current = new Date();


    let date = new Date(time);
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    if (day.length === 1) day = "0" + day;
    if (month.length === 1) month = "0" + month;

    var takeYears = current.getFullYear() - startTime.getFullYear();
    var takeMonths = current.getMonth() - startTime.getMonth();
    var takeDates = current.getDate() - startTime.getDate();
    var takeHours = current.getHours() - startTime.getHours();
    var takeMinutes = current.getMinutes() - startTime.getMinutes();
    var takeSeconds = current.getSeconds() - startTime.getSeconds();

    if (takeYears > 1)
        return `${day}/${month}/${date.getFullYear()}`;

    if (takeYears === 1 && (takeMonths >= 0 || takeMonths + 12 > 1))
        return `${day}/${month}/${date.getFullYear()}`;

    if (takeYears === 0 && takeMonths > 1)
        return `${day}/${month}/${date.getFullYear()}`;

    if(takeMonths === 1 && takeDates < 0 )
        return `${takeDates+30} ngày trước`;

    if(takeMonths === 0 && takeDates > 1)
        return `${takeDates} ngày trước`

    if(takeDates === 1 && takeHours < 0)
        return `${takeHours + 24} giờ trước`;

    if(takeDates ===0 && takeHours > 1)
        return `${takeHours} giờ trước`;
    
    if(takeHours > 1)
        return `${takeHours} giờ trước`;

    if(takeHours === 1 && takeMinutes < 0)
        return `${takeMinutes + 60} phút trước`;

    if(takeHours === 0 && takeMinutes > 1)
        return `${takeMinutes} phút trước`;

    if(takeMinutes > 1)
        return `${takeMinutes} phút trước`;

    if(takeMinutes === 1 && takeSeconds < 0 )
        return `${takeSeconds + 60} giây trước`;

    if(takeMinutes === 0 && takeSeconds > 1)
        return `${takeSeconds} giây trước`;
    if(takeSeconds > 1)
        return `${takeSeconds} giây trước`;
}
export default timeFormat;