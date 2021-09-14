import React, {useEffect, useState} from 'react'
import axios from 'axios';

import ErrorModal from '../components/UIElements/ErrorModal'
import LoadingSpinner from '../components/UIElements/LoadingSpinner' 
import UsersList from '../components/UsersList'

const Users = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {         // NEVER CONVERT THE USEFFECT HOOK INTO ASYNC NEVER!
        const sendRequest = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get('http://localhost:5000/api/users')
                console.log(response);
                const data = await response
    
                if (!data.statusText === "OK") {
                    throw new Error(data.data.message)
                }
          
                setLoadedUsers(data.data.users);
            } catch (error) {
                setError(error.message);
            }

            setIsLoading(false);
        }
        sendRequest();
    }, [])

    const errorHandler = () => {
        setError(null)
    }

    return (
        <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      </>
    )
}

export default Users
