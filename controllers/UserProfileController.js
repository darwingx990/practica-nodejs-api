const UserProfile = require("../models/userProfile.model");

// ======================================================
// Create new user profile
// ======================================================
exports.createUserProfile = async (req, res) => {
  try {
    const data = req.body;

    if (!data.profile) {
      return res
        .status(400)
        .json({ message: "The field 'profile' is required." });
    }

    const newProfile = await UserProfile.createProfile(data);

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// Get all user profiles
// ======================================================
exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// Get user profile by idint
// ======================================================
exports.getUserProfileByIdint = async (req, res) => {
  try {
    const { idint } = req.params;

    const profile = await UserProfile.findByIdint(Number(idint));

    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ======================================================
// Search profiles by description
// ======================================================
exports.searchUserProfiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required." });
    }

    const results = await UserProfile.searchByDescription(q);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// Update user profile by idint
// ======================================================
exports.updateUserProfile = async (req, res) => {
  try {
    const { idint } = req.params;

    const updatedProfile = await UserProfile.updateProfile(
      Number(idint),
      req.body
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ======================================================
// Delete user profile by idint
// ======================================================
exports.deleteUserProfile = async (req, res) => {
  try {
    const { idint } = req.params;

    const deletedProfile = await UserProfile.deleteProfile(Number(idint));

    res.status(200).json({
      message: "User profile deleted successfully",
      deleted: deletedProfile,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
