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
const history = document.getElementById("history");



function showWeather() {
  // api key for fetch req
  const APIkey = "34809fce9dc7a900533bdad065a484e7";
  var cityInput = $("#city-input").val();
  // grabs user input to fetch the city
  const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIkey;

  fetch(queryURL)
  // throws errors if there is any response other than 200
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })

    .then(function (response) {
      console.log(response.name);
      // pulls icon from API
      let weatherPic = response.weather[0].icon;
      $("#weather-card").removeClass("d-none");
      // adds html to index.html with responses from API
      cityName.innerHTML = response.name;
      currentPicture.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
      todaysDate.innerHTML = currentTime;
      // added method to change temperture from kelvin to f
      temperture.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F";
      wind.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
      humidity.innerHTML = "Humidity: " + response.main.humidity + "%";
      // changes input to cityID from API to do second fetch request for forecast
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
          console.log(response);
          const forecast = document.querySelectorAll(".forecast");
          console.log(forecast);
          
          $("#forecast-report").removeClass("d-none");
          // for loop to inject html from second fetch into columns from html
          for (i = 0; i < forecast.length; i++) {
            // index to pull from the "list" array in second fetch response
            const forecastIndex = i * 8 + 4;
            forecast[i].innerHTML = "";
            // using moment js to inject date for the forecast & adds one day for each div
            const forecastDate = moment().add((i + 1), 'days').calendar();
            forecast[i].append(forecastDate);
            // adds image & alt description from array in second fetch
            const forecastWeatherIcon = document.createElement("img");
            forecastWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            forecastWeatherIcon.setAttribute("alt", response.list[forecastIndex].weather[0].description);
            forecast[i].append(forecastWeatherIcon);
            const forecastTemp = document.createElement("p");
            forecastTemp.innerHTML = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F";
            forecast[i].append(forecastTemp);
            const forecastHumidity = document.createElement("p");
            forecastHumidity.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
            forecast[i].append(forecastHumidity);
          }
        });

    });
}
// function to change from kelvin to f
function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}
// displays search history with whatever input was typed by user
function showSearchHistory() {
  history.innerHTML = "";
  const historyItem = document.createElement("input");
  for (i = 0; i < searchHistory.length; i++) {
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchHistory[i]);
    historyItem.addEventListener("click", function () {
      showWeather(historyItem.value);
    })
    history.append(historyItem);
  }
}
// initializes the fetch requests to get weather information and stores user input into search history array
$("#search-button").click(function () {
  const searchTerm = $("#city-input").val();
  showWeather(searchTerm);
  searchHistory.push(searchTerm);
  localStorage.setItem("search", JSON.stringify(searchHistory));
  showSearchHistory();
})
// clears local storage
$("#clear-button").click(function () {
  localStorage.clear();
  searchHistory = [];
  showSearchHistory();
})
// displays search history when user opens page
showSearchHistory();

