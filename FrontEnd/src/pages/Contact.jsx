import React, { useState } from "react"; // import React e lo useState hook
import axios from "axios"; // import axios per le richieste HTTP
import "../css/contact.css"; // import del CSS specifico per la pagina

function Contact() {
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Stato per mostrare messaggi di successo o errore
  const [status, setStatus] = useState("");

  // Aggiorna lo stato del form quando l'utente digita
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Gestisce l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // previene il refresh della pagina
    setStatus(""); // resetta il messaggio di status prima di inviare

    try {
      // Invio dei dati al backend
      await axios.post("http://localhost:3001/api/contacts/send", formData);

      // Aggiorna lo stato per mostrare il messaggio di successo
      setStatus("Message sent successfully!");

      // Resetta i campi del form
      setFormData({ name: "", email: "", message: "" });

      // Nasconde il messaggio di status dopo 4 secondi
      setTimeout(() => setStatus(""), 4000);
    } catch (error) {
      // In caso di errore mostra un messaggio e logga l'errore
      console.error("Error sending message:", error);
      setStatus("Failed to send message. Please try again later.");

      // Nasconde il messaggio di errore dopo 4 secondi
      setTimeout(() => setStatus(""), 4000);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {" "}
      {/* wrapper generale della pagina */}
      <div className="contact-card">
        {" "}
        {/* card centrale del form */}
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Campo nome */}
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          {/* Campo email */}
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          {/* Campo messaggio */}
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} rows="5" required />
          {/* Bottone di invio */}
          <button type="submit">Send Message</button>
        </form>
        {/* Messaggio di successo o errore */}
        {status && <p className={`contact-status ${status.includes("successfully") ? "success" : "error"}`}>{status}</p>}
      </div>
    </div>
  );
}

export default Contact;
