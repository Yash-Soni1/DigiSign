import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/authService';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);

    if (res.token) {
      localStorage.setItem('token', res.token);
      toast.success('Login successful ✅');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      toast.error(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* left Side: Login Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md shadow-lg p-10 space-y-6">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Sign In</h2>

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 pl-10 border rounded"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 pl-10 pr-10 border rounded"
            />
            <div
              className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Login
          </button>

          <p className="text-sm mt-4 text-center">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>

      {/* right Side: Background image with gradient overlay */}
      <div
        className="md:w-1/2 w-full relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1659284653841-a7c0ad936009?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center p-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome to DigiSign</h1>
            <p className="text-lg mt-2">Secure and fast document signing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
