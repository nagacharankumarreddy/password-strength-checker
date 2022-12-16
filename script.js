let data = new Map();
data.set(18, [
  "7qd Years",
  "100 tn Years",
  "6tn Years",
  "23m Years",
  "9 Months",
]);
data.set(17, [
  "93tn Years",
  "2tn Years",
  "100bn Years",
  "800k Years",
  "4 Weeks",
]);
data.set(16, ["1tn Years", "37bn Years", "2bn Years", "34k Years", "2 Days"]);
data.set(15, ["15 bn Years", "600m Years", "43m Years", "1k Years", "6 Hours"]);
data.set(14, ["200M Years", "9M Years", "800K Years", "51 Years", "41 Min"]);
data.set(13, ["2M Years", "100K Years", "16K Years", "1 Year", "4 Min"]);
data.set(12, ["34K Years", "2K Years", "300 Years", "3 Weeks", "25 Sec"]);
data.set(11, ["400 Years", "41 Years", "5 Years", "1 Day", "2 Sec"]);
data.set(10, ["5 Years", "7 Months", "1 Month", "58 Mins", "Instantly"]);
data.set(9, ["3 weeks", "3 Days", "19 Hours", "2 Mins", "Instantly"]);
data.set(8, ["8 Hours", "1 Hour", "22 Mins", "5 Secs", "Instantly"]);
data.set(7, ["6 Mins", "1 Min", "25 Secs", "Instantly", "Instantly"]);
data.set(6, ["5 Secs", "1 Sec", "Instantly", "Instantly", "Instantly"]);
data.set(5, ["Instantly", "Instantly", "Instantly", "Instantly", "Instantly"]);
data.set(4, ["Instantly", "Instantly", "Instantly", "Instantly", "Instantly"]);

function containsNumber(val) {
  return /(?=.*[0-9])/.test(val);
}
function containsLowercase(val) {
  return /(?=.*[a-z])/.test(val);
}
function containsUppercase(val) {
  return /(?=.*[A-Z])/.test(val);
}
function containsSpecialCharacter(val) {
  return /(?=.*\W)/.test(val);
}
function getInfo(val) {
  if (
    containsNumber(val) &&
    containsSpecialCharacter(val) &&
    containsUppercase(val) &&
    containsLowercase(val)
  ) {
    console.log("num,low,upp,spe");
    return 0;
  } else if (
    containsNumber(val) &&
    containsLowercase(val) &&
    containsUppercase(val)
  ) {
    console.log("num,low,upp");
    return 1;
  } else if (
    (containsUppercase(val) && containsLowercase(val)) ||
    (containsUppercase(val) && containsNumber(val)) ||
    (containsNumber(val) && containsLowercase(val))
  ) {
    console.log("comb 2");
    return 2;
  } else if (containsUppercase(val) || containsLowercase(val)) {
    console.log("upp or low");
    return 3;
  } else if (containsNumber(val)) {
    console.log("num");
    return 4;
  } else return 5;
}
function check() {
  let length = document.getElementById("pword").value.length;
  if (length == 0) return alert("Type password 😥");
  if (length < 4) length = 4;
  if (length > 18) length = 18;
  val = $("#pword").val().toString();
  let result = data.get(length)[getInfo(val)];
  let ele = document.getElementById("res");
  ele.style.visibility = "visible";
  ele.innerText = result;
  ele.style.align = "center";
}
