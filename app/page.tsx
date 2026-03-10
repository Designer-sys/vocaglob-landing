'use client';

import React from 'react';
import Link from "next/link";

export default function Home() {
  return (
    <main className="font-sans">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b">
        <h1 className="text-xl font-bold text-blue-900">Vocaglob</h1>

        <div className="space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          <Link
            href="/contact"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-32 bg-gray-50">
        <h1 className="text-5xl font-bold text-blue-900">
          Build Confident Spoken Vocabulary
        </h1>

        <p className="mt-6 text-xl text-gray-700">
          A structured 90-day progression designed to help language learners develop lasting vocabulary discipline.
        </p>

        <p className="mt-6 font-semibold text-blue-900">
          Intermediate Level Available Now • Basic Coming Soon • Advanced In Development
        </p>
      </section>

      {/* About Section */}
      <section className="py-20 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">
          What is Vocaglob?
        </h2>

        <p className="text-gray-700">
          Vocaglob is a structured daily vocabulary habit system that helps language learners build confident spoken expression
          through short, progressive lessons delivered one day at a time. Each 90-day program is designed to be completed within a
          focused learning window to encourage consistent progress.
        </p>
      </section>

      {/* Sample Video Placeholder */}
      <section className="py-20 text-center bg-gray-100">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">
          Sample Lesson Preview
        </h2>

        <div className="w-full max-w-2xl h-80 bg-gray-300 flex items-center justify-center mx-auto text-gray-600">
          Sample video placeholder
        </div>

        <p className="mt-4 text-gray-600">
          Videos will be available once the lessons are uploaded.
        </p>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-blue-900">
          Get Ready to Start Your 90-Day Vocabulary Journey
        </h2>

        <p className="mt-6 text-gray-700">
          Download Vocaglob apps on Google Play Store when available. Stay tuned for new levels and language tracks.
        </p>
      </section>

    </main>
  );
}