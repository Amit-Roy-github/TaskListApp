import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Form = ({ initialFormData, setDisplayForm, isEdit, tag, setRefresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    tag: (tag || "").toLowerCase(),
    ...initialFormData,
    contents:
      initialFormData.contents?.length > 0 ? initialFormData.contents : [""],
  });

  // Create refs array for content inputs
  const contentRefs = useRef([]);

  // Update refs when contents change
  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(
      0,
      formData.contents.length
    );
  }, [formData.contents.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title === "") {
      console.error("Title can not be empty");
      return;
    }
    // Ensure tag is lowercase before sending
    const dataToSend = {
      ...formData,
    };
    for (let i = 0; i < dataToSend.contents.length; i++) {
      if (dataToSend.contents[i] === "") {
        dataToSend.contents.splice(i, 1);
      }
    }
    if (isEdit) {
      axios
        .put("http://localhost:3000/updateData", dataToSend)
        .then(() => {
          setRefresh((prev) => !prev);
        })
        .catch((error) => console.error("Error updating task:", error));
    } else {
      axios
        .post("http://localhost:3000/saveData", dataToSend)
        .then(() => {
          setRefresh((prev) => !prev);
        })
        .catch((error) => console.error("Error creating task:", error));
    }
    setDisplayForm(false);
  };

  useEffect(() => {
    const handleKeyboardSave = (e) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "Enter" || e.key === "Return")
      ) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    const handleKeyboardClose = (e) => {
      console.table(e);
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "Delete" || e.key === "Backspace")
      ) {
        e.preventDefault();
        setDisplayForm(false);
      }
    };

    const handleContentKeyDown = (e, index) => {
      console.table(e);
      if (e.key === "Enter" || e.key === "Return") {
        e.preventDefault();
        const newData = { ...formData };
        if (newData.contents.at(-1) === "") return;
        newData.contents = [...newData.contents, ""];
        setFormData(newData);

        // Focus on the new input in the next render cycle
        setTimeout(() => {
          const nextInput = contentRefs.current[index + 1];
          if (nextInput) {
            nextInput.focus();
          }
        }, 0);
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyboardSave);
    window.addEventListener("keydown", handleKeyboardClose);

    // Add event listeners for content inputs
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener("keydown", (e) => handleContentKeyDown(e, index));
      }
    });

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyboardSave);
      window.removeEventListener("keydown", handleKeyboardClose);

      // Remove event listeners from content inputs
      contentRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.removeEventListener("keydown", (e) =>
            handleContentKeyDown(e, index)
          );
        }
      });
    };
  }, [formData, handleSubmit]);

  return (
    <div className="absolute z-100 w-full h-full rounded flex justify-center backdrop-blur-md bg-black/40 bg-opacity-50">
      <div className="relative bg-gray-900 w-xl h-svh rounded-md my-4 py-8 px-6 gap-2">
        <form>
          <div className="flex flex-col text-sm font-semibold mb-4">
            <label htmlFor="title" className="pb-1">
              Title
            </label>
            <input
              className="p-2 border rounded-md border-blue-600 focus:outline-blue-500"
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
            />
          </div>

          <div className="flex flex-col text-sm font-semibold mb-4">
            <label htmlFor="tag" className="pb-1">
              Tag
            </label>
            <input
              className="p-2 border rounded-md border-blue-600 focus:outline-blue-500"
              type="text"
              id="tag"
              value={formData.tag}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  tag: e.target.value.toLowerCase(),
                }));
              }}
            />
          </div>

          <div className="flex flex-col text-sm font-semibold m-4">
            <label className="pb-1">Contents</label>
            {formData.contents.map((value, index) => (
              <input
                key={index}
                ref={(el) => (contentRefs.current[index] = el)}
                className="p-2 m-[2px] border font-normal rounded-md border-blue-600 focus:outline-blue-500"
                type="text"
                id={`content-${index}`}
                value={value}
                onChange={(e) => {
                  const newContents = [...formData.contents];
                  newContents[index] = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    contents: newContents,
                  }));
                }}
              />
            ))}
          </div>
        </form>
        <div className="flex gap-x-2">
          <button
            className="bg-green-500 px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded"
            onClick={() => setDisplayForm(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
