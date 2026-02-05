import "./styles.css";

const apiKey = "Q9N99NTEQN43TJBNU3BTPGS3G";
const urlBase = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

async function displayWeather() {
  const locationInput = document.getElementById("location");
  const weatherDiv = document.getElementById("weather");

  weatherDiv.textContent = "";

  const location = locationInput.value.trim();

  if (!location) return;

  const weather = await getWeather(location);

  if (!weather) return;

  const image = document.createElement("img");
  const iconName = weather.icon;
  const icon = await import(`./icons/${iconName}.svg`);
  image.src = icon.default;

  const description = document.createElement("p");
  description.textContent = weather.description;

  weatherDiv.appendChild(image);
  weatherDiv.appendChild(description);

  for (let key in weather) {
    if (key !== "icon" && key !== "description" && key !== "Location") {
      const condition = document.createElement("div");
      condition.classList.add("condition");

      const label = document.createElement("span");
      label.classList.add("condition-label");
      label.textContent = key;

      const value = document.createElement("value");
      value.classList.add("condition-value");

      if (key === "Temperature" || key === "Feels Like") {
        const tempF = weather[key];
        const tempC = fahrenheitToCelsius(tempF);
        value.textContent = `${tempC} °C | ${tempF} °F`;
      } else if (key === "Precipitation Probability") {
        value.textContent = `${weather[key]}%`;
      } else {
        value.textContent = weather[key];
      }

      condition.appendChild(label);
      condition.appendChild(value);
      weatherDiv.appendChild(condition);
    }
  }
}

async function getWeather(location) {
  const data = await getDataFromServer(location);

  if (!data) return;

  const weather = {
    "Location": data.resolvedAddress,
    "Time": data.currentConditions.datetime,
    description: data.description,
    "Conditions": data.currentConditions.conditions,
    "Temperature": data.currentConditions.temp,
    "Feels Like": data.currentConditions.feelslike,
    "Precipitation Probability": data.currentConditions.precipprob,
    icon: data.currentConditions.icon,
  };

  return weather;
}

async function getDataFromServer(location) {
  const url = `${urlBase}/${location}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function fahrenheitToCelsius(temp) {
  return Math.round((temp - 32) * (5 / 9) * 10) / 10;
}

const searchButton = document.getElementById("search");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  displayWeather();
})
