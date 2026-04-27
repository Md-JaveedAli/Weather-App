//let apiKey = "aa35c836307683c55e35dcc9e80534e7";
// 
let currentIndex = -1;
let suggestionItems = [];

// 🌙 Theme toggle
function toggleTheme() {
    document.body.classList.toggle("dark");
    document.getElementById("themeBtn").innerHTML =
        document.body.classList.contains("dark") ? "🌞" : "🌙";
}

// 🌦️ Weather function
async function getWeather() {

    let city = document.getElementById("city").value;
    let apiKey = "aa35c836307683c55e35dcc9e80534e7";

    let loading = document.getElementById("loading");
    let result = document.getElementById("weatherResult");

    result.innerHTML = "";
    loading.classList.remove("hidden");

    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        let response = await fetch(url);
        let data = await response.json();

        if (data.cod !== 200) {
            loading.classList.add("hidden");
            result.innerHTML = "❌ City not found";
            return;
        }

        loading.classList.add("hidden");

        // 🌈 Weather icon
        let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        result.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${icon}" />
            <h1>${data.main.temp}°C</h1>
            <p>${data.weather[0].description}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌬️ Wind: ${data.wind.speed} m/s</p>
        `;

        setWeatherBackground(data.weather[0].main);

    } catch (error) {
        loading.classList.add("hidden");
        result.innerHTML = "⚠️ Something went wrong";
        console.log(error);
    }
}

// ⌨️ Enter key search
document.getElementById("city").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

// 📱 Auto-suggestions
const cities = [
    "Riyadh",
    "Hyderabad",
    "Dubai",
    "Delhi",
    "London",
    "New York",
    "Mumbai",
    "Tokyo",
    "Paris"
];

document.getElementById("city").addEventListener("input", function () {

    let input = this.value.toLowerCase();
    let suggestions = document.getElementById("suggestions");

    suggestions.innerHTML = "";
    suggestionItems = [];
    currentIndex = -1;

    if (input === "") return;

    let filtered = cities.filter(city =>
        city.toLowerCase().includes(input)
    ).slice(0, 5);

    filtered.forEach(city => {

        let div = document.createElement("div");
        div.innerText = city;

        div.style.padding = "8px";
        div.style.cursor = "pointer";
        div.style.background = "rgba(255,255,255,0.2)";
        div.style.marginTop = "5px";
        div.style.borderRadius = "8px";

        div.onclick = function () {
            document.getElementById("city").value = city;
            suggestions.innerHTML = "";
            getWeather();
        };

        suggestions.appendChild(div);
        suggestionItems.push(div);
    });
});

// 📱 Keyboard navigation for suggestions
document.getElementById("city").addEventListener("keydown", function (event) {

    let suggestions = document.getElementById("suggestions");

    if (event.key === "ArrowDown") {
        if (currentIndex < suggestionItems.length - 1) {
            currentIndex++;
        }
        updateActive();
    }

    else if (event.key === "ArrowUp") {
        if (currentIndex > 0) {
            currentIndex--;
        }
        updateActive();
    }

    else if (event.key === "Enter") {
        if (currentIndex >= 0 && suggestionItems[currentIndex]) {
            suggestionItems[currentIndex].click();
        } else {
            getWeather();
        }
    }
});

// 🎯 Highlight active suggestion
function updateActive() {

    suggestionItems.forEach((item, index) => {

        if (index === currentIndex) {
            item.style.background = "rgba(255,255,255,0.5)";
            item.style.color = "#000";
        } else {
            item.style.background = "rgba(255,255,255,0.2)";
            item.style.color = "#fff";
        }
    });
}

// 🌆 Change background based on weather
function setWeatherBackground(weather) {

    let body = document.body;

    if (weather === "Clear") {
        body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
    }
    else if (weather === "Clouds") {
        body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    }
    else if (weather === "Rain") {
        body.style.background = "linear-gradient(135deg, #4e54c8, #8f94fb)";
    }
    else if (weather === "Snow") {
        body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
    }
    else {
        body.style.background = "linear-gradient(135deg, #74ebd5, #acb6e5)";
    }
}
