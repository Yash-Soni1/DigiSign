import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../Services/authService';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { confirmPassword, ...registerData } = form;
    const res = await register(registerData);

    if (res.message === 'User registered successfully') {
      toast.success('Registered successfully ✅ Logging in...');

      // Attempt auto-login
      try {
        const loginRes = await login({
          email: form.email,
          password: form.password,
        });

        if (loginRes.token) {
          localStorage.setItem("token", loginRes.token);
          toast.success('Logged in! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          toast.error(loginRes.message || 'Login failed after registration.');
        }
      } catch (err) {
        toast.error('Auto-login failed.');
        console.error(err);
      }
    } else {
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Background Image with Gradient */}
      <div
        className="md:w-1/2 w-full relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1655637389009-81207e99c3c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg4fHx8ZW58MHx8fHx8')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center p-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome to DigiSign</h1>
            <p className="text-lg mt-2">Sign documents securely and quickly</p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md shadow-lg p-10 space-y-5">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Create Your Account</h2>

          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Full Name"
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 pl-10 border rounded"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Email"
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 pl-10 border rounded"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 pl-10 pr-10 border rounded"
            />
            <div
              className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              placeholder="Confirm Password"
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full p-3 pl-10 pr-10 border rounded"
            />
            <div
              className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
            Register
          </button>

          <p className="text-sm mt-4 text-center">
            Already have an account?{' '}
            <a href="/" className="text-blue-600 hover:underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}
