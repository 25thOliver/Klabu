import { useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate, Link } from "react-router-dom";

// Using Pexels instead of Unsplash for carousel images
const carouselImages = [
  "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Football action
  "https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Basketball game
  "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Soccer match
  "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Tennis player
  "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Volleyball team
  "https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Running race
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % carouselImages.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(form);
      const { token, user } = response.data.data || response.data;
      
      login(user, token);
      success('Welcome back!');
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials. Please try again.";
      error(message);
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="carousel-section">
        <img 
          src={carouselImages[imageIndex]} 
          alt="Sports action" 
          className={`carousel-img transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`} 
        />
        <div className="carousel-overlay">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Kwambo Sports Club
            </h1>
            <p className="text-xl text-accent-500 font-medium">
              Join the movement. Play with passion.
            </p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="login-card">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-800 mb-2">Welcome Back</h2>
            <p className="text-secondary-600">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="form-input"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  disabled={isLoading}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-accent-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-secondary-600">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 text-secondary-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}