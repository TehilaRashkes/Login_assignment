import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { useHistory } from "react-router-dom";
const Login = () => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const user = await api.login(data);
    if (user) {
      history.push({ pathname: "/", user: user });
    }
  };
  const registerPage = () => {
    history.push({ pathname: "/register" });
  };

  return (
    <div className="card w-50 mx-auto mt-5">
      <h1 className="m-auto text mb-3 mt-5">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body">
          <label for="exampleInputEmail1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Email"
            aria-describedby="emailHelp"
            {...register("email", {
              required: "required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Must be a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="form-text"> {errors.email.message} </p>
          )}
        </div>
        <div className="card-body">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "required",
              pattern: {
                value: /^(?=.*?[A-Z])(?=.*?\d)(?=.*?[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g,
                message:
                  "the password must contain capital letter, number, and special character",
              },
            })}
          />
          {errors.password && (
            <p className="form-text"> {errors.password.message} </p>
          )}
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-outline-info">
            Submit
          </button>
        </div>
      </form>

      {/* <Link to="/register" className="dropdown-item bg m-2 col-12">
        New around here? Sign Up
      </Link> */}
      <button
        type="button"
        className="btn btn-outline-info m-5"
        onClick={registerPage}
      >
        New user? Register
      </button>
      {/* <FontAwesomeIcon icon="coffee" /> */}
    </div>
  );
};

export default Login;
