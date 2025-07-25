/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, History } from 'lucide-react';
import { FaUsers, FaShieldAlt, FaCopy, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const promoFeatures = [
    {
      icon: <FaUsers className="text-3xl text-green-600" />,
      title: 'Team Collaboration',
      desc: 'Invite collaborators, assign roles, and track signature progress.',
      color: 'green',
    },
    {
      icon: <FaCopy className="text-3xl text-amber-400" />,
      title: 'Bulk Processing',
      desc: 'Sign multiple documents at once with template-based workflows.',
      color: 'amber',
    },
    {
      icon: <FaShieldAlt className="text-3xl text-purple-500" />,
      title: 'Enterprise Security',
      desc: 'Complete audit trails, tamper-proof verification, and legal compliance built-in.',
      color: 'purple',
    },
    {
      icon: <FaFileAlt className="text-3xl text-orange-400" />,
      title: 'Smart Document Management',
      desc: 'Organize and manage all your documents in one secure space.',
      color: 'orange',
    },
  ];

  const colorClasses = {
    green: 'hover:border-green-200 hover:shadow-green-400 text-green-600',
    amber: 'hover:border-amber-200 hover:shadow-amber-400 text-amber-400',
    purple: 'hover:border-purple-200 hover:shadow-purple-400 text-purple-500',
    orange: 'hover:border-orange-200 hover:shadow-orange-400 text-orange-400',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />

      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <span className="text-3xl font-bold text-black">DigiSign</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-[150px]"
        >
          Logout
        </button>
      </header>

      {/* Main Section */}
      <section className="flex flex-col flex-1 p-5 md:flex-row lg:p-0">
        {/* Left: Banner */}
        <div className="flex flex-col items-center justify-center w-full p-10 text-center text-white md:w-1/2 bg-gradient-to-r from-blue-500 to-blue-300">
          <h1 className="mb-4 text-4xl font-bold">Welcome to DigiSign</h1>
          <p className="max-w-md text-lg text-left lg:text-center">
            The most secure platform to upload, sign, and manage your documents online.
            Trusted by professionals, protected with encryption.
          </p>
        </div>

        {/* Right: Action Cards */}
        <main className="flex flex-col justify-center w-full p-8 bg-gray-100 md:w-1/2">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-3xl font-semibold text-center text-emerald-500"
          >
            What would you like to do?
          </motion.h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Upload Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white shadow rounded-xl hover:shadow-lg"
            >
              <div className="flex items-center mb-3 text-blue-600">
                <Upload className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold">Upload Document</h3>
              </div>
              <p className="mb-4 text-gray-600">Upload PDFs to sign or share securely.</p>
              <Link
                to="/upload"
                onClick={() => toast.success('Navigating to Upload')}
                className="bg-blue-600 w-[150px] text-white px-4 py-2 rounded hover:bg-blue-700 block text-center"
              >
                Upload
              </Link>
            </motion.div>

            {/* Audit Trail */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-6 bg-white shadow rounded-xl hover:shadow-lg"
            >
              <div className="flex items-center mb-3 text-purple-600">
                <History className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold">Audit Trail</h3>
              </div>
              <p className="mb-4 text-gray-600">Check signature activity and document history.</p>
              <Link
                to="/audit"
                onClick={() => toast.success('Loading audit trail...')}
                className="bg-purple-600 w-[150px] text-white px-4 py-2 rounded hover:bg-purple-700 block text-center"
              >
                Track
              </Link>
            </motion.div>
          </div>
        </main>
      </section>

      {/* Promo Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white text-[#315BE9] mt-12 p-7"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="mb-4 text-4xl font-bold">
            <span className="text-black">Digital Signatures</span> <br /> Made Simple
          </h2>
          <p className="mb-8 text-lg text-gray-500">
            Upload, sign, and share documents securely with our professional digital signature platform.
          </p>

          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {promoFeatures.map(({ icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                transition={{ delay: 0.1 * i }}
                className={`flex items-start gap-4 border-2 border-gray-200 p-5 rounded-2xl shadow-lg cursor-pointer transition-all ${colorClasses[color]}`}
              >
                {icon}
                <div>
                  <h4 className={`font-semibold text-xl mb-1 ${colorClasses[color].split(' ').find(cls => cls.startsWith('text-'))}`}>
                    {title}
                  </h4>
                  <p className="text-gray-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 text-lg text-center text-gray-500 bg-white">
        © {new Date().getFullYear()} DigiSign. Your documents, your control.
      </footer>
    </div>
  );
};

export default Dashboard;
