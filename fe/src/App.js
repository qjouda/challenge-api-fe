import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Ingredients from "./ingredients";

const Login = ({ onSuccess }) => {
  const login = (username, password) => {
    return fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      onSuccess();
    } catch (error) {
      console.log("EROR", { error });
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">ussername</label>
        <input
          id="username"
          {...register("username", {
            required: "required",
          })}
          type="username"
          value="admin"
        />
        {errors.username && <span role="alert">{errors.username.message}</span>}
        <label htmlFor="password">password</label>
        <input
          id="password"
          {...register("password", {
            required: "required",
            minLength: {
              value: 5,
              message: "min length is 5",
            },
          })}
          type="password"
          value="admin"
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

function App() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const url = "http://localhost:3000/user";
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      setUser(json.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <span>loading user...</span>;
  }

  if (!user || error) {
    return (
      <>
        {error}
        <Login onSuccess={() => fetchData()} />
      </>
    );
  }

  return (
    <section>
      <h1>User info</h1>
      user id: {user.id}
      <br />
      username: {user.username}
      <br />
      isAdmin: {String(user.isAdmin)}
      <hr />
      <h1>Igredients</h1>
      <Ingredients />
    </section>
  );
}

export default App;
