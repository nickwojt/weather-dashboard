var apiKey = "cc7684d8ffd1ad44c81963db0f29ce5f";
var cityLatVar;
var cityLongVar;
var current = $(".main-area");
var forecast = $(".forecast");
var userCitiesArray = [];
var savedCitiesUl = $(".cities");

var getWeather = function (event) {
  var city = $(".input").val();
  var currentRequest =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;
  event.preventDefault();
  $.ajax({
    url: currentRequest,
    method: "GET",
  }).then(function (data) {
    console.log(data);

    current.empty();
    var cityName = $("<h1>");
    var icon = $("<img>");
    var currentTemp = $("<h2>");
    var wind = $("<h2>");
    var humidity = $("<h2>");
    var iconC = data.weather[0].icon;
    var iconU = "http://openweathermap.org/img/w/" + iconC + ".png";
    icon.attr("src", iconU);
    cityName.text(data.name + " " + new Date().toLocaleDateString("en-US"));
    cityName.addClass("is-size-3");
    currentTemp.text("Temp: " + data.main.temp + "°F");
    wind.text("Wind: " + data.wind.speed + " MPH");
    humidity.text("Humidity: " + data.main.humidity + "%");
    current.append(cityName);
    current.append(icon);
    current.append(currentTemp);
    current.append(wind);
    current.append(humidity);
  });
  var requestURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;
  $.ajax({
    url: requestURL,
    method: "GET",
  }).then(function (data) {
    cityLatVar = data.city.coord.lat;
    cityLongVar = data.city.coord.lon;
    forecast.empty();
    console.log(data);
    var header = $("<h1>");
    header.text("5 Day Forecast:");
    header.addClass("is-size-3");
    forecast.append(header);
    for (var i = 0; i < data.list.length; i++) {
      if (data.list[i].dt_txt.search("18:00:00") != -1) {
        var rawDateVar = data.list[i].dt_txt;
        var dateVar = moment(rawDateVar).format("dddd, MMMM Do");
        var card = $("<div>");
        var cardHeader = $("<h2>");
        var cardIcon = $("<img>");
        var cardTemp = $("<h2>");
        var cardWind = $("<h2>");
        var cardHumid = $("<h2>");
        cardHeader.text(dateVar);
        cardHeader.addClass("is-size-5");
        var iconCode = data.list[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        cardIcon.attr("src", iconUrl);
        cardTemp.text("Temp: " + data.list[i].main.temp + "°F");
        cardWind.text("Wind: " + data.list[i].wind.speed + " MPH");
        cardHumid.text("Humidity: " + data.list[i].main.humidity + "%");
        card.append(cardHeader);
        card.append(cardIcon);
        card.append(cardTemp);
        card.append(cardWind);
        card.append(cardHumid);
        forecast.append(card);
        forecast.append("<br>");
      }
    }
    getUVI();
  });
};

function getUVI() {
  var uviURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLatVar +
    "&lon=" +
    cityLongVar +
    "&exclude={part}&appid=" +
    apiKey;
  $.ajax({
    url: uviURL,
    method: "GET",
  }).then(function (data) {
    var indexUVI = data.daily[0].uvi;
    if (indexUVI >= 7) {
      current.append(
        `<button type="button" class="button is-danger">UV Index: ${indexUVI}</button>`
      );
    } else if (indexUVI < 7 && indexUVI >= 3) {
      current.append(
        `<button type="button" class="button is-warning uviBtn">UV Index: ${indexUVI}</button>`
      );
    } else {
      current.append(
        `<button type="button" class="button is-success uviBtn">UV Index: ${indexUVI}</button>`
      );
    }
  });
}
$(".form").on("submit", getWeather);

init();

//LOADS LOCAL STORAGE DATA, DISPLAYS TO SCREEN
function init() {
  var savedCity = JSON.parse(localStorage.getItem("userCitiesArray"));

  if (savedCity) {
    userCitiesArray = savedCity;
  }

  saveCities();
  displayCities();
}

//SAVE ARRAY OF CITIES TO LOCAL STORAGE
function saveCities() {
  localStorage.setItem("userCitiesArray", JSON.stringify(userCitiesArray));
}

//DISPLAYS THE CITIES SAVED IN LOCAL STORAGE TO THE WEB PAGE
function displayCities() {
  userCitiesArray.forEach(function (counter) {
    var savedCity = $("<button>").attr({
      class: "button is-info cityBtn m-3",
      type: "button",
    });
    savedCitiesUl.append(savedCity.text(counter));
  });
}

//creates <li> for each item in saved array
$(".form").on("submit", function (event) {
  event.preventDefault();

  //add new city to array
  var newCityValue = $(".input").val();
  userCitiesArray.push(newCityValue);

  //display new city on list
  var savedCity = $("<button>").attr({
    class: "button is-info cityBtn m-3",
    type: "button",
  });
  savedCitiesUl.append(savedCity.text(newCityValue));
  $(".input").val("");
  saveCities();
});

var cityBtnEl = $(".cityBtn");
savedCitiesUl.on("click", ".cityBtn", function (event) {
  city = event.target.textContent;
  console.log(city);
  getWeather2(event);
});

var getWeather2 = function (event) {
  var currentRequest =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;
  event.preventDefault();
  $.ajax({
    url: currentRequest,
    method: "GET",
  }).then(function (data) {
    console.log(data);

    current.empty();
    var cityName = $("<h1>");
    var icon = $("<img>");
    var currentTemp = $("<h2>");
    var wind = $("<h2>");
    var humidity = $("<h2>");
    var iconC = data.weather[0].icon;
    var iconU = "http://openweathermap.org/img/w/" + iconC + ".png";
    icon.attr("src", iconU);
    cityName.text(data.name + " " + new Date().toLocaleDateString("en-US"));
    cityName.addClass("is-size-3");
    currentTemp.text("Temp: " + data.main.temp + "°F");
    wind.text("Wind: " + data.wind.speed + " MPH");
    humidity.text("Humidity: " + data.main.humidity + "%");
    current.append(cityName);
    current.append(icon);
    current.append(currentTemp);
    current.append(wind);
    current.append(humidity);
  });
  var requestURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;
  $.ajax({
    url: requestURL,
    method: "GET",
  }).then(function (data) {
    cityLatVar = data.city.coord.lat;
    cityLongVar = data.city.coord.lon;
    forecast.empty();
    console.log(data);
    var header = $("<h1>");
    header.text("5 Day Forecast:");
    header.addClass("is-size-3");
    forecast.append(header);
    for (var i = 0; i < data.list.length; i++) {
      if (data.list[i].dt_txt.search("18:00:00") != -1) {
        var rawDateVar = data.list[i].dt_txt;
        var dateVar = moment(rawDateVar).format("dddd, MMMM Do");
        var card = $("<div>");
        var cardHeader = $("<h2>");
        var cardIcon = $("<img>");
        var cardTemp = $("<h2>");
        var cardWind = $("<h2>");
        var cardHumid = $("<h2>");
        cardHeader.text(dateVar);
        cardHeader.addClass("is-size-5");
        var iconCode = data.list[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        cardIcon.attr("src", iconUrl);
        cardTemp.text("Temp: " + data.list[i].main.temp + "°F");
        cardWind.text("Wind: " + data.list[i].wind.speed + " MPH");
        cardHumid.text("Humidity: " + data.list[i].main.humidity + "%");
        card.append(cardHeader);
        card.append(cardIcon);
        card.append(cardTemp);
        card.append(cardWind);
        card.append(cardHumid);
        forecast.append(card);
        forecast.append("<br>");
      }
    }
    getUVI();
  });
};
