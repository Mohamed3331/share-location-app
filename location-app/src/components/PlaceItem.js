import React, {useState, useContext} from 'react';
import axios from 'axios';

import Card from '../components/UIElements/Card';
import Button from '../components/FormElements/Button';
import Modal from './UIElements/Modal'
import ErrorModal from '../components/UIElements/ErrorModal'
import Map from './UIElements/Map'
import {AuthContext} from '../context/auth-context' 
import './PlaceItem.css';

const PlaceItem = props => {
  const {userId, token} = useContext(AuthContext)
  const [showMap, setShowMap] = useState(false)
  const [error, setError] = useState()
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true)

  const closeMapHandler = () => setShowMap(false)

  const showDeleteWarningHandler = () => setShowConfirmModal(true)

  const cancelDeleteHandler = () => setShowConfirmModal(false)

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await axios({
        method: 'delete',
        url: `http://localhost:5000/api/places/${props.id}`,
        headers: {
          Authorization: 'Bearer ' + token 
        }
      });
      
      props.onDelete(props.id)
      
    } catch (error) {
      
    }
  }

  const errorHandler = () => {
    setError(null)
  }

  return (
    <><ErrorModal error={error} onClear={errorHandler}/>
      <Modal 
        show={showMap} 
        onCancel={closeMapHandler} 
        header={props.address} 
        contentClass="place-item__modal-content" 
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}> Close </Button>}
        >

        <div className="map-container">
          <Map coordinates={props.coordinates}/>
        </div>
      </Modal>
      
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone.
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {userId === props.creatorId  && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
            
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
