import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [dressFile, setDressFile] = useState(null);
  const [fabricFile, setFabricFile] = useState(null);
  const [dressPath, setDressPath] = useState('');
  const [fabricPath, setFabricPath] = useState('');
  const [outputPath, setOutputPath] = useState('');

  const handleDressChange = (e) => {
    setDressFile(e.target.files[0]);
  };

  const handleFabricChange = (e) => {
    setFabricFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('dress', dressFile);
    formData.append('fabric', fabricFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDressPath(response.data.dress_path);
      setFabricPath(response.data.fabric_path);
      setOutputPath(response.data.output_path);
    } catch (error) {
      console.error('Error uploading images', error);
    }
  };

  return (
    <div className="App">
      <h1>Dress Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dress Image: </label>
          <input type="file" onChange={handleDressChange} />
        </div>
        <div>
          <label>Fabric Image: </label>
          <input type="file" onChange={handleFabricChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      <div className="images">
        {dressPath && <img src={`http://localhost:5000/${dressPath}`} alt="Dress" />}
        {fabricPath && <img src={`http://localhost:5000/${fabricPath}`} alt="Fabric" />}
        {outputPath && <img src={`http://localhost:5000/${outputPath}`} alt="Output" />}
      </div>
    </div>
  );
}

export default App;
