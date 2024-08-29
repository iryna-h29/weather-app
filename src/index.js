$( "#degree-symbols" ).fadeOut();
$( "#weather-conditions" ).fadeOut();
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
let iconsLinks = {
  "01d" : 'src/icons/sun.png',
  "02d" : 'src/icons/sun-cloud.png',
  "10d" : 'src/icons/rainy-day.png'
} 
const descriptions = {
  'clear': 'src/img/sunny.jpg',
  'clouds': 'src/img/clouds.jpg',
  'thunderstorm': 'src/img/thunder.jpg',
  'rain': 'src/img/rain.jpg',
  'drizze': 'src/img/rain.jpg',
  'mist': 'src/img/mist.jpg',
  'fog': 'src/img/mist.jpg',
  'mist': 'src/img/mist.jpg',
  'snow': 'src/img/snow.jpg',
  'sleet': 'src/img/snow.jpg'
}
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDate();
  return day;
}
function formatMonth(timestamp) {
  let date = new Date(timestamp * 1000);
  let month = date.getMonth();
  let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  return months[month];
}
// Inject data from js to HTML
function displayForecast(response) {
  let forecast = response.data.daily;
  // console.log(forecast);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function(forecastDay, index){
    if (index < 8) {
      forecastHTML = forecastHTML + `
      <div class="col" id="first-day">
      <div class="box">
      <div class="weekday">${formatDay(forecastDay.dt)}</div>
      <div class="data">${formatDate(forecastDay.dt)}.${formatMonth(forecastDay.dt)}</div>
      <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="http://openweathermap.org/img/wn/${forecastDay.weather[0].description}@2x.png" width="60">
      <div class="upper-bound">${Math.round(forecastDay.temp.max)}&deg</div>
      <div class="lower-bound">${Math.round(forecastDay.temp.min)}&deg</div>
      </div>
      </div>
      `;
    }
  })
  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  // console.log(coordinates);
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  // console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
// display the current temp of the city using API
function displayWeather(response) {
  $( "#degree-symbols" ).fadeIn();
  $( "#weather-conditions" ).fadeIn();
  let degree = document.querySelector("#degree");
  celsiusTemp =  response.data.main.temp;
  degree.innerHTML = Math.round(celsiusTemp);
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;

  let descr = document.querySelector("#descr");
  descr.innerHTML = response.data.weather[0].description;

  let wind = document.querySelector(".wind-speed");
  wind.innerHTML = Math.round(response.data.wind.speed);

  let clouds = document.querySelector(".clouds-percent");
  clouds.innerHTML = Math.round(response.data.clouds.all); 

  let humidity = document.querySelector(".humidity-percent");
  humidity.innerHTML = Math.round(response.data.main.humidity);

  console.log(response.data);

  let mainIconWrapper = document.querySelector(".icon-current-weather");
  const iconFound = response.data.weather[0].icon;
  if (mainIconWrapper.hasChildNodes() === false) {
    // console.log(response.data.weather[0].icon);
    if (iconFound === "10d" || iconFound === "01d" || iconFound === "02d") {
      const iconLink = iconsLinks[iconFound];
      mainIconWrapper.insertAdjacentHTML('afterbegin', 
        `<img src='${iconLink}' alt='${response.data.weather[0].description}'>`);
    } else {
      mainIconWrapper.insertAdjacentHTML('afterbegin', 
        `<img src='http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png'
        alt='${response.data.weather[0].description}'>`);
    }
  } else {
    const mainIcon = mainIconWrapper.querySelector('img');
    if (iconFound === "10d" || iconFound === "01d" || iconFound === "02d") {
      const iconLink = iconsLinks[iconFound];
      mainIcon.setAttribute("src",`${iconLink}`);
      mainIcon.setAttribute("alt",`${response.data.weather[0].description}` );
    } else {
      mainIcon.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png` );
      mainIcon.setAttribute("alt",`${response.data.weather[0].description}` );
    }
  }

  const currentBackground = getCurrentBackgroundByTheWeather(response.data.weather[0].description);
  console.log(currentBackground);
  getForecast(response.data.coord);
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
  let degreeElement = document.querySelector("#degree");
  degreeElement.innerHTML = Math.round(celsiusTemp);
  fahrenheitSymbol.classList.remove("active");
  fahrenheitSymbol.classList.toggle("inactive");
  celsiusSymbol.classList.remove("inactive");
  celsiusSymbol.classList.toggle("active");
}


function changeToFahrenheit(event) {
  event.preventDefault();
  let degreeElement = document.querySelector("#degree");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  degreeElement.innerHTML = Math.round(fahrenheitTemp);
  fahrenheitSymbol.classList.remove("inactive");
  fahrenheitSymbol.classList.toggle("active");
  celsiusSymbol.classList.remove("active");
  celsiusSymbol.classList.toggle("inactive");
}
function getCurrentBackgroundByTheWeather(descr) {
  
}
let celsiusTemp = null;
let celsiusSymbol = document.querySelector("#celsius");
let fahrenheitSymbol = document.querySelector("#fahrenheit");
celsiusSymbol.addEventListener("click", changeToCelsius);
fahrenheitSymbol.addEventListener("click", changeToFahrenheit);


