import React, { useState } from "react";
import axios from "axios";
import Navbar from "../template/Navbar";

const App = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobDesc, setJobDesc] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a resume");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);

    try {
      const { data } = await axios.post("http://localhost:5000/analyze-resume", formData);

      let jsonString = data.replace("```json", "").replace("```", "").trim();
      let jsonData = JSON.parse(jsonString);
      console.log(jsonData);
      setAnalysis(jsonData);
    } catch (error) {
      console.error("Error:", error);
      alert("Resume analysis failed");
    }
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen text-white flex flex-col items-center py-10 mt-16">
      <h2 className="text-3xl font-bold text-primaryPink mb-6">AI Resume Analyzer</h2>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md w-[60%]">
        <input
          type="file"
          accept=".pdf"
          className="w-full p-2 border border-gray-600 rounded-md mb-4 bg-gray-800"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <textarea
          placeholder="Paste Job Description"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white mb-4 h-24"
          onChange={(e) => setJobDesc(e.target.value)}
        ></textarea>
        <button
          onClick={handleUpload}
          className="w-full bg-primaryPink hover:bg-pink-600 text-white font-semibold py-2 rounded-md transition"
        >
          Analyze Resume
        </button>
      </div>

      {analysis && (
        <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-md w-[60%]">
          <h3 className="text-xl font-bold text-primaryPink mb-4">Analysis Results</h3>
          <p><b className="text-primaryPink">Resume Score: </b>{analysis.resumeScore}</p>
          <p><b className="text-primaryPink">Name: </b>{analysis.name}</p>
          <p><b className="text-primaryPink">Experience: </b>{analysis.experience}</p>

          <p className="mt-3 font-semibold text-primaryPink">Skills:</p>
          <ul className="list-disc list-inside">
            {analysis.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <p className="mt-3 "><b className="text-primaryPink">Education: </b>{analysis.education}</p>
          

          <p className="mt-3 font-semibold text-primaryPink">Improvements:</p>
          <ul className="list-disc list-inside">
            {analysis.improvements.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
    
  );
};

export default App;
