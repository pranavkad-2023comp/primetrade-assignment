import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  user: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status:      { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    user:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
