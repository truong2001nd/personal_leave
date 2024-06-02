import React from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const LoginForm = () => {
  // Context
  const { loginUser } = useContext(AuthContext);

  // Local state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  const login = async (event) => {
    event.preventDefault();

    try {
      const loginData = await loginUser(loginForm);

      // if (loginData.success) {
      console.log(loginData);
      // }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form className="my-4" onSubmit={login}>
      <Form.Group style={{ margin: 10 }}>
        <Form.Control
          type="text"
          placeholder="email"
          name="email"
          required
          value={email}
          onChange={onChangeLoginForm}
        />
      </Form.Group>
      <Form.Group style={{ margin: 10 }}>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          required
          value={password}
          onChange={onChangeLoginForm}
        />
      </Form.Group>
      <Button variant="success" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
