// display the current dates

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let now = new Date();
let currentDate = document.querySelector("span.date");
currentDate.innerHTML = now.getDate();
let currentMonth = document.querySelector("span.month");
currentMonth.innerHTML = months[now.getMonth()];
let currentDay = document.querySelector("span.theday");
currentDay.innerHTML = weekDays[now.getDay()];
let currentTime = document.querySelector("span.time");
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
   minutes = `0${minutes}`
}
currentTime.innerHTML = `${hours}:${minutes}`;

// Change-city-value

// function searchCity(event) {
//   event.preventDefault();
//   let enterCity = document.querySelector("#enter-city");
//   let currentCity = document.querySelector("#current-city");
//   currentCity.innerHTML = enterCity.value;
// }

// display the current temp of the city using API
function displayWeather(response) {
  let degree = document.querySelector("#degree");
  let temp =  Math.round(response.data.main.temp);
  degree.innerHTML = temp;
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;

  let descr = document.querySelector("#descr");
  descr.innerHTML = response.data.weather[0].description;

  let wind = document.querySelector(".wind-speed");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let clouds = document.querySelector(".clouds-percent");
  clouds.innerHTML = Math.round(response.data.clouds.all); 
  console.log(response.data);
  let mainIcon = document.querySelector("#main-icon");
  mainIcon.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png` );
}
function searchCityTemperature(event) {
  event.preventDefault();
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let cityName = document.querySelector("#enter-city");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeather);
}

let searchForm = document.querySelector("#enter-city-form");
searchForm.addEventListener("submit", searchCityTemperature);
// get current Location and find the weather
function getCurrentLocation(position) {
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeather);
}
function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}
let locationIcon = document.querySelector("#location-button");
locationIcon.addEventListener("click", getLocation);

// Celsius - Fah

function changeToCelsius(event) {
  event.preventDefault();
  let degree = document.querySelector("span.degree");
  if (degree === "+19") {
    degree.innerHTML = "+66";
  } else {
    degree.innerHTML = "+19";
  }
}
function changeToFahrenheit(event) {
  event.preventDefault();

  let degree = document.querySelector("span.degree");
  if (degree === "+66") {
    degree.innerHTML = "+19";
  } else {
    degree.innerHTML = "+66";
  }
}
let celsius = document.querySelector("span.celsius");
let fahrenheit = document.querySelector("span.fahrenheit");
celsius.addEventListener("click", changeToCelsius);
fahrenheit.addEventListener("click", changeToFahrenheit);

