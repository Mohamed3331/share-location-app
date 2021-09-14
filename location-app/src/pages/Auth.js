import React, { useState, useContext } from "react";

import Card from "../components/UIElements/Card";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ImageUpload from "../components/FormElements/ImageUpload";
import { useForm } from "../hooks/form-hook";
import axios from 'axios'
import { AuthContext } from "../context/auth-context";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
const [isLoading, setLoading] = useState(false)
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true)
    if (isLoginMode) {
      try {
        const responseData = await axios({
          url: `http://localhost:5000/api/users/login`,
          method: "post",
          data: {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          },
          header: {
            "Content-Type": "application/json",
          }
        })
        auth.login(responseData.data.userId, responseData.data.token);
        setLoading(false)
      } catch (err) {}
    } else {
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await axios({
          url: `http://localhost:5000/api/users/signup`,
          method: "post",
          data: formData
        })
        setLoading(false)
        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={"error happened"} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit">
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
