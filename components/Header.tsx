
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-white shadow-md p-4 flex items-center space-x-3 sticky top-0 z-10">
    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
      BĐH
    </div>
    <div>
      <h1 className="text-xl font-bold text-gray-800">Bạn Đồng Hành cùng Cha mẹ</h1>
      <p className="text-sm text-green-600 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Online
      </p>
    </div>
  </header>
);
