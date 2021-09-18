const iconElement = document.querySelector(".weather-icon")
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p")
const locationElement = document.querySelector(".location p")
const notificationElement = document.querySelector(".notification")

// app data
const weather = {}

weather.temperature = {
    unit : "celcius"
}


const KELVIN = 273

//api key
const key = "6e7c4e705f0518227b93c7cb4a4f1755"

// check if browser supports geolocation
if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
    notificationElement.style.display = "block"
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>"
}


//set users position
function setPosition(position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    getWeather(latitude, longitude)
}

//show error when there is an issue with goelocation
function showError(error){
    notificationElement.style.display = "block"
    notificationElement.innerHTML = `<p> ${error.message} </p>`
}

//get weather from api
function getWeather (latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch(api)
        .then(function(response){
            let data = response.json()
            console.log(data)
            return data
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN)
            weather.description = data.weather[0].description
            weather.iconId = data.weather[0].icon
            weather.city = data.name
            weather.country = data.sys.country
        })
        .then(function(){
            displayWeather()
        })
}

//dispaly weather ui
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`
    tempElement.innerHTML = `${weather.temperature.value}&deg <span>C</span>`
    descElement.innerHTML = weather.description
    locationElement.innerHTML = `${weather.city}, ${weather.country}`
}

//c to f conversion
function celsiusToFahrenheight(temperature){
    return (temperature * 9/5) + 32
}

// conversion click
tempElement.addEventListener('click', function(){
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheight(weather.temperature.value)
        fahrenheit = Math.floor(fahrenheit)

        tempElement.innerHTML = `${fahrenheit}&deg<span>F</span>`
        weather.temperature.unit = "fahrenheit"
    } else {
        tempElement.innerHTML = `${weather.temperature.value}&deg<span>C</span>`
        weather.temperature.unit = "celsius"
    }
})