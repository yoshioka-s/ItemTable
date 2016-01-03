/**
 * Get formatted date string (yyyy/mm/dd hh:mm:ss)
 * @param {date} date
 * @return {string}
 */
function dateToString(date) {
  var year = String(date.getFullYear());
  var month = String(date.getMonth() + 1);
  var day = String(date.getDate());
  var hour = String(date.getHours());
  var minute = String(date.getMinutes());
  var second = String(date.getSeconds());
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

/**
 * Get formatted time string (hh:mm:ss)
 * @param {number} millisecond
 * @return {string}
 */
 function millisecondToString(milsec) {
   var hour = Math.floor(milsec / (1000 * 60 * 60));
   var minute = Math.floor(milsec / (1000 * 60)) - hour * 60;
   var second = Math.floor(milsec / (1000)) - hour * 3600 - minute * 60;
   return `${hour}:${minute}:${second}`;
 }

module.exports = {
  dateToString: dateToString,
  millisecondToString: millisecondToString
};
