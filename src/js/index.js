import { getMinutesFromDate , getHoursFromDate , getddFromDate , getMonthFromDate , convertTimeToLocal,  addHours , formatHours , formatDay , formatDate , formatMonth} from "./timeFunctions.js"
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
  "10n" : 'src/icons/cloud-rain.svg',
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
  let dateElement = document.querySelector("span.date");
  dateElement.innerHTML = currentDate.getDate();
  let monthEl = document.querySelector("span.month");
  monthEl.innerHTML = months[currentDate.getMonth()];
  let dayEl = document.querySelector("span.theday");
  dayEl.innerHTML = weekDays[currentDate.getDay()];

  let timeEl = document.querySelector("span.time");
  timeEl.innerHTML = `${getHoursFromDate(currentDate)}:${getMinutesFromDate(currentDate)}`;
}

let searchForm = document.querySelector("#enter-city-form");
searchForm.addEventListener("submit", searchForecastByCity);
let locationIcon = document.querySelector("#location-button");
locationIcon.addEventListener("click", getLocation);
setCurrentLocalTime(now);


class TheWeather {
  constructor({ tempCels, city, countryCode, descr, wind, clouds, humidity, mainIcon, localTimezone, sunriseTimestamp, sunsetTimestamp, lon, lat }) {
    // console.log(weatherObj);
    this.tempCels = tempCels;
    this.city = city;
    this.countryCode = countryCode;
    this.descr = descr;
    this.wind = wind;
    this.clouds = clouds;
    this.humidity = humidity;
    this.mainIcon = mainIcon;
    this.localTimezone = localTimezone;
    this.sunriseTimestamp = sunriseTimestamp;
    this.sunsetTimestamp = sunsetTimestamp;
    this.localDate = convertTimeToLocal(new Date(), this.localTimezone / 60 / 60);
    this.lon = lon;
    this.lat = lat;
    this.localSunrise = null;
    this.localSunset = null;
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

    setCurrentLocalTime(this.localDate);

    const descr = document.querySelector("#descr");
    descr.innerHTML = this.descr;

    const wind = document.querySelector(".wind-speed");
    wind.innerHTML = this.wind;

    const clouds = document.querySelector(".clouds-percent");
    clouds.innerHTML = this.clouds; 

    const humidity = document.querySelector(".humidity-percent");
    humidity.innerHTML = this.humidity;
  
    // console.log();
    this.localSunrise = convertTimeToLocal(new Date(this.sunriseTimestamp * 1000), this.localTimezone / 60 / 60);
    this.localSunset = convertTimeToLocal(new Date(this.sunsetTimestamp * 1000), this.localTimezone / 60 / 60);
    const sunrise = document.querySelector(".sunrise");
    const sunset = document.querySelector(".sunset");

    sunrise.innerHTML = `${getHoursFromDate(this.localSunrise)}:${getMinutesFromDate(this.localSunrise)}`;
    sunset.innerHTML = `${getHoursFromDate(this.localSunset)}:${getMinutesFromDate(this.localSunset)}`;
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
    // const currentBackground = getCurrentBackgroundByTheWeather(this.descr, this.mainIcon);
    // if (currentBackground) {
    //   const main = document.querySelector("main");
    //   main.style.background = `url(${currentBackground}) center center/cover no-repeat`;
    // }
    const main = document.querySelector("main");
    if (this.localDate <= this.localSunrise || this.localDate >= this.localSunset) {
      main.style.background = "#191919";
    } else {
      main.style.background = "linear-gradient(178.6deg, rgb(181, 222, 248) 3.3%, rgb(252, 253, 255) 109.6%)";
    }
  }

  searchForecastByDay(event) { // display Forecast for particular day
    const box = event.target.closest(".box-day");
    this.localDate = convertTimeToLocal(new Date(box.dataset.dt * 1000), this.localTimezone / 60 / 60);
    // setCurrentLocalTime(this.localDate);
    this.descr = box.dataset.descr;
    this.wind = box.dataset.wind;
    this.clouds = box.dataset.clouds;
    this.humidity = box.dataset.humidity;
    this.mainIcon = box.dataset.icon;
    this.tempCels = box.dataset.temp;
    this.sunriseTimestamp = box.dataset.sunrise;
    this.sunsetTimestamp = box.dataset.sunset;
    this.displayMainForecastInfo();
    this.displayMainIcon();

    // let apiKey = "b94116045137cd3444d68aeb165f20bc";
    // console.log(this.localDate);
    // let url = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${this.lat}&lon=${this.lon}&date=${this.localDate.getFullYear()}-${getMonthFromDate(this.localDate)}-${getddFromDate(this.localDate)}&appid=${apiKey}&units=metric`;
    // axios.get(url).then((response) => {
    //   console.log(response);
    // });
  }
}

// class TheWeatherForParticularDay extends TheWeather {
//   constructor(response) {
    
//   }
// }



async function searchForecastByCity(event) {
  event.preventDefault();
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let cityName = document.querySelector("#enter-city");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&units=metric&appid=${apiKey}`;
  await axios.get(url).then(getWeatherObj).then(createWeatherObj);
}

// display the current temp of the city using API
function getWeatherObj(response) {
  // console.log(response);
  const weather = {};
  weather.tempCels = response.data.main.temp;
  weather.city = response.data.name;
  weather.countryCode = response.data.sys.country;
  weather.descr = response.data.weather[0].description;
  weather.wind = response.data.wind.speed;
  weather.clouds = response.data.clouds.all;
  weather.humidity = response.data.main.humidity;
  weather.mainIcon = response.data.weather[0].icon;
  weather.localTimezone = response.data.timezone;
  weather.sunriseTimestamp = response.data.sys.sunrise;
  weather.sunsetTimestamp = response.data.sys.sunset;
  weather.lon = response.data.coord.lon;
  weather.lat = response.data.coord.lat;
  weather.coord = response.data.coord;
  return weather;
}

function createWeatherObj(weather) {
  const newWeatherForecast = new TheWeather(weather);
  newWeatherForecast.displayMainForecastInfo();
  newWeatherForecast.displayMainIcon();
  newWeatherForecast.displayCurrentBackgroundByTheWeatherDescr();
  getForecast(weather.coord, newWeatherForecast);
}


function getForecast(coordinates, forecastObj) {
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastHourly).then(displayForecastDaily).finally(() => {
    let boxDaysArr = document.querySelectorAll('.box-day');
    boxDaysArr.forEach((box, index) => {
      // const datasets = JSON.parse(JSON.stringify(box.dataset));  // як передати датасет
      box.addEventListener("click", forecastObj.searchForecastByDay.bind(forecastObj) ); 
    })
  })
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
    } else if (index >= 1) {
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
  console.log(forecastDaily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row flex-nowrap row-days">`;
  forecastDaily.forEach(function(forecastDay, index){
    if (index < 8) {
      forecastHTML = forecastHTML + `
      <div class="col">
      <div class="box box-day" data-dt="${forecastDay.dt}" data-wind="${forecastDay.wind_speed}" data-clouds="${forecastDay.clouds}" data-humidity="${forecastDay.humidity}" data-sunrise="${forecastDay.sunrise}" data-sunset="${forecastDay.sunset}" data-descr="${forecastDay.weather[0].description}" data-icon="${forecastDay.weather[0].icon}" data-temp="${forecastDay.temp.day}">
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
async function getCurrentLocation(position) {
  let apiKey = "b94116045137cd3444d68aeb165f20bc";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  await axios.get(url).then(getWeatherObj).then(createWeatherObj);
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


