"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyDeleteAccountContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(
    "Verifying your request..."
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          "/api/delete-account/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccess(true);
        }

        setStatus(
          data.message ||
            "We could not verify your deletion request."
        );
      } catch (error) {
        console.error(error);

        setStatus(
          "We could not verify your request. Please try again later."
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <main className="max-w-xl mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">
        VOCAGLOB Account Deletion
      </h1>

      <div
        className={`border rounded-lg p-6 ${
          success
            ? "bg-green-50"
            : "bg-gray-50"
        }`}
      >
        <p className="text-lg">{status}</p>

        {success && (
          <p className="mt-4">
            VOCAGLOB Support will process your
            request. You do not need to submit
            the form again.
          </p>
        )}
      </div>
    </main>
  );
}