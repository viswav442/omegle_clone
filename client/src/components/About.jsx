const About = () => {
  console.log("About");
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          About ChatterVibe
        </h1>

        <div className="space-y-12">
          {/* Mission Section */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ChatterVibe is designed to bring people together from all corners
              of the world through seamless video chat connections. We believe
              in creating meaningful conversations and building bridges across
              cultures.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-600">
                  Real-Time Video Chat
                </h3>
                <p className="text-gray-600">
                  Connect face-to-face with people worldwide instantly.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-600">
                  Text Messaging
                </h3>
                <p className="text-gray-600">
                  Exchange messages while video chatting for better
                  communication.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-600">
                  Random Matching
                </h3>
                <p className="text-gray-600">
                  Meet new people randomly and expand your social circle.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-600">
                  Global Reach
                </h3>
                <p className="text-gray-600">
                  Connect with users from different countries and cultures.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Click "Start Chat"
                  </h3>
                  <p className="text-gray-600">
                    Allow camera and microphone access when prompted.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Wait for Match
                  </h3>
                  <p className="text-gray-600">
                    Our system will connect you with a random user.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Start Chatting
                  </h3>
                  <p className="text-gray-600">
                    Enjoy video and text chat with your new connection.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
