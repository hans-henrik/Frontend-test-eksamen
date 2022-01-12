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
        <LoggedIn facade={facade} />
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
        <Header facade={facade} />

        <hr />

        <div className="content">
          <Switch>
            <Route path="/login">
              <Login facade={facade} />
            </Route>
            <Route path="/whatisthiseven">
              <Dashboard facade={facade} />
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
          {facade.hasUserAccess("admin") && (
            <li>
              <NavLink exact activeClassName="selected" to="/whatisthiseven">
                Dashboard
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

function OwnersComponent() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetch(URL + "api/owner/show")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOwners(data);
      });
  }, []);

  return (
    <>
      {owners.length > 0 ? (
        <>
          <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>Address</td>
                  <td>Phone</td>
                </tr>
              </thead>
              <tbody>
                {owners.map((x) => {
                  return (
                    <tr key={x.id}>
                      <td>{x.id}</td>
                      <td>{x.name}</td>
                      <td>{x.address}</td>
                      <td>{x.phone}</td>
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

function Dashboard() {
  return OwnersComponent();
}
