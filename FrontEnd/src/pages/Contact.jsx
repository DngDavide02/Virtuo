import React, { useState } from "react";
import axios from "axios";
import "../css/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/contacts/send", formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });

      // facoltativo: nascondi il messaggio dopo 4 secondi
      setTimeout(() => setStatus(""), 4000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message. Please try again later.");

      // facoltativo: nascondi il messaggio dopo 4 secondi
      setTimeout(() => setStatus(""), 4000);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} rows="5" required />
          <button type="submit">Send Message</button>
        </form>

        {status && <p className={`contact-status ${status.includes("successfully") ? "success" : "error"}`}>{status}</p>}
      </div>
    </div>
  );
}

export default Contact;
