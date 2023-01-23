import React, { useState } from "react";
import jsonBig from "json-bigint";

const toTitleCase = (str) => {
  // Replace any uppercase letter with a space and the letter
  return str.replace(/([A-Z])/g, ' $1')
    // Replace the first letter with its uppercase version
    .replace(/^./, (str) => str.toUpperCase());
};

const DisplayJSONData = ({ data }) => {
  // Helper function to check if the passed value is an object
  const isObject = (obj) => obj === Object(obj);

  return (
    <div className="grid place-items-center">
      {
        // Iterate through all the keys of the data object
        Object.keys(data).map((key) => (
          <div className="w-[95vw] md:w-[512px]" key={key}>
            {
              // Check if the value of the key is a nested object (or array)
              isObject(data[key]) ? (
                <div>
                  {/* If it's a nested object, display the key in bold */}
                  <div className="text-lg font-bold w-full text-center bg-[#C0C0D0]">{toTitleCase(key)}</div>
                  {/* Recursively call this component to handle nested objects */}
                  <DisplayJSONData data={data[key]} />
                </div>
              ) : (
                <div className="text-lg text-gray-600">
                  {/* If it's not an object or array, display the key and value in small gray font */}
                  <div className="px-2 bg-gray-200 text-lg font-medium">{toTitleCase(key)}</div>
                  <div className="px-2 bg-gray-100">{data[key]}</div>
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

export const App = () => {
  const [fileData, setFileData] = useState(null);

  const handleFileChange = (event) => {
    // Store the first file in the event's target files array in a variable
    const file = event.target.files[0];
    // Check if the file's type is "application/json"
    if (file.type === "application/json") {
      // Create a new FileReader object
      const reader = new FileReader();
      // Add an onload event listener to the reader
      reader.onload = (e) => {
        // Store the result of the read in a variable
        const jsonString = e.target.result;
        // Parse the json string and set it as FileData
        setFileData(jsonBig.parse(jsonString));
      };
      // Start reading the file as text
      reader.readAsText(file);
    } else {
      // If the file is not of type "application/json" show an alert
      alert("Invalid file type, please select a JSON file.");
    }
  };

  return (
    <div className="container mx-auto py-4">
      {/* Title of the JSON Viewer */}
      <h1 className="text-2xl font-bold text-center mb-4">JSON Viewer</h1>
      <div className="grid place-items-center mb-4">
        {/* Input for selecting a file */}
        <input
          type="file"
          onChange={handleFileChange}
          className="p-2 w-[90vw] md:w-[384px] rounded-sm border border-gray-600"
        />
      </div>
      {/* Only render the DisplayJSONData component if fileData is not null */}
      {fileData && <DisplayJSONData data={fileData} />}
    </div>
  );
}
