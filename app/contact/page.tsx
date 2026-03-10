"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    signupDate: "",
    complaint: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Your message has been sent to Vocaglob support.");

        // reset form after submission
        setForm({
          name: "",
          email: "",
          signupDate: "",
          complaint: "",
        });
      } else {
        alert("There was an error sending your message. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
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
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          className="w-full border p-3"
          placeholder="Email Address"
          type="email"
          required
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})}
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
            onChange={(e)=>setForm({...form,signupDate:e.target.value})}
          />
        </div>

        <textarea
          className="w-full border p-3"
          placeholder="Describe your issue"
          rows={5}
          required
          value={form.complaint}
          onChange={(e)=>setForm({...form,complaint:e.target.value})}
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Submit Complaint
        </button>

      </form>
    </div>
  );
}