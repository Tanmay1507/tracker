import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository',
      required: true
    },
    commitHash: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    authorName: {
      type: String,
      default: 'Unknown'
    },
    authorEmail: {
      type: String,
      default: ''
    },
    authorDate: {
      type: Date,
      default: Date.now
    },
    url: {
      type: String,
      default: ''
    },
    additions: {
      type: Number,
      default: 0
    },
    deletions: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

commitSchema.index({ repository: 1, commitHash: 1 }, { unique: true });

const Commit = mongoose.model('Commit', commitSchema);
export default Commit;

