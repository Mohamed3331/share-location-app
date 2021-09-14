const { validationResult } = require('express-validator');
const mongoose = require('mongoose')
// const fs = require('fs')

const getCordsforAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user');

const getPlaceById = async (req, res) => {
  const placeId = req.params.pid
  
  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    return res.status(404).json({message: "something went wrong with finding your place"})
  }

  if (!place) {
    return res.status(404).json({message: 'could not find this place'})
  }

  res.json({place})
}

const getPlacesByUserId = async (req, res) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    return error;
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return res.json({places: []})
  }

  res.json({places: userWithPlaces.places});
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors)
  }
  
  const {title, description, address, creator} = req.body 

  let coordinates
  try {
    coordinates = await getCordsforAddress(address)
  } catch (error) {
    return next(res.json({error: 'something wrong with the coordinates function'}));
  }
 
  const createdPlace = new Place ({
    title,
    description,
    address,
    location: {
      lng: coordinates[0],
      lat: coordinates[1]
    },
    image: req.file.path,
    creator: req.userData.userId
  })

  let user
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(res.status(404).json({message: 'something wrong with this user'}))
  }

  if (!user) {
    return next(res.json({message: 'user not found'}))
  }

  // const imagePath = place.image

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(err);
  }

  // fs.unlink(imagePath)

  res.status(201).json({place: createdPlace})   
}

const updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({message: "validation error"})
  }

  const {title, description} = req.body 
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    return res.status(404).json({message: "Could not find the place"})
  }
  
  place.title = title
  place.description = description

  await place.save()

  res.status(200).json({place})
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(error);
  }
  console.log(place);

  if (!place) {
    return res.send({message: 'wrong place'})
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(error);
  }

  res.status(200).send({ message: 'Deleted place.' });
}


exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace





























