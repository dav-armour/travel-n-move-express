const mongoose = require("mongoose");
const EnquirySchema = require("../schemas/enquiry_schema");

const emptyOverview = {
  new: 0,
  researching: 0,
  pending: 0,
  closed: 0,
  total: 0,
  last_updated: null
};

EnquirySchema.statics.overview = async function() {
  try {
    const result = await this.aggregate(overviewPipeline);
    return result[0] || emptyOverview;
  } catch (err) {
    throw Error(err);
  }
};

const EnquiryModel = mongoose.model("Enquiry", EnquirySchema);

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
      closed: {
        $sum: {
          $cond: [
            {
              $eq: ["$status", "closed"]
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

module.exports = EnquiryModel;
