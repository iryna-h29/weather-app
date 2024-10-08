export function getMinutesFromDate(date) {
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    return minutes;
}
export function getHoursFromDate(date) {
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    return hours;
}
export function getddFromDate(date) {
    let dd = date.getDate();
    if (dd < 10) {
        return "0"+dd;
    }
    return dd;
}
export function getMonthFromDate(date) {
    let month = date.getMonth();
    let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    return months[month];
}
  // find local time
export function convertTimeToLocal(date, offset) {
    if (offset) {
        offset = parseFloat(offset);
    } else {
        offset = 0;
    }

    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60) + offset);
    // date.setMinutes(date.getMinutes() + (date.getTimezoneOffset() / 60) + offset % 1 * 60);
    return date;
}
  
export  function addHours(date, hours) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
}
export function formatHours(timestamp) {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    return `${hours}:00`;
}
export function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}
export function formatDate(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDate();
    return day;
}
export function formatMonth(timestamp) {
    let date = new Date(timestamp * 1000);
    let month = date.getMonth();
    let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    return months[month];
}
  
  