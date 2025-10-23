"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">UAS Frontend</h1>
      {data ? (
        <div className="alert alert-success text-center">
          {data.message}
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}
