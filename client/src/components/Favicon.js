import React, { useEffect } from 'react';

// Component to update favicon and title dynamically
const Favicon = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Samatva Accounts';
    
    // Create a dynamic favicon
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#2563EB'); // blue-600
    gradient.addColorStop(1, '#3B82F6'); // blue-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Draw 'S' letter
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', 32, 32);
    
    // Convert to favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL("image/x-icon");
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return null; // This component doesn't render anything
};

export default Favicon;