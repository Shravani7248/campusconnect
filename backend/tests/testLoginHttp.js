const testHttp = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "shravanijoshi2005@gmail.com",
        password: "password123",
      }),
    });

    const status = res.status;
    const data = await res.json();
    console.log("HTTP STATUS:", status);
    console.log("HTTP RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("HTTP FETCH FAILED (Is backend running on port 5000?):", err.message);
  }
};

testHttp();
