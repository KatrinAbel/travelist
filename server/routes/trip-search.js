const express = require('express');
const { isLoggedIn } = require('../middlewares')
const router = express.Router();
const User = require("../models/User")
const Trip = require("../models/Trip")
const Tip = require("../models/Tip")

// GET info on single trip
router.get("/single/:id", isLoggedIn, (req, res, next) => {
  let id = req.params.id
  Trip.findById(id)
  .then( tripData => 
    res.json(tripData)
    )
})

// GET all trips from friends who have been to the same destination/place
router.get('/:id', isLoggedIn, (req, res, next) => {
  // Get id of users current trip
  let id = req.params.id

  // Find Users trip to get info about destination and the people the user follow (via populate)
  Trip.findById(id)
  .populate("_creator")
  .then(tripData => {
    let tripDestination = tripData.destination
    console.log("debug destination", tripDestination)
    let following = tripData._creator.following
    console.log("debug following", following)

      Trip.find({destination: tripDestination, _creator: {$in: following}, _id: {$ne: id}})
      .populate("_creator")
      // Trip.find({destination: tripDestination, _id: {$ne: id}})
      .then(tripsData => {
        res.json(
          tripsData
        )
      })
  })
});

// GET detail of the selected trip from a friend
router.get("/:id/:friendsId", isLoggedIn, (req, res, next) => {
  // Get id of friends trip
  let friendsId = req.params.friendsId
  // Store id of the users trip to use it in next route
  let id = req.params.id

  // Find selected friends trip and display details
  Trip.findById(friendsId)
  .populate("_tip")
  .then(tripData => 

    res.json({
      tripData
    })
  )
})

// POST tip from friends' trip 
router.post("/:id/:friendsId/:newTipId", isLoggedIn, (req, res, next) => {
  // Get id of users trip
  let id = req.params.id
  let friendsId = req.params.friendsId
  let newTipId = req.params.newTipId

  // Tip.findById(newTipId)
  // .then(tipData => {
  //   console.log("debug tipData", tipData)
  //   Tip.create(tipData)
  // })

  // Create copy of tip based on newTipId and pass on that TipId to be added to array!

  // Find Trip of user first to have access to current tip array
  Trip.findById(id)

  .then(tripData => {
    
    // Create new tip array with existing tips and new one
    let tipArray = tripData._tip
    let newTipArray = [...tipArray, newTipId]

    // Find Trip and update tips with new tip
      Trip.findByIdAndUpdate(id, {
        _tip: newTipArray,
      })
      .then(updateTrip => {
        console.log("debug update trip", updateTrip)
        res.json({
          success: true,
          updateTrip
        })
      })
  })

})

module.exports = router;
