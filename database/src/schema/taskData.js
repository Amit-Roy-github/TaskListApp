import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  isChecked: { type: Boolean, default: false },
  contents: [String],
  tag: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("tasks", taskSchema);
export default Task;
