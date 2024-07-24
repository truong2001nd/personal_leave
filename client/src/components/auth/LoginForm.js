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
