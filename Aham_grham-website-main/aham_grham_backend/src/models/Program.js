import mongoose from 'mongoose';

const programSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    programId: {
      type: String,
      required: true,
      unique: true,
    },
    bookingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model('Program', programSchema);

export default Program;
