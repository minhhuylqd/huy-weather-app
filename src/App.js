import { useEffect, useState } from "react";

const api = {
  key: "",
  getLocation: "https://dataservice.accuweather.com/locations/v1/cities/search",
  hourlyForecast: "https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/",
  dailyForecast: "https://dataservice.accuweather.com/forecasts/v1/daily/1day/"
}


function App() {

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState([]);
  const [hourlyWeather, setHourlyWeather] = useState({});
  const [dailyWeather, setDailyWeather] = useState([]);

  const searchLocation = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.getLocation}?apikey=${api.key}&q=${query}`)
        .then(res => res.json())
        .then(result => {
          setLocation(result);
          setQuery('');
          //console.log(result);
        })
    }
  }


  const getDailyWeather = () => {
    if (location.length > 0) {
      fetch(`${api.dailyForecast}${location[0].Key}?apikey=${api.key}&metric=true`)
        .then(res => res.json())
        .then(result => {
          setDailyWeather(result);
          //console.log(result);
        })
    }
  }

  const getHourlyWeather = () => {
    if (location.length > 0) {
      fetch(`${api.hourlyForecast}${location[0].Key}?apikey=${api.key}&metric=true`)
        .then(res => res.json())
        .then(result => {
          setHourlyWeather(result);
          //console.log(result);
        })
    }
  }

  const dateStr = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  useEffect(getHourlyWeather, [location])
  useEffect(getDailyWeather, [location])
  
  const locationStr = (location[0] !== undefined) ? `${location[0].LocalizedName} - ${location[0].Country.LocalizedName}` : undefined
  const hourlyTemp = (hourlyWeather[0] !== undefined) ? hourlyWeather[0].Temperature.Value : undefined
  const hourlyCondition = (hourlyWeather[0] !== undefined) ? hourlyWeather[0].IconPhrase : undefined
  // const hourlyTemp = hourlyWeather[0].Temperature.Value
  const dailyTemp = (dailyWeather.DailyForecasts !== undefined) ? dailyWeather.DailyForecasts[0].Temperature : undefined
  //console.log(hourlyWeather[0])
  console.log(hourlyTemp)
  //console.log(dailyWeather.DailyForecasts[0].Temperature.Maximum.Value)
  console.log(dailyTemp)
  
  return (
    <div className={
      (typeof hourlyTemp != "undefined") ?
        ((hourlyTemp > 2) ? "app warm" : "app")
        : "app"
    }>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={
              searchLocation
            }
          />
          <h6 className="search-submit">Press Enter to search</h6>
        </div>
        <div className="location-box">
          <div className="location">
            {(locationStr !== undefined) ? locationStr : ""}
          </div>
          <div className="date">
            {(locationStr !== undefined) ? dateStr(new Date()) : ""}
          </div>
        </div>
        {(typeof hourlyTemp != "undefined" && typeof dailyTemp != "undefined" && typeof hourlyCondition != "undefined") ?
          <div className="weather-box">
            <div className="hour-forecast-box">
              {`${hourlyTemp}°C`}
              <div className="hour-condition-box">
                {`${hourlyCondition}`}
                  <br/>
                <div className="daily-forecast-box">
                  { 
                    (`Lowest Temp: ${dailyTemp.Minimum.Value}°C`)
                  }
                  <br/>
                  { 
                    (`Highest Temp: ${dailyTemp.Maximum.Value}°C`)
                  }
                </div>
              </div>
            </div>
            
          </div>
            :
          ""
        }
        
      </main>
    </div>
  );
}

export default App;
