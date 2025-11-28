const mongoose = require("mongoose");

//COUNTER SCHEMA (for autoincrement)
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

//USER PROFILE SCHEMA
const userProfileSchema = new mongoose.Schema(
  {
    idint: {
      type: Number,
      unique: true,
    },
    profile: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

//PRE-SAVE HOOK (auto-increment idint)
userProfileSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        "userProfile_idint",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.idint = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

//STATIC METHODS

// Create a new User Profile
userProfileSchema.statics.create = async function (data) {
  try {
    const profile = new this(data);
    await profile.save();

    return {
      idint: profile.idint,
      profile: profile.profile,
    };
  } catch (error) {
    throw new Error(`Error creating user profile: ${error.message}`);
  }
};

// Get all user profiles
userProfileSchema.statics.findAll = async function () {
  try {
    const profiles = await this.find().sort({ idint: 1 });

    return profiles.map((profile) => ({
      idint: profile.idint,
      profile: profile.profile,
    }));
  } catch (error) {
    throw new Error(`Error retrieving user profiles: ${error.message}`);
  }
};

// Find by idint
userProfileSchema.statics.findByIdint = async function (idint) {
  try {
    const profile = await this.findOne({ idint });

    if (!profile) {
      throw new Error("User profile not found");
    }

    return {
      idint: profile.idint,
      profile: profile.profile,
    };
  } catch (error) {
    throw new Error(`Error retrieving user profile: ${error.message}`);
  }
};

// Search by description (profile name)
// userProfileSchema.statics.searchByDescription = async function (searchTerm) {
//   try {
//     const profiles = await this.find({
//       profile: { $regex: searchTerm, $options: "i" },
//     }).sort({ profile: 1 });

//     return profiles.map((profile) => ({
//       idint: profile.idint,
//       profile: profile.profile,
//     }));
//   } catch (error) {
//     throw new Error(`Error searching user profiles: ${error.message}`);
//   }
// };

// Update a user profile
userProfileSchema.statics.updateProfile = async function (idint, data) {
  try {
    const profile = await this.findOneAndUpdate({ idint }, data, {
      new: true,
    });

    if (!profile) {
      throw new Error("User profile not found for updating");
    }

    return {
      idint: profile.idint,
      profile: profile.profile,
    };
  } catch (error) {
    throw new Error(`Error updating user profile: ${error.message}`);
  }
};

// Delete a user profile
userProfileSchema.statics.deleteProfile = async function (idint) {
  try {
    const profile = await this.findOneAndDelete({ idint });

    if (!profile) {
      throw new Error("User profile not found for deletion");
    }

    return {
      idint: profile.idint,
      profile: profile.profile,
    };
  } catch (error) {
    throw new Error(`Error deleting user profile: ${error.message}`);
  }
};

// ========================= EXPORT MODEL =========================
const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
