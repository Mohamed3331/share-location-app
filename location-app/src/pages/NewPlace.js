import React, {useContext, useReducer, useCallback, useState} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import {AuthContext} from '../context/auth-context'
import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import ErrorModal from '../components/UIElements/ErrorModal'
import LoadingSpinner from '../components/UIElements/LoadingSpinner'
import ImageUpload from '../components/FormElements/ImageUpload';

import './PlaceForm.css';

const newPlaceReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return {
        ...state, inputs: {...state.inputs,[action.inputId]: { value: action.value, isValid: action.isValid }},};
    default:
      return state;
  }
};

const NewPlace = () => {
    const { token} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [state, dispatch] = useReducer(newPlaceReducer, {
        inputs: {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                 value: null,
                 isValid: false
            }
        },
    });

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        });
    }, []);

    const history = useHistory();

    const placeSubmitHandler = async event => {   
        event.preventDefault();
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('title', state.inputs.title.value);
            formData.append('description', state.inputs.description.value);
            formData.append('address', state.inputs.address.value);
            formData.append('image', state.inputs.image.value);
            const response = await axios({
                method: 'post',
                url: 'http://localhost:5000/api/places',
                data: formData,
                headers: {
                    Authorization: 'Bearer ' +   token
                }
            });
            history.push('http://localhost:5000/');

            const data = await response

            if (!data.statusText === "OK") {
                throw new Error(data.data.message)
            }
            
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
    };

    const errorHandler = () => {
        setError(null)
    }

    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && 
                    <div className="center">
                        <LoadingSpinner asOverlay />
                    </div>
                }
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    label="Address"
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an image."
                />
                <Button type="submit">
                    ADD PLACE
                </Button>
            </form>
        </>
    );
    };



export default NewPlace;






