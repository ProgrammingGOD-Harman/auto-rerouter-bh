import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

function App() {
  const [email, setEmail] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const busRoutesData = "New bus routes: Route A, Route B, Route C";

  useEffect(() => {
    const savedSubscribers =
      JSON.parse(localStorage.getItem("subscribers")) || [];
    setSubscribers(savedSubscribers);
  }, []);

  const handleSubscribe = () => {
    if (!email) return alert("Please enter a valid email.");

    const updatedSubscribers = [...subscribers, email];
    localStorage.setItem("subscribers", JSON.stringify(updatedSubscribers));
    setSubscribers(updatedSubscribers);
    setEmail("");
    alert("Subscribed successfully!");
  };

  useEffect(() => {
    emailjs.init("if0ZqhzGa8sgNMgcZ");
  }, []);

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (subscribers.length === 0)
      return alert("No subscribers to send emails to.");

    const templateParams = {
      subscribers: subscribers.join(", "),
      bus_routes: busRoutesData,
    };

    emailjs
      .send("service_jjxemyv", "template_rmtarcs", templateParams)
      .then(() => {
        alert("Emails sent successfully!");
      })
      .catch((error) => {
        console.error("Failed to send emails:", error);
        alert("Failed to send emails.");
      });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Email Subscription Service</h2>
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubscribe}>Subscribe</button>

      <h3>Subscribers:</h3>
      <ul>
        {subscribers.map((sub, index) => (
          <li key={index}>{sub}</li>
        ))}
      </ul>

      <form onSubmit={handleSendEmail}>
        <button type="submit">Send Bus Routes to All Subscribers</button>
      </form>
    </div>
  );
}

export default App;
