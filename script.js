// Config Variables
var weatherKey = 'ae80b32beb01c3f32565f0f4eef9a9af';


// Dom Variables
let citySearchFormEl = document.getElementById('city-search-form');
let cityInputEl = document.getElementById('city-input');
let citySearchBtnEl = document.getElementById('city-search');
let searchHistoryEl = document.getElementById('search-history');
let currentWeatherEl = document.getElementById('current-weather');
let forecastEl = document.getElementById('forecast');
let forecastTimeEl = document.getElementById('forecast-time');



let days = 5;
let loc = {};
const DateTime = luxon.DateTime;


// --- Page Control Functions: Start --- //
function formSearch(event) {
    event.preventDefault();
    let searchTerm = cityInputEl.value;
    cityInputEl.value = '';
    fetchCityLocation(searchTerm);
}

function buttonSearch(event) {
    event.preventDefault();
    fetchCityLocation(event.target.innerHTML);
}

function removeChildren(parentEl) {
    while (parentEl.firstChild) {
            parentEl.removeChild(parentEl.firstChild);
    }
}
// --- Page Control Functions: End --- //


// --- Open Weather API Calls: Start --- //
function fetchCityLocation(city) {
    let geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherKey}`;

    if (city.length > 0) {
        fetch(geoAPI)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setSearchHistory(data[0].name);
                loc = {
                    lat: data[0].lat,
                    lon: data[0].lon
                }
                return loc;
            })
            .then((loc) => {
                fetchCurrentWeatherData(loc);
                fetchFutureWeatherData(loc, days);
            })
    }
}

function fetchCurrentWeatherData(location) {
    let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=${weatherKey}`;
    fetch(weatherAPI)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let currentWeather = {
                name: data.name,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                temp: data.main.temp,
                wind: data.wind.speed,
                windGust: data.wind.gust,
                humidity: data.main.humidity,
            }
            return currentWeather;
        })
        .then((currentWeather) => displayCurrentWeather(currentWeather))
}

function fetchFutureWeatherData(location, days) {
    let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location.lat}&lon=${location.lon}&cnt=${days}&units=imperial&appid=${weatherKey}`;
    fetch(weatherAPI)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let futureWeather = data.list
            return futureWeather;
        })
        .then((futureWeather) => displayFutureWeather(futureWeather, days))
}
// --- Open Weather API Calls: End --- //

// --- Display Weather Cards: Start --- //
function displayCurrentWeather(weatherNow) {
    removeChildren(currentWeatherEl);

    let currentCard = document.createElement('div');
    currentCard.setAttribute('id', 'current-weather-card');
    currentCard.classList.add('m-3', 'p-3', 'shadow-lg', 'hover:shadow-xl', 'rounded', 'border-2', 'border-blue-800/50', 'bg-blue-200');

    let iconSpan = document.createElement('span');

    let currentIcon = document.createElement('img');
    currentIcon.setAttribute('src', weatherNow.icon);
    currentIcon.classList.add('inline-block');


    let currentName = document.createElement('h3');
    currentName.classList.add('text-lg', 'sm:text-2xl', 'px-2', 'h-100', 'text-neutral-900');
    currentName.textContent = weatherNow.name;
    currentName.textContent += ' ' + DateTime.now().toLocaleString() + ' ';


    let currentTemp = document.createElement('p');
    currentTemp.classList.add('text-base', 'sm:text-xl', 'px-2', 'text-neutral-900');
    currentTemp.textContent = weatherNow.temp + ' °F';

    let currentWind = document.createElement('p');
    currentWind.classList.add('text-base', 'sm:text-xl', 'px-2', 'text-neutral-900');
    currentWind.textContent = weatherNow.wind + ' MPH';

    let currentHumidity = document.createElement('p');
    currentHumidity.classList.add('text-base', 'sm:text-xl', 'px-2', 'text-neutral-900');
    currentHumidity.textContent = weatherNow.humidity + ' %';

    iconSpan.appendChild(currentIcon);
    currentName.appendChild(iconSpan);
    currentCard.appendChild(currentName);
    currentCard.appendChild(currentTemp);
    currentCard.appendChild(currentWind);
    currentCard.appendChild(currentHumidity);
    currentWeatherEl.appendChild(currentCard);

    // uv index (color-coded favorable, moderate, or severe)

}

function displayFutureWeather(forecast, days) {
    removeChildren(forecastEl);
    removeChildren(forecastTimeEl);

    let forecastDaysEl = document.createElement('h2', '');
    forecastDaysEl.classList.add('block', 'sm:w-full', 'px-3', 'text-base', 'sm:text-lg')
    forecastDaysEl.textContent = `${days}-Day Forecast:`;
    forecastTimeEl.appendChild(forecastDaysEl);


    forecast.forEach(day => {

        let forecastIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`

        let forecastCard = document.createElement('div');
        forecastCard.classList.add('block', 'min-w-max', 'm-0.5', 'sm:m-1', 'p-0.5', 'sm:p-1', 'shadow-md', 'hover:shadow-lg', 'rounded', 'border-2', 'border-blue-800/50', 'bg-blue-200');

        let forecastCardName = document.createElement('h3');
        forecastCardName.classList.add('text-sm', 'sm:text-base', 'smd:text-xl', 'px-2', 'h-100', 'text-neutral-900');
        forecastCardName.textContent = DateTime.fromSeconds(day.dt).toLocaleString();

        let forecastCardIcon = document.createElement('img');
        forecastCardIcon.setAttribute('src', forecastIcon);
        forecastCardIcon.classList.add('inline-block', 'w-12', 'sm:w-12', 'h-12', 'sm:h-100');

        let forecastTemp = document.createElement('p');
        forecastTemp.classList.add('text-xs', 'sm:text-sm', 'px-2', 'text-neutral-900');
        forecastTemp.textContent = day.temp.day + ' °F';

        let forecastWind = document.createElement('p');
        forecastWind.classList.add('text-xs', 'sm:text-sm', 'px-2', 'text-neutral-900');
        forecastWind.textContent = day.speed + ' MPH';

        let forecastHumidity = document.createElement('p');
        forecastHumidity.classList.add('text-xs', 'sm:text-sm', 'px-2', 'text-neutral-900');
        forecastHumidity.textContent = day.humidity + ' %';

        forecastCard.appendChild(forecastCardName);
        forecastCard.appendChild(forecastCardIcon);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastWind);
        forecastCard.appendChild(forecastHumidity);
        forecastEl.appendChild(forecastCard);
    });
}
// --- Display Weather Cards: End --- //

// --- Search History: Start --- //
function setSearchHistory(search) {
    let searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
    let isearch = searchHistory.indexOf(search)

    if (search) {
        if (isearch != -1) {
            searchHistory.splice(isearch, 1);
            searchHistory.unshift(search);
        } else {
            if (searchHistory.length >= 10) {
                searchHistory.pop();
            }
            searchHistory.unshift(search);
        }

        localStorage.setItem('search-history', JSON.stringify(searchHistory))
    }
    displaySearchHistory();


}

function displaySearchHistory() {
    removeChildren(searchHistoryEl);
    let searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];

    for (let i = 0; i < searchHistory.length; i++) {
        let searchBtn = document.createElement('button');
        searchBtn.classList.add('min-w-max', 'md:w-[80%]', 'md:snap-center', 'md:scroll-mx-2', 'mx-2', 'md:mx-auto', 'my-2', 'py-1', 'md:py-1.5', 'px-4', 'md:px-1','rounded', 'text-sm', 'md:text-base', 'bg-neutral-500', 'text-neutral-50')
        searchBtn.textContent = searchHistory[i];

        searchBtn.addEventListener('click', (event) => {
            event.preventDefault();
        });

        searchBtn.addEventListener('click', buttonSearch)
        searchHistoryEl.appendChild(searchBtn);
    }




}

// --- Search History: End --- //

setSearchHistory();



citySearchFormEl.addEventListener('submit', formSearch);
citySearchBtnEl.addEventListener('button', formSearch);