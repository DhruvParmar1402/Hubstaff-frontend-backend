import { useEffect, useState } from "react";
import axios from "axios";
import "./Component.css";

const baseUrl = "http://localhost:8080";

const apiMap = {
  "0": `${baseUrl}/activities/getTopFiveApps/665989 `,
  "1": `${baseUrl}/activities/mostActiveUser/665989`,
  "2": `${baseUrl}/applications/topFiveApps/665989`,
  "3": `${baseUrl}/activities/appsUsed/665989`,
  "4": `${baseUrl}/applications/new/665989`,
  "5": `${baseUrl}/users/new/665989`,
};

function Component() {
  const [selected, setSelected] = useState("0");
  const [data, setData] = useState([]);
  const [trend, setTrend] = useState("");

  const extractData = (res) => {

    if (selected === "3" && res?.data?.data?.data) {
      setTrend(res.data.data.trend);
      return res.data.data.data;
    }

    if (Array.isArray(res?.data?.data)) {
      setTrend("");
      return res.data.data;
    }

    setTrend("");
    return [];
  };
 
  useEffect(() => {
    axios
      .get(apiMap[selected])
      .then((response) => {
        setData(extractData(response));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]);
        setTrend("");
      });
  }, [selected]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stats</h1>

      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="0">Top 5 most active apps (based on activities)</option>
        <option value="1">Top 5 most active users (based on activities)</option>
        <option value="2">Top 5 apps (based on number of users)</option>
        <option value="3">Total number of apps with trend</option>
        <option value="4">Newly added apps this month</option>
        <option value="5">New users this month</option>
      </select>

      {trend && (
        <p style={{ marginTop: "20px", fontWeight: "bold", fontSize: "18px" }}>
          Overall Trend:{" "}
          <span style={{ color: trend === "UP" ? "green" : trend === "DOWN" ? "red" : "gray" }}>
            {trend}
          </span>
        </p>
      )}
      <div className="cardContainer">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="card">
              {typeof item === "string" ? (
                <h3>{item}</h3>
              ) : (
                Object.entries(item).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}
                  </p>
                ))
              )}
            </div>
          ))
        ) : (
          <p style={{ marginTop: "20px" }}>No data available.</p>
        )}
      </div>
    </div>
  );
}

export default Component;