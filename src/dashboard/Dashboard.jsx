import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../card/Card";
import Form from "../card/Form";

const Dashboard = () => {
  const [displayForm, setDisplayForm] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [initialFormData, setInitialFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag").toLowerCase();
  const navigate = useNavigate();
  useEffect(() => {
    setInitialFormData((prev) => ({ ...prev, tag }));
    const fetchData = async () => {
      try {
        const response = await axios.get(
          tag && tag !== "all"
            ? `http://localhost:3000/getDashboardData?tag=${tag}`
            : `http://localhost:3000/getDashboardData`
        );
        setTaskList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [tag, refresh]);
  useEffect(() => {
    const handleKeyboardAdd = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setDisplayForm(!displayForm);
      }
    };
    const handleKeyboardBack = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "i") {
        e.preventDefault();
        navigate("/");
      }
    };
    document.addEventListener("keydown", handleKeyboardBack);
    document.addEventListener("keydown", handleKeyboardAdd);
    return () => {
      document.removeEventListener("keydown", handleKeyboardBack);
      document.removeEventListener("keydown", handleKeyboardAdd);
    };
  }, [displayForm]);
  return (
    <>
      <div>
        <button
          class="fixed top-[5rem] left-[3rem] bg-indigo-900"
          style={{
            fontSize: "2rem",
            padding: "0px 18px",
          }}
          onClick={() => {
            setIsEdit(false);
            setDisplayForm(!displayForm);
          }}
        >
          +
        </button>
      </div>
      <div>
        <button
          class="fixed top-[10rem] left-[3rem] bg-blue-900"
          style={{
            fontSize: "2rem",
            padding: "0px 18px",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          ≤
        </button>
      </div>
      {displayForm && (
        <Form
          isEdit={isEdit}
          initialFormData={isEdit ? initialFormData : { tag: tag }}
          setDisplayForm={setDisplayForm}
          setTaskList={setTaskList}
          setRefresh={setRefresh}
        />
      )}
      <div class="flex flex-wrap gap-6">
        {taskList.map((data) => (
          <Card
            key={data._id || data.title}
            initialData={data}
            setTaskList={setTaskList}
            setIsEdit={setIsEdit}
            setDisplayForm={setDisplayForm}
            setInitialFormData={setInitialFormData}
          />
        ))}
      </div>
    </>
  );
};
export default Dashboard;
