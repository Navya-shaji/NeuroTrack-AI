import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISession extends Document {
  title: string;
  subject: string;
  duration: number; // in minutes
  date: Date;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    notes: { type: String },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
