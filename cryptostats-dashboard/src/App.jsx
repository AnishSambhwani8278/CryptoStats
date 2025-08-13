import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState(null);
  const [currency, setCurrency] = useState("bitcoin");
  const [darkMode, setDarkMode] = useState(false);

  const currencies = [
    { id: "bitcoin", name: "Bitcoin" },
    { id: "ethereum", name: "Ethereum" },
    { id: "solana", name: "Solana" },
    { id: "dogecoin", name: "Dogecoin" },
  ];

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${currency}/market_chart`, {
        params: { vs_currency: "usd", days: 7 },
      })
      .then((res) => {
        const prices = res.data.prices;
        setData({
          labels: prices.map((p) => new Date(p[0]).toLocaleDateString()),
          datasets: [
            {
              label: `${currencies.find(c => c.id === currency).name} Price (USD)`,
              data: prices.map((p) => p[1]),
              borderColor: darkMode ? "#4ade80" : "#3b82f6",
              backgroundColor: darkMode
                ? "rgba(74, 222, 128, 0.2)"
                : "rgba(59, 130, 246, 0.2)",
            },
          ],
        });
      });
  }, [currency, darkMode]);

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "95vw",
        backgroundColor: darkMode ? "#1c1c1c" : "#f8fafc",
        color: darkMode ? "#f1f5f9" : "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        CryptoStats Dashboard
      </h1>

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        {currencies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "8px 15px",
          marginBottom: "30px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: darkMode ? "#4ade80" : "#3b82f6",
          color: "white",
          cursor: "pointer",
        }}
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <div style={{ width: "900px" }}>
        {data ? <Line data={data} /> : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default App;
