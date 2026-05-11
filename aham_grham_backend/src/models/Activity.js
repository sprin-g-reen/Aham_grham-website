import mongoose from 'mongoose';

const activitySchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      default: 'Admin'
    },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'IMPORT', 'LOGIN', 'LOGOUT']
    },
    module: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    },
    ip: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
