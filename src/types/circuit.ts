export type ComponentType = 
  | 'resistor' 
  | 'capacitor' 
  | 'inductor' 
  | 'diode'
  | 'dc_source' 
  | 'ac_source' 
  | 'battery'
  | 'switch' 
  | 'relay' 
  | 'contactor' 
  | 'circuit_breaker'
  | 'voltmeter' 
  | 'ammeter' 
  | 'wattmeter';

export interface ComponentProperties {
  name?: string;
  value?: string | number;
  voltage?: number;
  current?: number;
  power?: number;
  tolerance?: string;
  isClosed?: boolean;
  switchType?: string;
  capacitorType?: string;
  [key: string]: any;
}

export interface Component {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  rotation?: number;
  properties: ComponentProperties;
}

export interface Wire {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startComponentId?: string;
  endComponentId?: string;
  current?: number;
  voltage?: number;
}

export interface ComponentState {
  voltage: number;
  current: number;
  power: number;
  isActive: boolean;
}

export interface SimulationState {
  isRunning: boolean;
  time: number;
  componentStates: Record<string, ComponentState>;
}

export interface CircuitData {
  components: Component[];
  wires: Wire[];
  metadata: {
    name: string;
    description: string;
    created: string;
    modified: string;
    version: string;
  };
}