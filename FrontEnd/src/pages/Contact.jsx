import React, { useState } from "react";
import "./Pages.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent! (mock implementation)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} rows="5" required />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
