import React, { Suspense } from "react";
import ChatRoom from "./components/ChatRoom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import GetStartedModal from "./components/GetStartedModal";
import About from "./components/About";
import Safety from "./components/Safety";
import { useState } from "react";
import Tooltip from "./components/Tooltip";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center min-w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  return (
    <div className="w-full m-0 p-0">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                ChatterVibe
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/safety"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                Safety
              </Link>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => setIsTooltipVisible(true)}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-blue-500 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        <Routes>
          <Route path="/" element={<ChatRoom />} />
          <Route path="/about" element={<About />} />
          <Route path="/safety" element={<Safety />} />
        </Routes>
      </main>

      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Tooltip
        isVisible={isTooltipVisible}
        onClose={() => setIsTooltipVisible(false)}
        message="Click on Start Chat to connect with people globally!"
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 ChatterVibe. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                to="#"
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
