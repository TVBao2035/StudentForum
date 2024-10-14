const timeFormat = (time)=>{
    let date =  new Date(time).getTime();
    let now = new Date().getTime();
    let res = new Date(now - date );
   
    if(res.getDate() > 30){
        date = new Date(time);
        let day = date.getDate().toString();
        let month = date.getMonth().toString();
        if(day.length === 1) day = "0" + day;
        if(month.length === 1) month = "0" + month;
        return `${day}/${month}/${date.getFullYear()}`
    }

    if(res.getDate()-1 > 1) {
        return `${res.getDate()-1} ngày trước`;
    }
    if (res.getDate() - 1 === 1) return `Hôm qua`;

    
    if (res.getHours() - 7 <= 1) {
        if (res.getMinutes() <= 1 && res.getSeconds() <= 60) return `${res.getSeconds()} giây trước`;
        if (res.getMinutes() <= 60) return `${res.getMinutes()} phút trước`;
    }
    
    if (res.getHours()-7 <= 24 ) return `${res.getHours()} giờ trước`;
}
export default timeFormat;