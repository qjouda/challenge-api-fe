import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddIngredient = ({ onSuccess }) => {
  const add = (name, properties) => {
    return fetch("http://localhost:3000/ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, properties }),
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      await add(data.name, data.properties);
      onSuccess();
    } catch (error) {
      console.log("EROR", { error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">name</label>
      <input
        id="name"
        {...register("name", {
          required: "required",
        })}
        type="name"
      />
      {errors.name && <span role="alert">{errors.name.message}</span>}
      <label htmlFor="properties">properties</label>
      <input
        id="properties"
        {...register("properties", {
          required: "required",
        })}
        type="properties"
      />
      {errors.properties && (
        <span role="alert">{errors.properties.message}</span>
      )}
      <button type="submit">SUBMIT</button>
    </form>
  );
};

const Ingredients = () => {
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const url = "http://localhost:3000/ingredients";
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      setIngredients(json);
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

  if (!ingredients || error) {
    return (
      <>
        Not able to load ingredients
        {error}
      </>
    );
  }

  const deleteById = (id) => {
    return fetch("http://localhost:3000/ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  };
  const remove = async (id) => {
    await deleteById(id);
  };

  return (
    <>
      <AddIngredient onSuccess={() => fetchData()} />
      {ingredients.map((i) => {
        return (
          <div style={{ border: "1px solid black", padding: 5, margin: 5 }}>
            name: {i.name} <br />
            properties: {i.properties}
            <button onClick={() => remove(i.id)}>delete</button>
          </div>
        );
      })}
    </>
  );
};

export default Ingredients;
