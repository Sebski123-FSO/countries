import React, { useState, useEffect } from "react";
import axios from "axios";

const CountryLanguages = ({ languages }) => {
  return (
    <ul>
      {Object.values(languages).map((language) => {
        return <li key={language}>{language}</li>;
      })}
    </ul>
  );
};

const CityWeather = ({ country, getWeather, weather }) => {
  // console.log(weather);
  useEffect(() => {
    getWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]);
  }, [country]);

  return (
    <table>
      <tbody>
        <tr>
          <strong>temperature </strong>
          {Object.values(weather).length > 0 ? weather.main.temp : "?"} celcius
        </tr>
        <tr>
          <td>
            <img alt="" src={Object.values(weather).length > 0 ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : ""}></img>
          </td>
        </tr>
        <tr>
          <strong>wind </strong>
          {Object.values(weather).length > 0 ? weather.wind.speed : "?"} m/s
        </tr>
      </tbody>
    </table>
  );
};

const CountryData = ({ countries, setFilter, getWeather, weather }) => {
  const onShowButtonPressed = (name) => {
    return () => {
      setFilter(name);
    };
  };

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <table>
        <tbody>
          {countries.map((country) => {
            return (
              <tr key={country.name.common}>
                <td style={{ padding: 5 }}>{country.name.common}</td>
                <td>
                  <button onClick={onShowButtonPressed(country.name.common)}>show</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else if (countries.length === 1) {
    const country = countries[0];
    return (
      <>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <h3>languages</h3>
        <CountryLanguages languages={country.languages}></CountryLanguages>
        <img alt="" src={country.flags.png} style={{ width: 100 }}></img>
        <h3>Weather in {country.capital}</h3>
        <CityWeather country={country} getWeather={getWeather} weather={weather}></CityWeather>
      </>
    );
  } else {
    return <p>No results</p>;
  }
};

const App = ({ api_key }) => {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState({});
  // console.log(api_key);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const getWeather = (lat, lon) => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`).then((response) => {
      setWeather(response.data);
    });
  };

  const onFilterUpdate = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={onFilterUpdate} style={{ margin: 5 }}></input>
      </div>
      <CountryData
        setFilter={setFilter}
        weather={weather}
        getWeather={getWeather}
        countries={countries.filter((country) => {
          return country.name.common.toLowerCase().includes(filter.toLowerCase());
        })}
      ></CountryData>
    </div>
  );
};

export default App;
