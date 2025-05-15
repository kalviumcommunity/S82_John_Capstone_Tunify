import React, { useState } from 'react';
import { X, Mail, Lock, ToggleLeft as Google } from 'lucide-react';

function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  // prevent form default submit reload
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle actual sign in/up logic here
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#F8F3D9] dark:bg-[#3B362C] rounded-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#7A745D] rounded-full"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#504B38] dark:text-[#F8F3D9]">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        <button className="w-full flex items-center justify-center gap-2 p-3 border border-[#B9B28A] dark:border-[#7A745D] rounded-lg mb-4 hover:bg-[#EBE5C2] dark:hover:bg-[#7A745D]">
          <Google className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9]" />
          <span className="text-[#504B38] dark:text-[#F8F3D9]">Continue with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#B9B28A] dark:border-[#7A745D]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#F8F3D9] dark:bg-[#3B362C] text-[#504B38] dark:text-[#EBE5C2]">or</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#504B38] dark:text-[#F8F3D9]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B9B28A] dark:text-[#7A745D] w-5 h-5" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-[#B9B28A] dark:border-[#7A745D] rounded-lg bg-[#F8F3D9] dark:bg-[#504B38] text-[#504B38] dark:text-[#F8F3D9]"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#504B38] dark:text-[#F8F3D9]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B9B28A] dark:text-[#7A745D] w-5 h-5" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-[#B9B28A] dark:border-[#7A745D] rounded-lg bg-[#F8F3D9] dark:bg-[#504B38] text-[#504B38] dark:text-[#F8F3D9]"
                placeholder="Enter your password"
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#504B38] dark:bg-[#7A745D] text-[#F8F3D9] rounded-lg hover:bg-[#B9B28A] dark:hover:bg-[#9B9477]"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#504B38] dark:text-[#B9B28A]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#504B38] dark:text-[#EBE5C2] hover:text-[#B9B28A] dark:hover:text-[#9B9477]"
            type="button"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export { AuthModal };
