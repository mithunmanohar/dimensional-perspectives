import React, { useState, useEffect, useRef } from 'react';

const DimensionalPerspectives = () => {
  // Set page title
  React.useEffect(() => {
    document.title = "Dimensional Perspectives";
    return () => {
      document.title = "React App"; // Reset title on unmount
    };
  }, []);

  // Add global styles with very strong specificity
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Force horizontal layout always */
      html body .dimensional-perspectives-container .panel-container {
        display: flex !important;
        flex-direction: row !important;
        overflow-x: auto !important;
        width: 100% !important;
        flex-wrap: nowrap !important;
        gap: 1rem !important;
        padding-bottom: 16px !important;
      }
      
      html body .dimensional-perspectives-container .panel {
        flex: 1 0 auto !important; 
        min-width: 300px !important;
        width: 300px !important;
        max-width: 33% !important;
        flex-shrink: 0 !important;
      }
      
      /* Make sure the panels are side by side on all screens */
      @media screen {
        html body .dimensional-perspectives-container .panel-container {
          flex-direction: row !important;
          display: flex !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const [shape, setShape] = useState('sphere');
  const [position, setPosition] = useState(0.5);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const directionRef = useRef(1);
  
  // Handle shape selection
  const handleShapeChange = (newShape) => {
    setShape(newShape);
    setPosition(0.5);
    if (isAnimating) {
      setIsAnimating(false);
    }
  };
  
  // Toggle animation
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };
  
  // Handle slider changes
  const handleSliderChange = (e) => {
    setPosition(parseFloat(e.target.value));
    if (isAnimating) {
      setIsAnimating(false);
    }
  };
  
  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      
      animationRef.current = setInterval(() => {
        setPosition(prevPos => {
          let newPos = prevPos + (directionRef.current * 0.006);
          
          if (newPos >= 0.99) {
            newPos = 0.99;
            directionRef.current = -1;
          } else if (newPos <= 0.01) {
            newPos = 0.01;
            directionRef.current = 1;
          }
          
          return newPos;
        });
      }, 40);
      
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
          animationRef.current = null;
        }
      };
    }
  }, [isAnimating]);
  
  // Calculate cross-section for sphere
  const getSphereParams = () => {
    // For a sphere, cross-section is a circle with radius following sine pattern
    const radius = Math.sin(Math.PI * position);
    return {
      radius: Math.max(0, radius * 70) // Scale for visualization
    };
  };
  
  // Calculate cross-section for cube
  const getCubeParams = () => {
    // For a cube, cross-section is a square that grows/shrinks
    const size = position < 0.5 ? position * 2 : (1 - position) * 2;
    return {
      size: Math.max(0, size * 70) // Scale for visualization
    };
  };
  
  // Calculate cross-section for cone
  const getConeParams = () => {
    // For a cone, cross-section is a circle with changing radius
    const radius = position;
    return {
      radius: Math.max(0, radius * 70) // Scale for visualization
    };
  };
  
  // Calculate cross-section for torus
  const getTorusParams = () => {
    const p = position;
    const distanceFromCenter = Math.abs(p - 0.5);
    
    // Check if we're outside the torus
    if (distanceFromCenter > 0.4) {
      return { visible: false };
    }
    
    // Calculate how far apart the circles should be based on position
    const circleDistance = 80 * (1 - distanceFromCenter / 0.4);
    
    // Calculate how big the circles should be
    const circleRadius = 20;
    
    return {
      distance: circleDistance,
      radius: circleRadius,
      visible: true
    };
  };
  
  // Render the 3D world perspective (Panel 1)
  const renderPlanView = () => {
    return (
      <svg width="100%" height="300" viewBox="0 0 300 300">
        {/* Background */}
        <rect width="300" height="300" fill="#f8fafc" />
        
        {/* Coordinate axes */}
        <line x1={50} y1={150} x2={250} y2={150} stroke="#000000" strokeWidth="2" />
        <line x1={150} y1={50} x2={150} y2={250} stroke="#000000" strokeWidth="2" />
        
        {/* 2D plane intersection */}
        <line 
          x1={50} 
          y1={150} 
          x2={250} 
          y2={150} 
          stroke="#EF4444" 
          strokeWidth="2" 
          strokeDasharray="5,3"
        />
        
        {/* Render specific shape */}
        {shape === 'sphere' && (
          <g transform={`translate(0,${-(position - 0.5) * 100})`}>
            <circle
              cx={150} 
              cy={150}
              r={30}
              fill="#4ADE80"
              fillOpacity="0.7"
              stroke="#166534"
              strokeWidth="2"
            />
          </g>
        )}
        
        {shape === 'cube' && (
          <g transform={`translate(0,${-(position - 0.5) * 100})`}>
            <rect
              x={120}
              y={120}
              width={60}
              height={60}
              fill="#60A5FA"
              fillOpacity="0.7"
              stroke="#1E40AF"
              strokeWidth="2"
            />
          </g>
        )}
        
        {shape === 'cone' && (
          <g transform={`translate(0,${-(position - 0.5) * 100})`}>
            <polygon
              points="150,120 120,180 180,180"
              fill="#A78BFA"
              fillOpacity="0.7"
              stroke="#5B21B6"
              strokeWidth="2"
            />
          </g>
        )}
        
        {shape === 'torus' && (
          <g transform={`translate(0,${-(position - 0.5) * 100})`}>
            <circle
              cx={150} 
              cy={150}
              r={30}
              fill="#F472B6"
              fillOpacity="0.7"
              stroke="#BE185D"
              strokeWidth="2"
            />
            <circle
              cx={150} 
              cy={150}
              r={15}
              fill="#f0f9ff"
              stroke="#BE185D"
              strokeWidth="1"
            />
          </g>
        )}
        
        {/* Labels */}
        <text x="260" y="150" fontSize="12" fill="#6b7280">X</text>
        <text x="150" y="40" fontSize="12" fill="#6b7280">Y</text>
        <text x="10" y="290" fontSize="12" fill="#6b7280">3D object intersecting with 2D plane (red line)</text>
      </svg>
    );
  };
  
  // Render the top-down view (Panel 2)
  const renderTopDownView = () => {
    return (
      <svg width="100%" height="300" viewBox="0 0 300 300">
        {/* Background */}
        <rect width="300" height="300" fill="#f0f9ff" />
        
        {/* Z-axis */}
        <line 
          x1={150} 
          y1={50} 
          x2={150} 
          y2={250} 
          stroke="#3b82f6" 
          strokeWidth="2" 
        />
        
        {/* Object on Z-axis */}
        {shape === 'sphere' && (
          <circle 
            cx={150} 
            cy={150 - (position - 0.5) * 200} 
            r={12} 
            fill="#4ADE80" 
            stroke="#166534"
            strokeWidth="2"
          />
        )}
        
        {shape === 'cube' && (
          <rect
            x={138}
            y={138 - (position - 0.5) * 200}
            width={24}
            height={24}
            fill="#60A5FA"
            stroke="#1E40AF"
            strokeWidth="2"
          />
        )}
        
        {shape === 'cone' && (
          <polygon
            points="150,138 138,162 162,162"
            transform={`translate(0,${- (position - 0.5) * 200})`}
            fill="#A78BFA"
            stroke="#5B21B6"
            strokeWidth="2"
          />
        )}
        
        {shape === 'torus' && (
          <>
            <circle 
              cx={150} 
              cy={150 - (position - 0.5) * 200} 
              r={12} 
              fill="#F472B6" 
              stroke="#BE185D"
              strokeWidth="2"
            />
            <circle 
              cx={150} 
              cy={150 - (position - 0.5) * 200} 
              r={6} 
              fill="#f0f9ff" 
              stroke="#BE185D"
              strokeWidth="1"
            />
          </>
        )}
        
        {/* Label */}
        <text x="10" y="290" fontSize="12" fill="#6b7280">Z-axis (vertical motion)</text>
      </svg>
    );
  };
  
  // Render the 2D creature's view (Panel 3)
  const renderCreatureView = () => {
    // Get the appropriate parameters based on shape
    let params = {};
    
    if (shape === 'sphere') {
      params = getSphereParams();
    } else if (shape === 'cube') {
      params = getCubeParams();
    } else if (shape === 'cone') {
      params = getConeParams();
    } else if (shape === 'torus') {
      params = getTorusParams();
    }
    
    return (
      <svg width="100%" height="300" viewBox="0 0 300 300">
        {/* Background */}
        <rect width="300" height="300" fill="#f0f9ff" />
        
        {/* XY plane */}
        <line x1={50} y1={150} x2={250} y2={150} stroke="#9ca3af" strokeWidth="1" />
        <line x1={150} y1={50} x2={150} y2={250} stroke="#9ca3af" strokeWidth="1" />
        
        {/* Render cross-section for sphere */}
        {shape === 'sphere' && (
          <circle 
            cx={150} 
            cy={150} 
            r={params.radius} 
            fill="#4ADE80" 
            fillOpacity="0.9"
            stroke="#166534"
            strokeWidth="2"
          />
        )}
        
        {/* Render cross-section for cube */}
        {shape === 'cube' && (
          <rect
            x={150 - params.size / 2}
            y={150 - params.size / 2}
            width={params.size}
            height={params.size}
            fill="#60A5FA"
            fillOpacity="0.9"
            stroke="#1E40AF"
            strokeWidth="2"
          />
        )}
        
        {/* Render cross-section for cone */}
        {shape === 'cone' && (
          <circle 
            cx={150} 
            cy={150} 
            r={params.radius} 
            fill="#A78BFA" 
            fillOpacity="0.9"
            stroke="#5B21B6"
            strokeWidth="2"
          />
        )}
        
        {/* Render cross-section for torus */}
        {shape === 'torus' && params.visible && (
          <>
            <circle 
              cx={150 - params.distance / 2} 
              cy={150}
              r={params.radius} 
              fill="#F472B6" 
              fillOpacity="0.9"
              stroke="#BE185D"
              strokeWidth="2"
            />
            <circle 
              cx={150 + params.distance / 2} 
              cy={150} 
              r={params.radius} 
              fill="#F472B6" 
              fillOpacity="0.9"
              stroke="#BE185D"
              strokeWidth="2"
            />
          </>
        )}
        
        {/* Label */}
        <text x="10" y="290" fontSize="12" fill="#6b7280">X/Y plane (Flatland)</text>
      </svg>
    );
  };

  return (
    <div className="dimensional-perspectives-container flex flex-col p-4 bg-white">
      <h1 className="text-2xl font-bold text-center mb-2">Dimensional Perspectives: Visualizing a 3D Object from a 2D World</h1>
      
      <p className="text-center mb-2">
        This visualization shows how a 2D creature would perceive a 3D object intersecting its 2D world. A cross-section is the 2D 
        shape formed where a 3D object intersects a flat plane, like slicing a loaf of bread to see a flat slice. While the 3D 
        object passes through the plane, the creature only sees a 2D cross-section at each moment in time.
      </p>
      
      <p className="text-center mb-4 text-sm text-gray-600 italic">
        To understand this visualization, imagine you are a 2D being living in a flat plane (the XY plane). 
        You can only move left/right and forward/backward, but not up/down. Your entire universe is flat like a sheet of paper.
      </p>
      
      {/* Shape selector buttons */}
      <div className="flex flex-col justify-center items-center gap-2 mb-6">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button 
            onClick={() => handleShapeChange('sphere')}
            className={`px-4 py-2 rounded-full ${shape === 'sphere' ? 
              'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            3D Sphere
          </button>
          <button 
            onClick={() => handleShapeChange('cube')}
            className={`px-4 py-2 rounded-full ${shape === 'cube' ? 
              'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            3D Cube
          </button>
          <button 
            onClick={() => handleShapeChange('cone')}
            className={`px-4 py-2 rounded-full ${shape === 'cone' ? 
              'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            3D Cone
          </button>
          <button 
            onClick={() => handleShapeChange('torus')}
            className={`px-4 py-2 rounded-full ${shape === 'torus' ? 
              'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            3D Torus
          </button>
        </div>
        
        {/* Position slider and animation control */}
        <div className="flex flex-col items-center gap-2 w-full max-w-xl mb-4">
          <p className="text-sm text-gray-600 text-center">
            The position slider controls the height of the 3D object relative to the 2D plane. 
            When position = 0.5, the object is centered on the plane.
          </p>
          
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={toggleAnimation}
              className={`px-4 py-2 rounded-md flex items-center justify-center gap-1 ${isAnimating ? 
                'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 hover:bg-blue-200 border border-blue-300'}`}
            >
              {isAnimating ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Animate</span>
                </>
              )}
            </button>
            
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm font-medium">Position:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={position}
                onChange={handleSliderChange}
                className="w-full"
              />
              <span className="text-xs">{position < 0.5 ? "Below" : position > 0.5 ? "Above" : "At"} plane</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visualization panels - force fixed layout with inline styles to ensure all three panels show properly on GitHub Pages */}
      <div 
        className="panel-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'nowrap', 
          gap: '1rem', 
          overflowX: 'auto',
          width: '100%'
        }}
      >
        {/* Panel 1: 3D World Perspective */}
        <div 
          className="panel" 
          style={{ 
            flex: '1 0 auto', 
            minWidth: '300px', 
            width: '300px', 
            maxWidth: '33%', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
            padding: '1rem', 
            backgroundColor: 'white',
            flexShrink: 0
          }}
        >
          <h2 className="text-lg font-semibold mb-2 text-center">1. 3D World Perspective</h2>
          <p className="text-sm mb-2 text-gray-600">
            3D object passing through a 2D plane (red dashed line)
          </p>
          {renderPlanView()}
          <div className="mt-3 text-xs text-gray-600">
            <p><strong>Explanation:</strong> This view shows what we as 3D beings can see - the entire 3D object 
            and how it intersects with the 2D world (red dashed line). Note that these examples use simplified orientations 
            for clarity, but real-world intersections could be more complex.</p>
          </div>
        </div>
        
        {/* Panel 2: Top-Down View */}
        <div 
          className="panel" 
          style={{ 
            flex: '1 0 auto', 
            minWidth: '300px', 
            width: '300px', 
            maxWidth: '33%', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
            padding: '1rem', 
            backgroundColor: 'white',
            flexShrink: 0
          }}
        >
          <h2 className="text-lg font-semibold mb-2 text-center">2. Top-Down View</h2>
          <p className="text-sm mb-2 text-gray-600">
            Vertical movement along Z-axis
          </p>
          {renderTopDownView()}
          <div className="mt-3 text-xs text-gray-600">
            <p><strong>Explanation:</strong> This view shows the object's position on the Z-axis (height), which 
            is invisible to 2D creatures. Just as 2D creatures struggle to imagine 'up' and 'down,' we struggle to 
            imagine a fourth direction perpendicular to all three of our dimensions.</p>
          </div>
        </div>
        
        {/* Panel 3: 2D Creature's View */}
        <div 
          className="panel" 
          style={{ 
            flex: '1 0 auto', 
            minWidth: '300px', 
            width: '300px', 
            maxWidth: '33%', 
            border: '1px solid #e5e7eb', 
            borderRadius: '0.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
            padding: '1rem', 
            backgroundColor: 'white',
            flexShrink: 0
          }}
        >
          <h2 className="text-lg font-semibold mb-2 text-center">3. 2D Creature's View</h2>
          <p className="text-sm mb-2 text-gray-600">
            Cross-section at intersection point
          </p>
          {renderCreatureView()}
          <div className="mt-3 text-xs text-gray-600">
            <p><strong>Explanation:</strong> This is what a 2D creature actually sees - just a flat slice of the 
            3D object as it passes through their plane. As the 3D object moves, the creature sees these shapes change 
            smoothly, like a movie of growing and shrinking forms.</p>
          </div>
        </div>
      </div>
      
      {/* 4D explanation section */}
      <div className="mt-6 p-4 border rounded-lg shadow-md bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-xl font-bold text-center mb-3">Extending to the 4th Dimension</h2>
        
        <p className="mb-3">
          Just as 2D creatures can only perceive 3D objects as cross-sections, we as 3D beings would experience 4D objects 
          as 3D "slices" if they passed through our space.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-white rounded shadow-sm">
            <h3 className="font-semibold text-purple-800">A 4D Hypersphere</h3>
            <p className="text-sm">Would appear to us first as a tiny sphere that grows to maximum size, then shrinks 
            and disappears.</p>
          </div>
          
          <div className="p-3 bg-white rounded shadow-sm">
            <h3 className="font-semibold text-purple-800">A 4D Hypercube (Tesseract)</h3>
            <p className="text-sm">Would appear as nested cubes that grow and shrink in unintuitive ways, with surfaces 
            that seem to distort.</p>
          </div>
          
          <div className="p-3 bg-white rounded shadow-sm">
            <h3 className="font-semibold text-purple-800">A 4D Being</h3>
            <p className="text-sm">Could seemingly appear/disappear in closed rooms or show internal organs without any 
            incisions - just as we can see the "inside" of a 2D creature.</p>
          </div>
        </div>
      </div>
      
      {/* Source code link - Added as requested */}
      <div className="mt-6 text-center">
        <a 
          href="https://github.com/mithunmanohar/dimensional-perspectives"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source Code on GitHub
        </a>
      </div>
    </div>
  );
};

export default DimensionalPerspectives;