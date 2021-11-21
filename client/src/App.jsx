import React, { useState, useEffect } from "react";
import { Button } from "antd";

const App = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:3001/api")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Error"));
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1>{message}</h1>
      <Button type="primary">Primary Button</Button>
    </div>
  );
};

export default App;
