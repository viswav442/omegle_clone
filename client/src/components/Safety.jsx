const Safety = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Safety First
        </h1>

        <div className="space-y-8">
          {/* Guidelines */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Community Guidelines
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 text-blue-500 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Respect Privacy
                  </h3>
                  <p className="text-gray-600">
                    Never share personal information like full name, address,
                    phone number, or financial details.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 text-purple-500 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Report Inappropriate Behavior
                  </h3>
                  <p className="text-gray-600">
                    Use the report button to flag any inappropriate content or
                    behavior immediately.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Features */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Safety Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-600">
                  Quick Disconnect
                </h3>
                <p className="text-gray-600">
                  Instantly end any chat that makes you uncomfortable.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-600">
                  Anonymous Chat
                </h3>
                <p className="text-gray-600">
                  Your personal information is never shared with other users.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-600">
                  Report System
                </h3>
                <p className="text-gray-600">
                  Easy-to-use reporting system for inappropriate behavior.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-600">
                  Moderation
                </h3>
                <p className="text-gray-600">
                  Active moderation to maintain a safe environment.
                </p>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Safety Tips
            </h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Never share personal or financial information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Be respectful to other users</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Report any suspicious behavior</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Trust your instincts - disconnect if uncomfortable</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Safety;
