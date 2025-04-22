// src/context/MindMapContext.jsx
import React, { createContext, useContext, useState, useReducer, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Create context
const MindMapContext = createContext();

// Action types
const ACTIONS = {
  SET_NODES: 'SET_NODES',
  SET_LINKS: 'SET_LINKS',
  SET_ACTIVE_NODE: 'SET_ACTIVE_NODE',
  SET_CONTENT_VISIBLE: 'SET_CONTENT_VISIBLE',
  SET_SIMULATION_PAUSED: 'SET_SIMULATION_PAUSED',
  UPDATE_NODE_POSITION: 'UPDATE_NODE_POSITION'
};

// Initial state
const initialState = {
  nodes: [],
  links: [],
  activeNode: null,
  isContentVisible: false,
  simulationPaused: false
};

// Reducer function
function mindMapReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_NODES:
      return { ...state, nodes: action.payload };
    case ACTIONS.SET_LINKS:
      return { ...state, links: action.payload };
    case ACTIONS.SET_ACTIVE_NODE:
      return { ...state, activeNode: action.payload };
    case ACTIONS.SET_CONTENT_VISIBLE:
      return { ...state, isContentVisible: action.payload };
    case ACTIONS.SET_SIMULATION_PAUSED:
      return { ...state, simulationPaused: action.payload };
    case ACTIONS.UPDATE_NODE_POSITION:
      return {
        ...state,
        nodes: state.nodes.map(node => 
          node.id === action.payload.id 
            ? { ...node, x: action.payload.x, y: action.payload.y }
            : node
        )
      };
    default:
      return state;
  }
}

// Provider component
export function MindMapProvider({ children, initialData = {} }) {
  const [state, dispatch] = useReducer(mindMapReducer, initialState);
  const { t } = useTranslation();
  const tooltipRef = useRef(null);
  const svgRef = useRef(null);

  // Process initial data
  useEffect(() => {
    if (initialData && initialData.nodes && initialData.links) {
      try {
        // Create a copy of the nodes with fixed positions
        const nodesList = initialData.nodes.map(node => ({
          ...node,
          x: node.initialX || Math.random() * (window.innerWidth * 0.6) + (window.innerWidth * 0.2),
          y: node.initialY || Math.random() * (window.innerHeight * 0.6) + (window.innerHeight * 0.2)
        }));
        
        dispatch({ type: ACTIONS.SET_NODES, payload: nodesList });
        
        // Process links to make sure they reference the node objects
        const linksList = initialData.links.map(link => {
          const sourceNode = typeof link.source === 'string' 
            ? nodesList.find(n => n.id === link.source) 
            : link.source;
            
          const targetNode = typeof link.target === 'string' 
            ? nodesList.find(n => n.id === link.target) 
            : link.target;
            
          return { 
            ...link, 
            source: sourceNode || link.source, 
            target: targetNode || link.target 
          };
        });
        
        dispatch({ type: ACTIONS.SET_LINKS, payload: linksList });
      } catch (error) {
        console.error("Error processing mind map data:", error);
      }
    }
  }, [initialData]);

  // Calculate which nodes are connected to the active node
  const getConnectedNodeIds = (nodeId) => {
    if (!nodeId || !state.links.length) return [];
    
    return state.links
      .filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === nodeId || targetId === nodeId;
      })
      .map(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === nodeId ? targetId : sourceId;
      });
  };

  // Update node position
  const updateNodePosition = (nodeId, x, y) => {
    dispatch({ 
      type: ACTIONS.UPDATE_NODE_POSITION, 
      payload: { id: nodeId, x, y } 
    });
  };

  // Handle node click
  const handleNodeClick = (nodeId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_NODE, payload: nodeId });
    dispatch({ type: ACTIONS.SET_CONTENT_VISIBLE, payload: true });
    dispatch({ type: ACTIONS.SET_SIMULATION_PAUSED, payload: true });
  };

  // Handle close content panel
  const handleCloseContent = () => {
    dispatch({ type: ACTIONS.SET_CONTENT_VISIBLE, payload: false });
    dispatch({ type: ACTIONS.SET_SIMULATION_PAUSED, payload: false });
  };

  const value = {
    ...state,
    tooltipRef,
    svgRef,
    t,
    getConnectedNodeIds,
    handleNodeClick,
    handleCloseContent,
    updateNodePosition,
    dispatch,
    ACTIONS,
  };

  return (
    <MindMapContext.Provider value={value}>
      {children}
    </MindMapContext.Provider>
  );
}

// Custom hook to use the mind map context
export function useMindMap() {
  const context = useContext(MindMapContext);
  if (context === undefined) {
    throw new Error('useMindMap must be used within a MindMapProvider');
  }
  return context;
}