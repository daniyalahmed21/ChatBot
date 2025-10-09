import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [message, setMessage] = useState("Hello Vite + React!");
  return (
    useEffect(() => {
      fetch("/api/hello")
        .then((response) => response.json())
        .then((data) => setMessage(data.message));
    }, []),
    (
      <div>
        <h1 className="font-bold text-3xl">{message}</h1>
        <div className="flex flex-col justify-center items-center min-h-svh">
          <Button>Click me</Button>
        </div>
      </div>
    )
  );
}

export default App;
