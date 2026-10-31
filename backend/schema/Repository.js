import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Repository name is required'],
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Repository full name (owner/repo) is required'],
      trim: true
    },
    owner: {
      type: String,
      required: [true, 'Repository owner is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    },
    defaultBranch: {
      type: String,
      default: 'main'
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    starsCount: {
      type: Number,
      default: 0
    },
    forksCount: {
      type: Number,
      default: 0
    },
    openIssuesCount: {
      type: Number,
      default: 0
    },
    lastSyncedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index so a user cannot track the same repo multiple times
repositorySchema.index({ user: 1, fullName: 1 }, { unique: true });

const Repository = mongoose.model('Repository', repositorySchema);
export default Repository;

