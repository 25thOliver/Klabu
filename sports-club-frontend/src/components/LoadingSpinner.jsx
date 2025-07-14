const LoadingSpinner = ({ 
  size = "md", 
  color = "primary", 
  text = "", 
  className = "" 
}) => {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6", 
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const colorClasses = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    accent: "border-accent-500",
    red: "border-red-500",
    green: "border-green-500",
    blue: "border-blue-500",
    yellow: "border-yellow-500",
    gray: "border-gray-500",
    white: "border-white"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 