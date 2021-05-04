import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <span className="input-group-text">First and last name</span>
          <input
            type="text"
            aria-label="First name"
            className="form-control"
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
            {...register("lasttName", {
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
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
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
        <div className="form-group">
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
