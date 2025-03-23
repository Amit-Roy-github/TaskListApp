import connectDB from "../../database/src/db/index.js";
import Task from "../../database/src/schema/taskData.js";

const saveData = async (req, res) => {
  const data = req.body;
  console.table(data);
  const newTask = new Task({ ...data });
  try {
    await newTask.save();
    res.status(201).json({ message: "Task saved successfully", task: newTask });
    console.info("Task data saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save task" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = {};

    // Add tag filter if provided
    if (tag) {
      query.tag = tag;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { contents: { $regex: search, $options: "i" } },
      ];
    }
    console.table(query);
    const tasks = await Task.find(query);
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { data } = req.body;
    const { title } = data;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const result = await Task.findOneAndDelete({ title });
    if (!result) {
      return res.status(404).json({ error: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task deleted successfully", deletedTask: result });
    console.info("Task Deleted successfully : ", title);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateData = async (req, res) => {
  try {
    const { _id, title, isChecked, contents, tag } = req.body;
    console.table(req.body);
    if (!title) {
      return res.status(400).json({ error: "Title is required to update" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id },
      { title, isChecked, contents, tag },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
    console.log("Data Updated successfully for task : ", title);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { saveData, connectDB, getDashboardData, deleteTask, updateData };
