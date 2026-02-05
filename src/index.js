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
}

async function getWeather(location) {
  const data = await getDataFromServer(location);

  if (!data) return;

  const weather = {
    resolvedAddress: data.resolvedAddress,
    dateTime: data.currentConditions.datetime,
    description: data.description,
    conditions: data.currentConditions.conditions,
    temp: data.currentConditions.temp,
    feelsLike: data.currentConditions.feelslike,
    precipProb: data.currentConditions.precipprob,
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

const searchButton = document.getElementById("search");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  displayWeather();
})
