const Tooltip = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-scale-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Connect?</h3>
          <p className="text-gray-600 mb-4">
            Click on "Start Chat" to begin connecting with people worldwide! 🌎
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip; 