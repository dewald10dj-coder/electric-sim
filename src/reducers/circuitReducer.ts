import { Component, Wire, SimulationState, ComponentType } from '../types/circuit';

export interface CircuitState {
  components: Component[];
  wires: Wire[];
  selectedComponent: Component | null;
  simulationState: SimulationState;
}

export type CircuitAction =
  | { type: 'ADD_COMPONENT'; payload: { type: ComponentType; x: number; y: number } }
  | { type: 'DELETE_COMPONENT'; payload: { id: string } }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; properties: any } }
  | { type: 'DUPLICATE_COMPONENT'; payload: { id: string } }
  | { type: 'DRAG_COMPONENT'; payload: { id: string; x: number; y: number } }
  | { type: 'SELECT_COMPONENT'; payload: { component: Component | null } }
  | { type: 'ADD_WIRE'; payload: { startComponentId: string; endComponentId: string } }
  | { type: 'TOGGLE_SIMULATION' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'UPDATE_SIMULATION'; payload: { time: number; componentStates: Record<string, any> } };

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const getDefaultProperties = (type: ComponentType) => {
  switch (type) {
    case 'resistor':
      return { name: 'R1', value: '1k', tolerance: '5%', power: '0.25' };
    case 'capacitor':
      return { name: 'C1', value: '10µ', voltage: '50', capacitorType: 'Ceramic' };
    case 'inductor':
      return { name: 'L1', value: '1m', current: '1' };
    case 'dc_source':
      return { name: 'V1', value: 12, current: '1' };
    case 'switch':
      return { name: 'S1', isClosed: false, switchType: 'SPST' };
    default:
      return { name: 'COMP1' };
  }
};

export const circuitReducer = (state: CircuitState, action: CircuitAction): CircuitState => {
  switch (action.type) {
    case 'ADD_COMPONENT': {
      const { type, x, y } = action.payload;
      const id = generateId();
      const newComponent: Component = {
        id,
        type,
        x,
        y,
        properties: getDefaultProperties(type),
      };
      
      return {
        ...state,
        components: [...state.components, newComponent],
        selectedComponent: newComponent,
      };
    }

    case 'DELETE_COMPONENT': {
      const { id } = action.payload;
      return {
        ...state,
        components: state.components.filter(c => c.id !== id),
        wires: state.wires.filter(w => w.startComponentId !== id && w.endComponentId !== id),
        selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
      };
    }

    case 'UPDATE_COMPONENT': {
      const { id, properties } = action.payload;
      return {
        ...state,
        components: state.components.map(c => 
          c.id === id ? { ...c, properties: { ...c.properties, ...properties } } : c
        ),
        selectedComponent: state.selectedComponent?.id === id 
          ? { ...state.selectedComponent, properties: { ...state.selectedComponent.properties, ...properties } }
          : state.selectedComponent,
      };
    }

    case 'DUPLICATE_COMPONENT': {
      const { id } = action.payload;
      const component = state.components.find(c => c.id === id);
      if (!component) return state;
      
      const newId = generateId();
      const duplicatedComponent: Component = {
        ...component,
        id: newId,
        x: component.x + 100,
        y: component.y + 40,
      };
      
      return {
        ...state,
        components: [...state.components, duplicatedComponent],
        selectedComponent: duplicatedComponent,
      };
    }

    case 'DRAG_COMPONENT': {
      const { id, x, y } = action.payload;
      return {
        ...state,
        components: state.components.map(c => 
          c.id === id ? { ...c, x, y } : c
        ),
        selectedComponent: state.selectedComponent?.id === id 
          ? { ...state.selectedComponent, x, y }
          : state.selectedComponent,
      };
    }

    case 'SELECT_COMPONENT': {
      const { component } = action.payload;
      return {
        ...state,
        selectedComponent: component,
      };
    }

    case 'ADD_WIRE': {
      const { startComponentId, endComponentId } = action.payload;
      const startComponent = state.components.find(c => c.id === startComponentId);
      const endComponent = state.components.find(c => c.id === endComponentId);
      
      if (!startComponent || !endComponent) return state;
      
      const newWire: Wire = {
        id: generateId(),
        startX: startComponent.x + 30,
        startY: startComponent.y,
        endX: endComponent.x + 30,
        endY: endComponent.y,
        startComponentId,
        endComponentId,
      };
      
      return {
        ...state,
        wires: [...state.wires, newWire],
      };
    }

    case 'TOGGLE_SIMULATION': {
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          isRunning: !state.simulationState.isRunning,
        },
      };
    }

    case 'RESET_SIMULATION': {
      return {
        ...state,
        simulationState: {
          isRunning: false,
          time: 0,
          componentStates: {},
        },
      };
    }

    case 'UPDATE_SIMULATION': {
      const { time, componentStates } = action.payload;
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          time,
          componentStates,
        },
      };
    }

    default:
      return state;
  }
};