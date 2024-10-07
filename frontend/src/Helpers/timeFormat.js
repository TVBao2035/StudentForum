const timeFormat = (time)=>{
    let date =  new Date(time).getTime();
    let now = new Date().getTime();
    let res = new Date(now - date );
    // console.log("Created At", time);
    // console.log("Now", Date());
    // console.log("calculator", res);
    if(res.getDate() > 30){
        date = new Date(time);
        let day = date.getDate().toString();
        let month = date.getMonth().toString();
        if(day.length === 1) day = "0" + day;
        if(month.length === 1) month = "0" + month;
        return `${day}/${month}/${date.getFullYear()}`
    }
    return `${res.getDate()-1} ngày trước`;
}
export default timeFormat;