import React, {useReducer, useCallback, useEffect, useState, useContext} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import ErrorModal from '../components/UIElements/ErrorModal'
import LoadingSpinner from '../components/UIElements/LoadingSpinner' 
import {AuthContext} from '../context/auth-context'
import './PlaceForm.css';

const updatePlaceReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return {...state, inputs: {...state.inputs, [action.inputId]: { value: action.value, isValid: action.isValid }},
    };
    default:
      return state;
  }
};

const UpdatePlace = () => {
  const {userId, token} = useContext(AuthContext)
  const placeId = useParams().placeId;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedPlace, setLoadedPlace] = useState();

  const sendRequest = useCallback( async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/places/${placeId}`)

      const data = await response

      if (!data.statusText === "OK") {
        throw new Error(data.data.message)
      }

      setLoadedPlace(data.data.message);
    } catch (error) {
      setError(error.response.data.message)
    }
    setIsLoading(false);
    },
    [placeId],
  )

  useEffect(() => {
    sendRequest()
  }, [sendRequest, placeId])

  const [state, dispatch] = useReducer(updatePlaceReducer, {
          inputs: {
              title: {
                  value: '',
                  isValid: false
              },
              description: {
                  value: '',
                  isValid: false
              },    
          }
  });  

  const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        });
  }, []);

  const history = useHistory()

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      const response = await axios({
        method: 'patch',
        url: `http://localhost:5000/api/places/${placeId}`,
        data: {
          title: state.inputs.title.value,
          description: state.inputs.description.value
        },
        headers: {
          Authorization: 'Bearer ' + token 
        }
      });

      const data = await response
      
      if (!data.statusText === "OK") {
        throw new Error(data.data.message)
      }
      setIsLoading(false);
      history.push('/' + userId + '/places')

    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner/>
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  const errorHandler = () => {
    setError(null)
  } 


  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type="submit">
          UPDATE PLACE
        </Button>
      </form> }
    </>
  );
};

export default UpdatePlace;
