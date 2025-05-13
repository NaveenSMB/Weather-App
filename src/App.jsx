import { useEffect, useState } from 'react'

import './App.css'

import searchIcon from './assets/search.png';
import cloudIcon from './assets/cloud.png';
import clearIcon from './assets/clear.png';
import snowIcon from './assets/snow.png';
import drizzleIcon from './assets/drizzle.png';
import humidityIcon from './assets/humidity.png';
import windIcon from './assets/wind.png';
import rainIcon from './assets/rain.png';


// This block is only for visual nothing else


const WeatherDetails=({icon,temp,city,country,lat,long,humidity,wind})=>{
  return (
    <>
    <div className='image'>
        <img src={icon} alt="Image" />
    </div>
    <div className="temp">{temp} °C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className='lat'>latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='long'>longitude</span>
        <span>{long}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="" className='icon'/>
        <div className="data">
          <div className="humidity-percent">{humidity} %</div>
          <div className='text'>Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="" className='icon'/>
        <div className="data">
          <div className="wind-percent">{wind} km/h</div>
          <div className='text'>Wind</div>
        </div>
      </div>
    </div>
  </>
  )
};


// This blow block is for the Search bar and icon
// This is the main function

function App() {
let api_key = "2717d67b397c9c18e4db76b5f344a897";
const [text, setText] = useState("Coimbatore");           // default in search bar this is aslo used while API call

// these are for visuals
const [icon, setIcon] = useState(snowIcon);
const [temp, setTemp] = useState(0);
const [city, setCity] = useState("Coimbatore");
const [country, setCountry] = useState("IN");
const [lat, setLat] = useState(0);
const [long, setLong] = useState(0);
const [humidity, setHumidity] =useState(0);
const [wind, setWind] = useState(0);

const [loading, setLoading] = useState(false);
const [cityNotFound,setCityNotFound] = useState(false);
const [error, setError] = useState(null);

const weatherIconMap = {
  "01d": clearIcon,
  "01n": clearIcon,
  "02d": cloudIcon,
  "02n": cloudIcon,
  "03d": drizzleIcon,
  "03n": drizzleIcon,
  "04d": drizzleIcon,
  "04n": drizzleIcon,
  "09d": rainIcon,
  "09n": rainIcon,
  "10d": rainIcon,
  "10n": rainIcon,
  "13d": snowIcon,
  "13n": snowIcon,
};

const search = async ()=>{
  setLoading(true);
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
  try{
    let res=await fetch(url);
    let data=await res.json();
    if(data.cod==="404"){
      console.error("City not found");
      setCityNotFound(true);
      setLoading(false);
      return;
    }
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLong(data.coord.lon);
    const weatherIconCode=data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || clearIcon)
    setCityNotFound(false);

  }catch(error){
      console.error("An error occured:", error.message)
      setError("An error while fetching data");
  }finally{
      setLoading(false);
  }

};
const handlecity=(e)=>{
setText(e.target.value);
}
const handlekeydown = (e) =>{
  if(e.key==="Enter"){
    search();
  }
}
useEffect(function(){
  search();
},[]);

  return (
    <>
      <div className='container'>
          <div className='input-container'>
            <input type="text" 
            className='cityInput' 
            placeholder='Search City' 
            onChange={handlecity} 
            value={text}
            onKeyDown={handlekeydown}
            />
            <div className='search-icon'>
              <img src={searchIcon} alt="Search" onClick={()=>search()}/>
            </div>
          </div>
          {loading &&  <div className='loading-message'>loading...</div> }
          {error && <div className='error-message'>{error}</div>}
          {cityNotFound && <div className="city-no-found">City Not Found</div>}

          {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind}/>}


          <p className="copyright">Designed By <span>Naveen S M B</span></p>
      </div>
    </>
  )
}

export default App
