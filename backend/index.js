import express from "express";
import cors from "cors";
import {
  connectDB,
  saveData,
  getDashboardData,
  deleteTask,
  updateData,
} from "./db/index.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.post("/saveData", saveData);
app.get("/getDashboardData", getDashboardData);
app.delete("/deleteTask", deleteTask);
app.put("/updateData", updateData);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
