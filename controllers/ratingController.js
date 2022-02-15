const express = require("express");
const router = express.Router();
const Rating = require("../models/ratings.js");
const Recipe = require("../models/recipes.js");
const User = require("../models/users.js");

//!create
//TODO extra: validation
router.post("/new", async (req, res) => {
  console.log("calling new",req.body);
  const userId = req.body?.userId;
  const recipeId = req.body?.recipeId;
  const rating = req.body?.rating;

  try {
    const newRating = await Rating.create({
      userId: userId,
      recipeId: recipeId,
      rating: rating,
    });

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { "$push": { ratings: newRating._id } },
      { new: true,"upsert": true }
    ).populate('ratings','rating');
    console.log(updatedRecipe)
    
    res.status(200).json({
      status: "ok",
      message: "rating successfully created",
      data: newRating,
    });
  } catch (error) {
    res.status(400).json({
      status: "not ok",
      error: error,
    });
  }
});

//!delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRating = await Rating.findByIdAndDelete(id);
    res.status(200).json({
      status: "ok",
      message: "delete rating route is working",
      data: deletedRating,
    });
  } catch (error) {
    console.log(error);
  }
});

//!update
router.put("/", async (req, res) => {
  console.log("req body", req.body);
  const { id, rating } = req.body;
  try {
    const editedRating = await Rating.findByIdAndUpdate(
      id,
      { rating: rating },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "ok",
      message: "update rating route is working",
      data: editedRating,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "not ok",
      message: "failed to update rating",
    });
  }
});

//!get
router.post("/", async (req, res) => {
  const userId = req.body?.userId;
  const recipeId = req.body?.recipeId;
  // console.log(req.body);
  try {
    const foundRating = await Rating.findOne({
      userId: userId,
      recipeId: recipeId,
    });
    console.log(foundRating);
    if (foundRating) {
      res.status(200).json({
        status: "ok",
        message: "rating successfully found",
        data: foundRating,
      });
    } else {
      res.status(400).json({
        status: "not ok",
        message: "rating not found",
        error: error,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "not ok",
      message: "rating not found",
      error: error,
    });
  }
});

module.exports = router;
