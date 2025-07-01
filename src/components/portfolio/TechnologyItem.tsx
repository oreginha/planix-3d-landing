import React from 'react';

interface TechnologyItemProps {
  name: string;
  category: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
}

const TechnologyItem: React.FC<TechnologyItemProps> = ({ name, category, icon, isDarkMode }) => {
  return (
    <div className="transform hover:scale-110 transition-all duration-300 cursor-pointer group">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-lg font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Prodigy Sans, sans-serif'}}>
        {name}
      </div>
      <div className={`text-sm transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {category}
      </div>
    </div>
  );
};

export default TechnologyItem;