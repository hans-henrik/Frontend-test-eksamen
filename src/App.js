import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style2.css"

import LoggedIn from './LoggedIn';
import LogIn from './Login';
import facade from './ApiFacade';

import { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import { URL, WEATHER_URL } from './settings';

function LoginPrompt() {
  const [loggedIn, setLoggedIn] = useState(false)
  const logout = () => {
    facade.logout()
    setLoggedIn(false)
  }

  const login = (user, pass) => {
    facade.login(user, pass)
    .then(res => res.json())
    .then(res => setLoggedIn(true));
  }

  const weatherData =(city) => {
    facade.weatherData(city)
    
  }

  return (
    <div>
      {!loggedIn ? (<LogIn login={login} />) :
        (<div>
          <LoggedIn facade={facade} />
          <button onClick={logout}>Logout</button>
        </div>)}
    </div>
  )
}

export default function BasicExample() {
  return (
    <Router>
      <div>
        <Header/>
        <hr />
       
        {
          /*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
          */
        }
        <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/whatisthiseven">
            <Dashboard />
          </Route>
        </Switch>
      </div>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.


function Header(){
  return(
    <div>
      <ul className="header">
          <li>
          <NavLink exact activeClassName="selected" to="/">Weather</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/whatisthiseven">Dashboard</NavLink>
          </li>
        </ul>
    </div>
  );
}



function Home() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)

  const fetchWeather = async (event) => {
    event.preventDefault()

    const response = await fetch(`${WEATHER_URL}?city=${city}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    setWeatherData(data)
  }

  if (weatherData !== null) {
    return (
      <div>
        <div>City: { weatherData.weather.city }</div>
        <div>Official Name: { weatherData.country.officialName }</div>
        <div>Population: { weatherData.country.population }</div>
        <div>Temperature: { weatherData.weather.temperature }</div>
      </div>
    )
  }

  return (
    <div className="col-md-12 text-center">
      <h2>Weather Information Central Service System (WICSS)</h2>
      <form action={WEATHER_URL} method="POST">
        <input type="text" name="city" value={city} onChange={e => setCity(e.target.value)} />
        <button onClick={fetchWeather}>Submit</button>
      </form>
    </div>
  );
}

/*function Home() {
  const myForm = document.getElementById('myForm');
  myForm.addEventListener('submit', function (e){
    e.preventDefault();
    const formData = new FormData(this);
    <form class="form" id="myForm">
        <input type="text" name="city"/>
        <button onClick="submit">Submit</button>
      </form>
    fetch('http://localhost:8080/CA2/api/weather',{
      method: 'POST',
      body: 'formData'
    }).then(function(response){
      return response.text();
    }).then(function (text) {
      console.log(text);
    }).catch(function (error) {
      console.log(error)
    })
  })
  return (
    <div className="col-md-12 text-center">
      <h2>Weather Information Central Service System (WICSS)</h2>
      
    </div>
  );
}*/

function Login() {
  return (
    <form action="{URL}">
    <div class="form-group w-25">
      <LoginPrompt/>
    </div>
  </form>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

