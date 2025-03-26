import { useEffect, useState } from 'react';

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
}

export default function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`success-notification ${isVisible ? 'show' : 'hide'}`}>
      <div className="success-icon">✓</div>
      <p>{message}</p>
      <button onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }}>×</button>
    </div>
  );
} 