const Layout = ({ children }) => {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">🏟️ Community Sports Club</h1>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto p-4">
          {children}
        </main>
      </div>
    );
  };
  
  export default Layout;
  