import React from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "../../assets/style/loginForm.css";

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
    // <Form className="container" onSubmit={login}>
    //   <Form.Group className="title-form-group">
    //     <Form.Label>Đăng nhập </Form.Label>
    //   </Form.Group>
    //   <Form.Group className="custom-form-group">
    //     <Form.Label>Emali: </Form.Label>
    //     <Form.Control
    //       type="text"
    //       placeholder="email"
    //       name="email"
    //       required
    //       value={email}
    //       onChange={onChangeLoginForm}
    //     />
    //   </Form.Group>
    //   <Form.Group className="custom-form-group">
    //     <Form.Label>Mật khẩu: </Form.Label>
    //     <Form.Control
    //       type="password"
    //       placeholder="Password"
    //       name="password"
    //       required
    //       value={password}
    //       onChange={onChangeLoginForm}
    //     />
    //   </Form.Group>
    //   <Button variant="success" className="d-block mx-auto" type="submit">
    //     Login
    //   </Button>
    // </Form>
    <div className="login-container">
      <form className="form-login" onSubmit={login}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Tên đăng nhập</label>
          <input
            type="text"
            className="form-control"
            placeholder="email đăng nhập"
            value={email}
            name="email"
            onChange={onChangeLoginForm}
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="exampleInputPassword1">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={password}
            name="password"
            onChange={onChangeLoginForm}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
