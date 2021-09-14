import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ErrorModal from '../components/UIElements/ErrorModal'
import LoadingSpinner from '../components/UIElements/LoadingSpinner' 
import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  const userId = useParams().userId;  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedPlaces, setLoadedPlaces] = useState()

  
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      
      try {
        const response = await axios.get(`http://localhost:5000/api/places/user/${userId}`)
  
        const data = await response
            
        setLoadedPlaces(data.data.places);
  
        if (!data.statusText === "OK") {
          throw new Error(data.data.message)
        }

      } catch (error) {
          setError(error.message);
      }
  
      setIsLoading(false);
    }

    sendRequest();
  }, [userId])

  const errorHandler = () => {
    setError(null)
  }

  const placeDeleteHandler = (deletePlaceId) => {
    setLoadedPlaces(loadedPlaces => loadedPlaces.filter(place => place._id !== deletePlaceId))
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
  </>
  )
};

export default UserPlaces;