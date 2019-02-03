const mongoose = require("mongoose");
const TourSchema = require("./../schemas/tour_schema");

const emptyOverview = {
  featured: 0,
  total: 0,
  last_updated: null
};

TourSchema.statics.overview = async function() {
  try {
    const result = await this.aggregate(overviewPipeline);
    return result[0] || emptyOverview;
  } catch (err) {
    throw Error(err);
  }
};

const TourModel = mongoose.model("Tour", TourSchema);

// Returns total number of featured tours, most recent update time and total count
const overviewPipeline = [
  {
    $project: {
      _id: 0,
      featured: 1,
      updatedAt: 1
    }
  },
  {
    $group: {
      _id: null,
      featured: {
        $sum: {
          $cond: [
            {
              $eq: ["$featured", true]
            },
            1,
            0
          ]
        }
      },
      total: {
        $sum: 1
      },
      last_updated: {
        $max: "$updatedAt"
      }
    }
  },
  {
    $project: {
      _id: 0
    }
  }
];

module.exports = TourModel;
