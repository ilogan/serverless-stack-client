import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Auth } from "aws-amplify";

import Routes from "./Routes";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        await Auth.currentSession();
        setIsAuthenticated(true);
      } catch (e) {
        if (e !== "No current user") {
          alert(e);
        }
      }
      setIsAuthenticating(false);
    };
    checkAuthenticated();
  }, []);

  const handleLogout = async event => {
    await Auth.signOut();
    setIsAuthenticated(false);
  };

  const childProps = {
    isAuthenticated,
    setIsAuthenticated
  };

  return (
    // render the screen only after determining whether or not the user is logged in or not
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Scratch</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <NavItem onClick={handleLogout}>Logout</NavItem>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    )
  );
}

export default App;
