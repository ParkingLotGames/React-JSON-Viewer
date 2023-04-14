import React, { useState } from "react";
import jsonBig from "json-bigint";

const toTitleCase = (str) => {
  // Replace any uppercase letter with a space and the letter
  return str.replace(/([A-Z])/g, ' $1')
    // Replace the first letter with its uppercase version
    .replace(/^./, (str) => str.toUpperCase());
};

const DisplayJSONData = ({ data, handleChange }) => {
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
                  <DisplayJSONData data={data[key]} handleChange={handleChange} />
                </div>
              ) : (
                <div className="text-lg text-gray-600">
                  {/* If it's not an object or array, display the key and value in small gray font */}
                  <div className="px-2 bg-gray-200 text-lg font-medium">{toTitleCase(key)}</div>
                  <input type="text" value={data[key]} onChange={(e) => handleChange(key, e.target.value)} className="px-2 bg-gray-100 w-full" />
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

const SaveFileButton = (props) => {

  const handleSave = () => {
    // convert fileData to json string
    const jsonString = JSON.stringify(props.fileData);

    // create a blob object with the json string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // create a link element and trigger a click event to open the save file dialog
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "file.json";
    link.click();
  }

  return (
    <button onClick={handleSave}>Save File</button>
  )
}

export const App = () => {
  const [fileData, setFileData] = useState(null);
  const [modifiedData, setModifiedData] = useState(null);
  const [showAddFields, setShowAddFields] = useState(false);
  const [showAddArrayField, setShowAddArrayField] = useState(false);
  const [showAddNestedObjectField, setShowAddNestedObjectField] = useState(false);

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
        setModifiedData(jsonBig.parse(jsonString)); // Initialize modifiedData with fileData
      };
      // Start reading the file as text
      reader.readAsText(file);
    } else {
      // If the file is not of type "application/json" show an alert
      alert("Invalid file type, please select a JSON file.");
    }
  };

  const handleChange = (key, value) => {
    setFileData({
      ...fileData,
      [key]: value
    });
    const updatedData = { ...modifiedData, [key]: value };
    setModifiedData(updatedData);
  };

  const handleAdd = () => {
    setShowAddFields(!showAddFields);
  };

  const handleAddNewEntry = (newKey, newValue) => {
    setFileData({
      ...fileData,
      [newKey]: newValue
    });
    setShowAddFields(false);
  };

  const NewEntry = () => (
    <div className="text-center py-4">
      <button onClick={handleAdd}>
        {showAddFields ? "Add" : "Add New Entry"}
      </button>
      {showAddFields && (
        <p>input fields here</p>)}
      <SaveFileButton fileData={modifiedData} />
    </div>
  )

  const NewArray = () => (
    <div className="text-center py-4">
      <button onClick={handleAdd}>
        {showAddFields ? "Add" : "Add Array"}
      </button>
      {showAddFields && (
        <p>input fields here</p>)}
      <SaveFileButton fileData={modifiedData} />
    </div>
  )

  const NewNestedObject = () => (
    <div className="text-center py-4">
      <button onClick={handleAdd}>
        {showAddFields ? "Add" : "Add Nested Object"}
      </button>
      {showAddFields && (
        <p>input fields here</p>)}
      <SaveFileButton fileData={modifiedData} />
    </div>
  )

  return (
    <div className="grid place-items-center mx-auto py-4">
      {/* Title of the JSON Viewer */}
      <h1 className="text-3xl text-center">JSON Viewer</h1>
      {/* Input field to select JSON file */}
      <input type="file" onChange={handleFileChange} className="p-2 w-[90vw] md:w-[384px] rounded-sm border border-gray-600 text-gray-700 border" />
      {/* Display the JSON data */}
      {fileData && <DisplayJSONData data={fileData} handleChange={handleChange} />}
      <NewEntry />
    </div>
  );
};