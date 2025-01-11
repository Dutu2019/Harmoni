const BackgroundProvider = ({children}) => {
    return (
      <div className="min-h-screen bg-therapy-dark relative">
        {/* Main background gradient shape */}
        <div className="floating-shape w-full h-full fixed top-0 left-0" style={{ 
          background: 'radial-gradient(circle at center, rgba(26, 27, 30, 0.95) 0%, #1A1B1E 70%)',
          zIndex: 0
        }} />
        
        {/* Rose gold floating shapes */}
        <div className="floating-shape w-96 h-96 animate-float" style={{ 
          top: '10%',
          left: '15%',
          animationDelay: '0s',
          background: 'linear-gradient(135deg, rgba(232, 178, 152, 0.15), rgba(226, 209, 195, 0.08))'
        }} />
        <div className="floating-shape w-72 h-72 animate-float" style={{ 
          top: '60%',
          right: '10%',
          animationDelay: '-7s',
          background: 'linear-gradient(135deg, rgba(226, 209, 195, 0.12), rgba(232, 178, 152, 0.06))'
        }} />
        <div className="floating-shape w-48 h-48 animate-float" style={{ 
          bottom: '15%',
          left: '25%',
          animationDelay: '-14s',
          background: 'linear-gradient(135deg, rgba(232, 178, 152, 0.1), rgba(226, 209, 195, 0.05))'
        }} />
        
        {/* Content container */}
        <div className="relative z-10 container mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
          {children}
        </div>
      </div>
    );
  };
  
  export default BackgroundProvider;