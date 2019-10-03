import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import LoaderButton from "../components/LoaderButton";
import "./Login.css";

export default function Login({ setIsAuthenticated, history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return email.length === 0 || password.length === 0;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(email, password);
      setIsAuthenticated(true);
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={validateForm()}
          type="submit"
          isLoading={isLoading}
          text="Login"
          loadingText="Logging in..."
        />
      </form>
    </div>
  );
}
