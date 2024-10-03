
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
  "01n" : 'src/icons/moon.svg',
  "02d" : 'src/icons/sun-cloud.png',
  "02n" : 'src/icons/cloud-moon.svg',
  "03d" : 'src/icons/cloud.svg',
  "03n" : 'src/icons/cloud.svg',
  "04d" : 'src/icons/cloud.svg',
  "04n" : 'src/icons/cloud.svg',
  "10d" : 'src/icons/rainy-day.png',
  "09d" : 'src/icons/heavy-rain.svg'
} 
const descriptions = {
  'clear': 'src/img/clear.jpg',
  'clouds': 'src/img/clouds.jpg',
  'thunderstorm': 'src/img/thunder.jpg',
  'rain': 'src/img/rain.jpg',
  'drizzle': 'src/img/rain.jpg',
  'mist': 'src/img/mist.jpg',
  'fog': 'src/img/mist.jpg',
  'smoke': 'src/img/mist.jpg',
  'snow': 'src/img/snow.jpg',
  'sleet': 'src/img/snow.jpg'
}

let now = new Date();

function setCurrentLocalTime(currentDate) {
  // console.log(timestamp);
  let dateElement = document.querySelector("span.date");
  dateElement.innerHTML = currentDate.getDate();
  let monthEl = document.querySelector("span.month");
  monthEl.innerHTML = months[currentDate.getMonth()];
  let dayEl = document.querySelector("span.theday");
  dayEl.innerHTML = weekDays[currentDate.getDay()];

  let timeEl = document.querySelector("span.time");
  timeEl.innerHTML = `${getHoursFromDate(currentDate)}:${getMinutesFromDate(currentDate)}`;
}


function getMinutesFromDate(date) {
  let minutes = date.getMinutes();
  if (minutes < 10) {
     minutes = `0${minutes}`
  }
  return minutes;
}
function getHoursFromDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return hours;
}
function convertTimeToLocal(date, offset) {
  if (offset) {
    offset = parseFloat(offset);
  } else {
    offset = 0;
  }
  
  date.setHours(date.getHours() + (date.getTimezoneOffset() / 60) + offset);
  // date.setMinutes(date.getMinutes() + (date.getTimezoneOffset() / 60) + offset % 1 * 60);
  return date;
}

function addHours(date, hours) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}
function formatHours(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  return `${hours}:00`;
}
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

let searchForm = document.querySelector("#enter-city-form");
searchForm.addEventListener("submit", searchCityTemperature);
let locationIcon = document.querySelector("#location-button");
locationIcon.addEventListener("click", getLocation);
setCurrentLocalTime(now);

class TheWeather {
  constructor(response) {
    console.log(response);
    this.tempCels = response.data.main.temp;
    this.city = response.data.name;
    this.countryCode = response.data.sys.country;
    this.descr = response.data.weather[0].description;
    this.wind = Math.round(response.data.wind.speed);
    this.clouds = Math.round(response.data.clouds.all);
    this.humidity =  Math.round(response.data.main.humidity);
    this.mainIcon = response.data.weather[0].icon;
    this.localTimezone = response.data.timezone;
    this.sunriseTimestamp = response.data.sys.sunrise;
    this.sunsetTimestamp = response.data.sys.sunset;
  }
  displayMainForecastInfo() {
    $( ".degrees-symbols" ).show();
    $( ".weather-conditions" ).show();
    $( ".sunrise-sunset" ).show();

    let degree = document.querySelector("#degree");
    degree.innerHTML = Math.round(this.tempCels);

    let currentCity = document.querySelector("#current-city");
    currentCity.innerHTML = this.city;

    currentCity.insertAdjacentHTML("beforeend", `<span class="country-code">(${this.countryCode})</span>`);

    setCurrentLocalTime(convertTimeToLocal(new Date(), this.localTimezone / 60 / 60));

    const descr = document.querySelector("#descr");
    descr.innerHTML = this.descr;

    const wind = document.querySelector(".wind-speed");
    wind.innerHTML = this.wind;

    const clouds = document.querySelector(".clouds-percent");
    clouds.innerHTML = this.clouds; 

    const humidity = document.querySelector(".humidity-percent");
    humidity.innerHTML = this.humidity;
  
    // console.log();
    const localSunrise = convertTimeToLocal(new Date(this.sunriseTimestamp * 1000), this.localTimezone / 60 / 60);
    const localSunset = convertTimeToLocal(new Date(this.sunsetTimestamp * 1000), this.localTimezone / 60 / 60);
    const sunrise = document.querySelector(".sunrise");
    const sunset = document.querySelector(".sunset");

    sunrise.innerHTML = `${getHoursFromDate(localSunrise)}:${getMinutesFromDate(localSunrise)}`;
    sunset.innerHTML = `${getHoursFromDate(localSunset)}:${getMinutesFromDate(localSunset)}`;
  }
  displayMainIcon() {
    // console.log(this.mainIcon);
    let mainIconWrapper = document.querySelector(".icon-current-weather");
    if (mainIconWrapper.children.length === 0) {
      if (Object.keys(iconsLinks).includes(this.mainIcon)) {
        const iconLink = iconsLinks[this.mainIcon];
        mainIconWrapper.insertAdjacentHTML('afterbegin', 
          `<img src='${iconLink}' alt='${this.descr}'>`);
      } else {
        mainIconWrapper.insertAdjacentHTML('afterbegin', 
          `<img src='http://openweathermap.org/img/wn/${this.mainIcon}@2x.png' alt='${this.descr}'>`);
      }
    } else {
        const mainIcon = mainIconWrapper.querySelector('img');
        if (Object.keys(iconsLinks).includes(this.mainIcon)) {
          const iconLink = iconsLinks[this.mainIcon];
          mainIcon.setAttribute("src",`${iconLink}`);
          mainIcon.setAttribute("alt",`${this.descr}` );
        } else {
          mainIcon.setAttribute("src",`http://openweathermap.org/img/wn/${this.mainIcon}@2x.png` );
          mainIcon.setAttribute("alt",`${this.descr}` );
        }
    }
  }

  displayCurrentBackgroundByTheWeatherDescr() {
    const currentBackground = getCurrentBackgroundByTheWeather(this.descr, this.mainIcon);
    if (currentBackground) {
      const main = document.querySelector("main");
      main.style.background = `url(${currentBackground}) center center/cover no-repeat`;
    }
  }
}


async function searchCityTemperature(event) {
  event.preventDefault();
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let cityName = document.querySelector("#enter-city");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&units=metric&appid=${apiKey}`;
  await axios.get(url).then(displayWeather);
}

// display the current temp of the city using API
function displayWeather(response) {
  const newWeatherForecast = new TheWeather(response);
  newWeatherForecast.displayMainForecastInfo();
  newWeatherForecast.displayMainIcon();
  newWeatherForecast.displayCurrentBackgroundByTheWeatherDescr();
  getForecast(response.data.coord);
}


function getForecast(coordinates) {
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastHourly).then(displayForecastDaily);
}


// Inject data from js to HTML
function displayForecastHourly(response) {
  console.log(response.data);
  let forecastHourly = response.data.hourly;
  let localTimezoneOffset = response.data.timezone_offset / 60 / 60;
  const currentLocalTime = convertTimeToLocal(new Date(), localTimezoneOffset);
  // const timestampLocalTime = Date.parse(currentLocalTime);
  let forecastHourlyElement = document.querySelector(".weather-hourly");
  let forecastHourlyHTML = `<div class="hourly-wrapper">`;
  forecastHourly.forEach((hour, index) => {
    if (index === 0) {
      forecastHourlyHTML = forecastHourlyHTML + `
      <div class='hour-box'>
        <div>NOW</div>
        <div class="precipitation">${hour.hasOwnProperty("rain") ? hour.rain['1h']+"mm/h" : hour.hasOwnProperty("snow") ?  hour.snow['1h'] : "\n" }</div>
        <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="http://openweathermap.org/img/wn/${hour.weather[0].description}@2x.png" width="60">
        <div>${Math.round(hour.temp)}</div>
      </div>
      `;
    } else if (index >= 1 && index < 24) {
      forecastHourlyHTML = forecastHourlyHTML + `
      <div class='hour-box'>
        <div>${addHours(new Date(currentLocalTime.getTime()), index).getHours()}:00</div>
        <div class="precipitation">${hour.hasOwnProperty("rain") ? hour.rain['1h']+"mm/h" : hour.hasOwnProperty("snow") ? hour.snow['1h'] : "\n" }</div>
        <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="http://openweathermap.org/img/wn/${hour.weather[0].description}@2x.png" width="60">
        <div>${Math.round(hour.temp)}&deg</div>
      </div>
      `;
    }
  })
  forecastHourlyHTML = forecastHourlyHTML + "</div>";
  forecastHourlyElement.innerHTML = forecastHourlyHTML;
  return response;
}

function displayForecastDaily(response) {
  let forecastDaily = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecastDaily.forEach(function(forecastDay, index){
    if (index < 8) {
      forecastHTML = forecastHTML + `
      <div class="col">
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


// Celsius - Fah

function changeToCelsius(event) {
  event.preventDefault();
  if (fahrenheitSymbol.matches(".active")) {
    let degreeElement = document.querySelector("#degree");
    let celsiusTemp = (parseInt(degreeElement.textContent) - 32) / (9/5)
    degreeElement.innerHTML = Math.round(celsiusTemp);
    fahrenheitSymbol.classList.remove("active");
    fahrenheitSymbol.classList.add("inactive");
    celsiusSymbol.classList.remove("inactive");
    celsiusSymbol.classList.add("active");
  }
}

function changeToFahrenheit(event) {
  event.preventDefault();
  if (celsiusSymbol.matches(".active")) {
    let degreeElement = document.querySelector("#degree");
    let fahrenheitTemp = (parseInt(degreeElement.textContent) * 9) / 5 + 32;
    degreeElement.innerHTML = Math.round(fahrenheitTemp);
    fahrenheitSymbol.classList.remove("inactive");
    fahrenheitSymbol.classList.add("active");
    celsiusSymbol.classList.remove("active");
    celsiusSymbol.classList.add("inactive");
  }
}

function getCurrentBackgroundByTheWeather(descr) {
  return Object.entries(descriptions).find((conditionArr) => {
    for (let word of descr.split(" ")) {
      if (conditionArr[0] === word) {
        return conditionArr;
      }
    }
  })[1];
}
// let celsiusTemp = null;
let celsiusSymbol = document.querySelector("#celsius");
let fahrenheitSymbol = document.querySelector("#fahrenheit");
celsiusSymbol.addEventListener("click", changeToCelsius);
fahrenheitSymbol.addEventListener("click", changeToFahrenheit);


