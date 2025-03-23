import { useState, useEffect } from "react";
import axios from "axios";
const Card = ({
  initialData,
  setTaskList,
  setIsEdit,
  setDisplayForm,
  setInitialFormData,
}) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete("http://localhost:3000/deleteTask", { data: { data } })
      .then(() => {
        setTaskList((prev) => prev.filter((task) => task._id !== data._id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };
  return (
    <>
      <div class="w-xl h-70 rounded-lg bg-slate-950 flex flex-col p-2 gap-y-1">
        <div id="title" class="relative h-13 flex items-center pl-4 space-x-2">
          <label class="flex items-center cursor-pointer space-x-4">
            <input
              type="checkbox"
              class="hidden peer"
              checked={data.isChecked}
              onChange={() =>
                setData((preData) => {
                  const newData = { ...preData, isChecked: !preData.isChecked };
                  return newData;
                })
              }
            />
            <div class="w-6 h-6 border-2 rounded-md border-yellow-900 peer-checked:bg-green-800 peer-checked:border-green-700 transition-all"></div>
          </label>
          <p class="text-lg font-sans subpixel-antialiased font-semibold slashed-zero text-slate-300">
            {data.title}
          </p>
          <div class="absolute right-1 top-2 flex gap-2">
            <button
              class="bg-blue-900 text-blue-100"
              style={{
                padding: "2px 6px",
              }}
              onClick={() => {
                setIsEdit(true);
                setInitialFormData(data);
                setDisplayForm((pre) => !pre);
              }}
            >
              E
            </button>
            <button
              class="bg-red-900 text-red-100"
              style={{
                padding: "2px 5px",
              }}
              onClick={handleDelete}
            >
              D
            </button>
          </div>
        </div>

        <div class="w-full h-[2px] rounded-md bg-neutral-700"></div>

        <div id="content" class="relative py-1 flex-4 overflow-auto">
          <ul class="pl-1 text-sm leading-tight whitespace-nowrap">
            {data.contents.map((item, index) => (
              <li id={index + 1} class="flex items-center">
                <span class="text-cyan-700 text-[20px] mr-1">•</span>
                <p class="text-md font-semibold tracking-tight font-sans subpixel-antialiased slashed-zero text-neutral-400 pr-3">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default Card;
