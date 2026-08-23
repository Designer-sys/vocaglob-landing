"use client";

import { useState } from "react";

export default function DeleteAccountPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    signupDate: "",
    reason: "",
    confirmation: false,
  });

  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.confirmation) {
      setStatus(
        "Please confirm that you want to request deletion of your VOCAGLOB account."
      );
      return;
    }

    setSending(true);
    setStatus("Submitting your request...");

    try {
      const response = await fetch(
        "/api/delete-account/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      setStatus(
        data.message ||
          "Your request has been submitted."
      );

      if (response.ok) {
        setForm({
          name: "",
          email: "",
          signupDate: "",
          reason: "",
          confirmation: false,
        });
      }
    } catch (error) {
      console.error(error);

      setStatus(
        "We could not process your request. Please try again later."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">
        Delete Your VOCAGLOB Account
      </h1>

      <p className="mb-6 text-gray-700">
        If you would like to delete your VOCAGLOB account,
        please complete the form below.
      </p>

      <div className="border rounded-lg p-4 mb-6 bg-blue-50">
        <p className="font-semibold mb-2">
          Important
        </p>

        <p className="text-sm text-gray-700">
          Enter the email address associated with your
          VOCAGLOB account. Your account-deletion
          verification email will be sent to that address.
        </p>

        <p className="text-sm text-gray-700 mt-2">
          For your security, VOCAGLOB will not delete an
          account based solely on this form. You must first
          verify access to the account email address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block mb-1 font-medium">
            Full Name
          </label>

          <input
            className="w-full border rounded p-3"
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            VOCAGLOB Account Email
          </label>

          <input
            className="w-full border rounded p-3"
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <p className="text-sm text-gray-600 mt-1">
            This must be the email address associated with
            your VOCAGLOB account. Verification will be sent
            to this address.
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Date you signed up for VOCAGLOB
            <span className="font-normal text-gray-500">
              {" "}
              (required)
            </span>
          </label>

          <input
            className="w-full border rounded p-3"
            type="date"
            required
            value={form.signupDate}
            onChange={(e) =>
              setForm({
                ...form,
                signupDate: e.target.value,
              })
            }
          />  

          <p className="text-sm text-gray-600 mt-1">
  Please enter the date you signed up for VOCAGLOB.
  If you do not remember the exact date, enter your
  best estimate. This information will help us identify
  your account and process your deletion request.
</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Reason for requesting account deletion
            <span className="font-normal text-gray-500">
              {" "}
              (optional)
            </span>
          </label>

          <textarea
            className="w-full border rounded p-3"
            rows={5}
            placeholder="You may tell us why you want to delete your account."
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
          />
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.confirmation}
            onChange={(e) =>
              setForm({
                ...form,
                confirmation: e.target.checked,
              })
            }
          />

          <span className="text-sm">
            I confirm that I want to request deletion of my
            VOCAGLOB account and associated account data.
          </span>
        </label>

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-red-600 text-white px-6 py-3 rounded font-semibold disabled:opacity-50"
        >
          {sending
            ? "Submitting..."
            : "Request Account Deletion"}
        </button>
      </form>

      {status && (
        <div className="mt-6 border rounded p-4 text-center">
          {status}
        </div>
      )}
    </main>
  );
}