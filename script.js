var currentTime = moment().format("MMMM Do YYYY");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const cityName = document.getElementById("city-name");
const todaysDate = document.getElementById("todays-date");
const temperture = document.getElementById("temperture");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const currentPicture = document.getElementById("current-picture");
const weatherCard = document.getElementById("weather-card");
const forecastReport = document.getElementById("forecast-report");



function showWeather() {
  const APIkey = "34809fce9dc7a900533bdad065a484e7";
  var cityInput = $("#city-input").val();
  const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIkey;

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })

    .then(function (response) {
      console.log(response.name);
      let weatherPic = response.weather[0].icon;
      $("#weather-card").removeClass("d-none");

      cityName.innerHTML = response.name;
      currentPicture.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
      todaysDate.innerHTML = currentTime;
      temperture.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F";
      wind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
      humidity.innerHTML = "Humidity: " + response.main.humidity + "%";

      let cityID = response.id;
      let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIkey;

      fetch(forecastQueryURL)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })

        .then(function (response) {
         // console.log(data);
         // console.log(response);
          const forecast = document.querySelectorAll(".forecast");
          console.log(forecast);
          
          $("#forecast-report").removeClass("d-none");
          
          for (i = 0, i < forecast.length; i++;) {
            forecast[i].innerHTML = "";
            const forecastDate = moment().add(1, 'days').calendar();
            forecast[i].append(forecastDate);
            const forecastWeatherIcon = document.createElement("img");
            forecastWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            forecastWeatherIcon.setAttribute("alt", response.weather[0].description);
            forecast[i].append(forecastWeatherIcon);
            const forecastTemp = document.createElement("p");
            forecastTemp.innerHTML = "Temp: " + k2f(response.main.temp) + " &#176F";
            forecast[i].append(forecastTemp);
            const forecastHumidity = document.createElement("p");
            forecastHumidity.innerHTML = "Humidity: " + response.main.humidity + "%";
            forecast[i].append(forecastHumidity);
          }
        });

    });
}

function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}

function showSearchHistory() {
  $("#history").text = "";
  const historyItem = document.createElement("input");
  for (i = 0; i < searchHistory.length; i++) {
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchHistory[i]);
    historyItem.addEventListener("click", function () {
      showWeather(historyItem.value);
    })
    $("#history").append(historyItem);
  }
}

$("#search-button").click(function () {
  const searchTerm = $("#city-input").val();
  showWeather(searchTerm);
  searchHistory.push(searchTerm);
  localStorage.setItem("search", JSON.stringify(searchHistory));
  showSearchHistory();
})

$("#clear-button").click(function () {
  localStorage.clear();
  searchHistory = [];
  showSearchHistory();
})

