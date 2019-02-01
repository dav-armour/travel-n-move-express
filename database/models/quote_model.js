const mongoose = require("mongoose");
const QuoteSchema = require("./../schemas/quote_schema");

const emptyOverview = {
  _id: null,
  new: 0,
  researching: 0,
  pending: 0,
  finalized: 0,
  declined: 0,
  total: 0,
  last_updated: null
};

QuoteSchema.statics.overview = async function() {
  try {
    const result = await this.aggregate(overviewPipeline);
    return result[0] || emptyOverview;
  } catch (err) {
    throw Error(err);
  }
};

const QuoteModel = mongoose.model("Quote", QuoteSchema);

// Returns total number of each status, most recent update time and total count
const overviewPipeline = [
  {
    $project: {
      _id: 0,
      status: 1,
      updatedAt: 1
    }
  },
  {
    $group: {
      _id: null,
      new: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "new"]
            },
            1,
            0
          ]
        }
      },
      researching: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "researching"]
            },
            1,
            0
          ]
        }
      },
      pending: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "pending"]
            },
            1,
            0
          ]
        }
      },
      finalized: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "finalized"]
            },
            1,
            0
          ]
        }
      },
      declined: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "declined"]
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
  }
];

module.exports = QuoteModel;
