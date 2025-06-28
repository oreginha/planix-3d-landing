import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Animation data loaded:', data);
        setAnimationData(data);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
        // Fallback: mostrar loading sin animación
        setAnimationData(null);
      });
  }, []);

  if (!animationData) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-[500px] h-[500px] mx-auto mb-6 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Planix</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center">
      <div className="text-center relative">
        <Lottie 
          animationData={animationData}
          className="w-[500px] h-[500px] mx-auto"
          loop={false}
          autoplay={true}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;