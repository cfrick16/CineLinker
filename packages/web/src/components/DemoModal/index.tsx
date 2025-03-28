import { useState } from 'react';
import './DemoModal.css';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to CineLinker!",
      content: "CineLinker is a game where you connect actors and movies through their relationships. Let's learn how to play!",
      image: undefined
    },
    {
      title: "Daily Challenge",
      content: "Each day, you get a new challenge to connect two actors or movies. Your goal is to find a path between them by going actor to movie to actor to movie until both endpoints are connected. You can guess from either side of the chain.",
      image: "/images/demo/the-game.gif"
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="demo-modal-overlay">
      <div className="demo-modal">
        <button className="demo-modal-close" onClick={onClose}>×</button>
        <div className="demo-modal-content">
          <h2>{steps[currentStep].title}</h2>
          {steps[currentStep].image && (<div className="demo-modal-image">
            <img src={steps[currentStep].image} alt={steps[currentStep].title} />
          </div>
          )}
          <p>{steps[currentStep].content}</p>
          <div className="demo-modal-navigation">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <span className="demo-step-indicator">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 