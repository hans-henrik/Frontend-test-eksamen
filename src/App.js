import "./App.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style2.css";

import LoggedIn from "./LoggedIn";
import LogIn from "./Login";
import facade from "./ApiFacade";
import Table from "react-bootstrap/Table";

import { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { URL } from "./settings";

function LoginPrompt() {
  const [loggedIn, setLoggedIn] = useState(false);
  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };

  const login = (user, pass) => {
    facade.login(user, pass).then((res) => setLoggedIn(true));
  };

  if (loggedIn) {
    return (
      <div>
        <LoggedIn />
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <LogIn login={login} />;
}

export default function BasicExample() {
  return (
    <Router>
      <div>
        <Header />

        <hr />

        <div className="content">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/auctions">
              <Dashboard />
            </Route>
            <Route path="/boats">
              <Boats />
            </Route>
            <Route path="/edit">
              <Edit />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function Header() {
  const [isLoggedIn, setLoggedIn] = useState(!!facade.getToken());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState(
    isLoggedIn ? facade.getUserRoles().split(",") : []
  );

  const login = (event) => {
    event.preventDefault();

    facade.login(username, password).then(() => {
      setLoggedIn(true);
      setRoles(facade.getUserRoles().split(","));
    });
  };

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    setRoles([]);
  };

  if (isLoggedIn) {
    return (
      <div>
        <ul className="header">
          {facade.hasUserAccess("user") && (
            <li>
              <NavLink exact activeClassName="selected" to="/auctions">
                Auctions
              </NavLink>
            </li>
          )}
          {facade.hasUserAccess("user") && (
            <li>
              <NavLink exact activeClassName="selected" to="/boats">
                Boats
              </NavLink>
            </li>
          )}
          {facade.hasUserAccess("user") && (
            <li>
              <NavLink exact activeClassName="selected" to="/create">
                Create Boat
              </NavLink>
            </li>
          )}
          {facade.hasUserAccess("user") && (
            <li>
              <NavLink exact activeClassName="selected" to="/edit">
                Edit Boat
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              exact
              activeClassName="selected"
              to="/logout"
              onClick={logout}
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ul className="header">
        <form>
          <input
            placeholder="User Name"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            placeholder="Password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="button" onClick={login} class="btn btn-primary">
            Login
          </button>
        </form>
      </ul>
    </div>
  );
}

function Login() {
  return (
    <form action="{URL}">
      <div class="form-group w-25">
        <LoginPrompt />
      </div>
    </form>
  );
}

function Dashboard() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetch(URL + "api/auction/show")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAuctions(data);
      });
  }, []);

  return (
    <>
      {auctions.length > 0 ? (
        <>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>DATE</td>
                  <td>LOCATION</td>
                  <td>TIME</td>
                  <td>NAME</td>
                </tr>
              </thead>
              <tbody>
                {auctions.map((x) => {
                  return (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      <td>{x.date}</td>
                      <td>{x.location}</td>
                      <td>{x.time}</td>
                      <td>{x.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <h2>Failed fetching data</h2>
      )}
    </>
  );
}

function Boats() {
  const [boats, setBoats] = useState([]);

  useEffect(() => {
    fetch(URL + "api/boat/show/3")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBoats(data);
      });
  }, []);

  return (
    <>
      {boats.length > 0 ? (
        <>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>OWNER_ID</td>
                  <td>NAME</td>
                  <td>BRAND</td>
                  <td>MAKE</td>
                  <td>YEAR</td>
                  <td>IMAGE</td>
                </tr>
              </thead>
              <tbody>
                {boats.map((x) => {
                  return (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      <td>{x.ownerId}</td>
                      <td>{x.name}</td>
                      <td>{x.brand}</td>
                      <td>{x.make}</td>
                      <td>{x.year}</td>
                      <td>{x.img}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <h2>Failed fetching data</h2>
      )}
    </>
  );
}

function Auctions() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetch(URL + "api/boat/show/" + facade.getToken())
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAuctions(data);
      });
  }, []);

  return (
    <>
      {auctions.length > 0 ? (
        <>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>BRAND</td>
                  <td>IMG</td>
                  <td>MAKE</td>
                  <td>NAME</td>
                  <td>YEAR</td>
                  <td>OWNER_ID</td>
                </tr>
              </thead>
              <tbody>
                {auctions.map((x) => {
                  return (
                    <tr key={x.id}>
                      <td>{x.brand}</td>
                      <td>{x.img}</td>
                      <td>{x.make}</td>
                      <td>{x.name}</td>
                      <td>{x.year}</td>
                      <td>{x.ownerId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <h2>Failed fetching data</h2>
      )}
    </>
  );
}

function Create() {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const obj = Object.fromEntries(data.entries())

    fetch(URL + "api/boat/create/3", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then((response) => {
      if (response.status !== 200) {
        setMessage(response.status + ': ' + response.statusText)
        return
      }
      setMessage('Boat created')
    }).catch(() => {
      setMessage('Error')
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>{ message }</p>
      
      <label for="name">Name:</label>
      <br />
      <input type="text" id="name" name="name" />
      <br />

      <label for="brand">Brand:</label>
      <br />
      <input type="text" id="brand" name="brand" />
      <br />

      <label for="make">Make:</label>
      <br />
      <input type="text" id="make" name="make" />
      <br />

      <label for="year">Year:</label>
      <br />
      <input type="number" id="year" name="year" />
      <br />

      <label for="img">Image:</label>
      <br />
      <input type="text" id="img" name="img" />
      <br />

      <button className="btn btn-primary" type="submit">Submit</button>
    </form>
  );
}

function Edit() {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.target)
    const obj = Object.fromEntries(data.entries())

    fetch(URL + "api/boat/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then((response) => {
      if (response.status !== 200) {
        setMessage(response.status + ': ' + response.statusText)
        return
      }
      setMessage('Boat updated')
    }).catch(() => {
      setMessage('Error')
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>{ message }</p>

      <label for="id">ID:</label>
      <br />
      <input type="number" id="id" name="id" />
      <br />

      <label for="ownerId">Owner ID:</label>
      <br />
      <input type="number" id="ownerId" name="ownerId" />
      <br />
      
      <label for="name">Name:</label>
      <br />
      <input type="text" id="name" name="name" />
      <br />

      <label for="brand">Brand:</label>
      <br />
      <input type="text" id="brand" name="brand" />
      <br />

      <label for="make">Make:</label>
      <br />
      <input type="text" id="make" name="make" />
      <br />

      <label for="year">Year:</label>
      <br />
      <input type="number" id="year" name="year" />
      <br />

      <label for="img">Image:</label>
      <br />
      <input type="text" id="img" name="img" />
      <br />

      <button className="btn btn-primary" type="submit">Submit</button>
    </form>
  );
}
