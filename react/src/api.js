const API_BASE_URL = "http://localhost:5000";

export const fetchSymptoms = async () => {
  const res = await fetch(`${API_BASE_URL}/symptoms`);
  return await res.json();
};

export const predictDisease = async (symptoms) => {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });
  return await res.json();
};
