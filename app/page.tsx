'use client';

import React, { useState } from 'react';
import Link from "next/link";

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <main className="font-sans bg-white text-gray-900">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 border-b bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-900">
          Vocaglob
        </h1>

        <div className="space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          <Link
            href="/contact"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 md:py-32 bg-gray-50 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 leading-tight max-w-5xl mx-auto">
          Build Confident Spoken Vocabulary
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          A structured 90-day progression designed to help language learners
          develop lasting vocabulary discipline through daily spoken practice.
        </p>

        <p className="mt-8 font-semibold text-blue-900 text-base md:text-lg">
          Intermediate Level Available Now • Basic Coming Soon • Advanced In Development
        </p>
      </section>

      {/* About Section */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          What is Vocaglob?
        </h2>

        <p className="text-gray-700 text-lg leading-8 text-center">
          Vocaglob is a structured daily vocabulary habit system that helps
          language learners build confident spoken expression through short,
          progressive lessons delivered one day at a time. Each 90-day program
          is designed to be completed within a focused learning window to
          encourage consistent progress and long-term retention.
        </p>
      </section>

      {/* Sample Video Section */}
      <section className="py-20 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Sample Lesson Preview
            </h2>

            <p className="text-gray-700 text-lg leading-8">
              Experience how Vocaglob delivers short, focused vocabulary lessons
              designed for daily consistency. Each lesson is structured to help
              learners gradually improve spoken vocabulary confidence over a
              complete 90-day learning journey.
            </p>

            <p className="mt-6 text-gray-600">
              Watch a short preview of the learning experience inside the app.
            </p>
          </div>

          {/* Video Player */}
          <div className="flex justify-center">
            <div
              className="w-full max-w-[340px] aspect-[9/16] bg-black flex items-center justify-center relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl"
              onClick={() => setShowVideo(true)}
            >
              {!showVideo && (
                <div className="text-white text-lg md:text-xl font-semibold text-center px-4">
                  ▶ Play Sample Video
                </div>
              )}

              {showVideo && (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  <source
                    src="https://videos.vocaglob.com/vocaglob-sample.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-blue-900 max-w-4xl mx-auto leading-tight">
          Get Ready to Start Your 90-Day Vocabulary Journey
        </h2>

        <p className="mt-8 text-gray-700 text-lg max-w-3xl mx-auto leading-8">
          Download Vocaglob on Google Play Store when available and begin a
          structured path toward stronger spoken vocabulary and consistent daily
          language practice.
        </p>

        <button className="mt-10 bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg">
          Coming Soon on Google Play
        </button>
      </section>
{/* Footer */}
<footer className="mt-8 py-8 text-center border-t bg-white">
  <p className="text-gray-600 mb-3">
    © 2026 Vocaglob. All rights reserved.
  </p>

  <div className="flex justify-center gap-6">
    <Link
      href="/contact"
      className="text-gray-700 hover:text-blue-600 underline font-medium"
    >
      Contact
    </Link>

    <Link
      href="/privacy"
      className="text-gray-700 hover:text-blue-600 underline font-medium"
    >
      Privacy Policy
    </Link>

      <Link
        href="/delete-account"
        className="text-gray-700 hover:text-blue-600 underline font-medium"
    >
        Delete Account
    </Link>
  </div>
</footer>
    </main>
  );
}