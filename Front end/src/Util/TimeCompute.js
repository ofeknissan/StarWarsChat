/*
   This functions gets the time that the message was created and calculate the difference between now and this time and return
   an appropriate message.
*/
export function convertLastTime(lastMessageTime) {
    var d=new Date();  // Gets the current time
    var now = Math.floor(d.getTime()/1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
    var seconds = now-lastMessageTime;
    // more that two days.
    if (seconds > 2*24*3600) {
       return "a few days ago";
    }
    // more than a day.
    if (seconds > 24*3600) {
       return "yesterday";
    }
   // more than an hour.
    if (seconds > 3600) {
       return "a few hours ago";
    }
    // more than an half hour.
    if (seconds > 1800) {
       return "Half an hour ago";
    }
    // more than a minute.
    if (seconds >= 60) {
       return Math.floor(seconds/60) + " minutes ago";
    }
    // more than a second.
    if (seconds < 60) {
        return "a few seconds ago"
    }
}
