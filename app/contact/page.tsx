"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    signupDate: "", // <-- added signup date field
    message: "",
  });

  const [status, setStatus] = useState(""); // submission status

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("Your message has been sent successfully!");
        setForm({ name: "", email: "", signupDate: "", message: "" });
      } else {
        setStatus(data.message || "Error sending message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Vocaglob Support</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-3"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-3"
          placeholder="Email Address"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div>
          <label className="block mb-1 font-medium">
            Date you signed up for Vocaglob
          </label>
          <input
            className="w-full border p-3"
            type="date"
            required
            value={form.signupDate}
            onChange={(e) => setForm({ ...form, signupDate: e.target.value })}
          />
        </div>

        <textarea
          className="w-full border p-3"
          placeholder="Describe your issue"
          rows={5}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Submit
        </button>
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}