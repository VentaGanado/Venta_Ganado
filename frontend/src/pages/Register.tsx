import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">GanadoBoy</h1>
          <p className="text-gray-600">Únete a nuestra plataforma</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
