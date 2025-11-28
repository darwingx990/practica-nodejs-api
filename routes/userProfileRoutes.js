const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfile.controller");

// Rutas
router.post("/", userProfileController.createUserProfile);
router.get("/", userProfileController.getAllUserProfiles);
router.get("/:idint", userProfileController.getUserProfileByIdint);
router.put("/:idint", userProfileController.updateUserProfile);

module.exports = router;
