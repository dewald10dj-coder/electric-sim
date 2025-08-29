import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Component, Wire, SimulationState, ComponentType } from '../types/circuit';
import { circuitReducer, CircuitState } from '../reducers/circuitReducer';
import { SimulationEngine } from '../utils/SimulationEngine';

interface CircuitContextType extends CircuitState {
  addComponent: (type: ComponentType, x: number, y: number) => void;
  deleteComponent: (id: string) => void;
  updateComponent: (id: string, properties: any) => void;
  duplicateComponent: (id: string) => void;
  dragComponent: (id: string, x: number, y: number) => void;
  selectComponent: (component: Component | null) => void;
  addWire: (startComponentId: string, endComponentId: string) => void;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
}

const CircuitContext = createContext<CircuitContextType | undefined>(undefined);

const initialState: CircuitState = {
  components: [],
  wires: [],
  selectedComponent: null,
  simulationState: {
    isRunning: false,
    time: 0,
    componentStates: {},
  },
};

export const CircuitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(circuitReducer, initialState);
  const simulationEngine = new SimulationEngine();

  useEffect(() => {
    let animationFrame: number;
    
    if (state.simulationState.isRunning) {
      const simulate = () => {
        const newStates = simulationEngine.simulate(state.components, state.wires);
        dispatch({ 
          type: 'UPDATE_SIMULATION', 
          payload: { 
            time: state.simulationState.time + 0.016, // 60fps
            componentStates: newStates 
          } 
        });
        animationFrame = requestAnimationFrame(simulate);
      };
      animationFrame = requestAnimationFrame(simulate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [state.simulationState.isRunning, state.components, state.wires]);

  const addComponent = (type: ComponentType, x: number, y: number) => {
    dispatch({ type: 'ADD_COMPONENT', payload: { type, x, y } });
  };

  const deleteComponent = (id: string) => {
    dispatch({ type: 'DELETE_COMPONENT', payload: { id } });
  };

  const updateComponent = (id: string, properties: any) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { id, properties } });
  };

  const duplicateComponent = (id: string) => {
    dispatch({ type: 'DUPLICATE_COMPONENT', payload: { id } });
  };

  const dragComponent = (id: string, x: number, y: number) => {
    dispatch({ type: 'DRAG_COMPONENT', payload: { id, x, y } });
  };

  const selectComponent = (component: Component | null) => {
    dispatch({ type: 'SELECT_COMPONENT', payload: { component } });
  };

  const addWire = (startComponentId: string, endComponentId: string) => {
    dispatch({ type: 'ADD_WIRE', payload: { startComponentId, endComponentId } });
  };

  const toggleSimulation = () => {
    dispatch({ type: 'TOGGLE_SIMULATION' });
  };

  const resetSimulation = () => {
    dispatch({ type: 'RESET_SIMULATION' });
  };

  const stepSimulation = () => {
    const newStates = simulationEngine.simulate(state.components, state.wires);
    dispatch({ 
      type: 'UPDATE_SIMULATION', 
      payload: { 
        time: state.simulationState.time + 0.1,
        componentStates: newStates 
      } 
    });
  };

  return (
    <CircuitContext.Provider value={{
      ...state,
      addComponent,
      deleteComponent,
      updateComponent,
      duplicateComponent,
      dragComponent,
      selectComponent,
      addWire,
      toggleSimulation,
      resetSimulation,
      stepSimulation,
    }}>
      {children}
    </CircuitContext.Provider>
  );
};

export const useCircuit = (): CircuitContextType => {
  const context = useContext(CircuitContext);
  if (!context) {
    throw new Error('useCircuit must be used within CircuitProvider');
  }
  return context;
};