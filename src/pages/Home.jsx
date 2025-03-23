import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [addTag, setAddTag] = useState(true);
  const [newTag, setNewTag] = useState("");

  const handleTagClick = (tag) => {
    navigate(`/dashboard?tag=${tag}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getDashboardData"
        );
        const uniqueTags = new Set(
          response.data
            .map((task) => task.tag)
            .filter((tag) => tag && tag.trim() !== "")
        );
        setTags(Array.from(uniqueTags));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="relative w-full h-full flex justify-center items-center border-gray-800 border-2 rounded-lg bg-gray-900">
        <div className="grid grid-cols-3 gap-7">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-black border-2 border-gray-800 rounded-lg px-10 py-5 cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              <p className="text-sky-600 text-center text-4xl font-bold">
                {tag}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute top-10 left-10 flex gap-2 ">
          <button
            className="bg-blue-950 px-4 py-2 rounded-md text-sm text-gray-300"
            onClick={() => setAddTag(!addTag)}
          >
            add
          </button>
          {addTag && (
            <div className="flex gap-2">
              <input
                type="text"
                className="text-gray-400 bg-black text-sm font-bold px-4 py-2 border-2 border-gray-900 rounded-md text-sky-600 focus:outline-none"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                className="bg-green-900  px-4 py-2 rounded-md"
                onClick={() => setTags([...tags, newTag])}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
