import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/authContext";
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Shield,
  Award,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await API.post("/users/login", {
        email,
        password,
      });

      login(data.token, {
        _id: data._id,
        name: data.name,
        email: data.email,
      });

      // Smooth transition to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 text-blue-500/20 animate-bounce">
        <Shield className="w-16 h-16" />
      </div>
      <div className="absolute bottom-20 right-20 text-yellow-500/20 animate-bounce delay-700">
        <Award className="w-16 h-16" />
      </div>
      <div className="absolute top-40 right-40 text-blue-500/10 animate-pulse">
        <Sparkles className="w-12 h-12" />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl"></div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl p-8 relative overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-yellow-500/10 rounded-3xl"></div>

          {/* Content */}
          <div className="relative">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-linear-to-br from-blue-500 to-yellow-500 rounded-2xl shadow-lg shadow-blue-500/20 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="bg-linear-to-r from-blue-400 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                  Admin Portal
                </span>
              </h1>
              <p className="text-gray-400 mt-2">
                Welcome back! Please login to continue
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-500 text-sm flex-1">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all group-focus-within:border-blue-500"
                    placeholder="admin@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-gray-900 border border-gray-700 rounded focus:ring-blue-500 focus:ring-offset-0 text-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Login to Dashboard</span>
                  </>
                )}
              </button>

              {/* Demo Credentials (Remove in production) */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-500">
                    Demo
                  </span>
                </div>
              </div>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-500 text-sm mt-8">
              Secure admin access only • {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 text-xs text-gray-400 flex items-center gap-2">
          <Shield className="w-3 h-3 text-blue-500" />
          <span>SSL Secured Connection</span>
          <Lock className="w-3 h-3 text-yellow-500" />
        </div>
      </div>

      {/* Add animation keyframes to your global CSS or use a style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
