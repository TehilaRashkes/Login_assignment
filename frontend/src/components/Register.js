import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { useHistory } from "react-router-dom";

const Register = () => {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const user = await api.register(data);
    if (user) {
      history.push({ pathname: "/", user: user });
    }
  };

  const loginPage = () => {
    history.push({ pathname: "/login" });
  };

  return (
    <div className="card w-50 mx-auto mt-5">
      <h1 className="m-auto text my-5">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group ">
          <span className="input-group-text">First and last name</span>
          <input
            type="text"
            aria-label="First name"
            className="form-control"
            placeholder="First name"
            {...register("firstName", {
              required: "required",
              minLength: {
                value: 3,
                message: "Must containt at list 3 character",
              },
            })}
          />
          {errors.firstName && (
            <p className="form-text"> {errors.firstName.message} </p>
          )}
          <input
            type="text"
            aria-label="Last name"
            className="form-control"
            placeholder="Last name"
            {...register("lastName", {
              required: "required",
              minLength: {
                value: 3,
                message: "Must containt at list 3 character",
              },
            })}
          />
          {errors.lasttName && (
            <p className="form-text"> {errors.lasttName.message} </p>
          )}
        </div>
        <div className="card-body">
          <label for="exampleInputEmail1" className="form-label">
            Email address
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
      <button
        type="button"
        className="btn btn-outline-info m-5"
        onClick={loginPage}
      >
        already sign in? Login
      </button>
    </div>
  );
};

export default Register;
