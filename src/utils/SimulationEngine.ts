import { Component, Wire, ComponentState } from '../types/circuit';

export class SimulationEngine {
  private nodeVoltages: Map<string, number> = new Map();
  private branchCurrents: Map<string, number> = new Map();

  simulate(components: Component[], wires: Wire[]): Record<string, ComponentState> {
    const componentStates: Record<string, ComponentState> = {};
    
    // Reset simulation state
    this.nodeVoltages.clear();
    this.branchCurrents.clear();

    // Find voltage sources and set reference nodes
    const voltageSources = components.filter(c => 
      c.type === 'dc_source' || c.type === 'ac_source' || c.type === 'battery'
    );
    
    if (voltageSources.length === 0) {
      // No power sources, all components are off
      components.forEach(component => {
        componentStates[component.id] = {
          voltage: 0,
          current: 0,
          power: 0,
          isActive: false,
        };
      });
      return componentStates;
    }

    // Simple DC analysis for MVP
    this.performDCAnalysis(components, wires, componentStates);
    
    return componentStates;
  }

  private performDCAnalysis(
    components: Component[], 
    wires: Wire[], 
    componentStates: Record<string, ComponentState>
  ): void {
    // Build node-component mapping
    const nodeComponents = new Map<string, Component[]>();
    const componentNodes = new Map<string, string[]>();

    // Create simplified circuit analysis
    components.forEach(component => {
      const nodeA = `${component.id}_A`;
      const nodeB = `${component.id}_B`;
      
      componentNodes.set(component.id, [nodeA, nodeB]);
      
      if (!nodeComponents.has(nodeA)) nodeComponents.set(nodeA, []);
      if (!nodeComponents.has(nodeB)) nodeComponents.set(nodeB, []);
      
      nodeComponents.get(nodeA)!.push(component);
      nodeComponents.get(nodeB)!.push(component);
    });

    // Apply Kirchhoff's laws (simplified)
    components.forEach(component => {
      let voltage = 0;
      let current = 0;
      let isActive = false;

      switch (component.type) {
        case 'dc_source':
        case 'battery':
          voltage = parseFloat(component.properties.value?.toString() || '0');
          current = 0.1; // Assume small load current for demo
          isActive = true;
          this.nodeVoltages.set(`${component.id}_A`, voltage);
          this.nodeVoltages.set(`${component.id}_B`, 0); // Ground reference
          break;

        case 'resistor':
          // Find connected voltage source through circuit analysis
          const connectedSource = this.findConnectedVoltageSource(component, components, wires);
          if (connectedSource) {
            const sourceVoltage = parseFloat(connectedSource.properties.value?.toString() || '0');
            const resistance = this.parseResistanceValue(component.properties.value?.toString() || '1k');
            
            voltage = sourceVoltage;
            current = voltage / resistance;
            isActive = current > 0.001; // Active if current > 1mA
          }
          break;

        case 'switch':
          const isClosed = component.properties.isClosed;
          if (isClosed) {
            const connectedSourceSwitch = this.findConnectedVoltageSource(component, components, wires);
            if (connectedSourceSwitch) {
              voltage = parseFloat(connectedSourceSwitch.properties.value?.toString() || '0');
              current = 1; // Assume 1A through closed switch
              isActive = true;
            }
          }
          break;

        case 'capacitor':
        case 'inductor':
          // Simplified reactive component analysis
          const connectedSourceReactive = this.findConnectedVoltageSource(component, components, wires);
          if (connectedSourceReactive) {
            voltage = parseFloat(connectedSourceReactive.properties.value?.toString() || '0');
            current = 0.01; // Small reactive current
            isActive = voltage > 0;
          }
          break;

        default:
          // Instruments and other components
          const connectedSourceOther = this.findConnectedVoltageSource(component, components, wires);
          if (connectedSourceOther) {
            voltage = parseFloat(connectedSourceOther.properties.value?.toString() || '0');
            current = 0.001; // Minimal measurement current
            isActive = voltage > 0;
          }
      }

      componentStates[component.id] = {
        voltage,
        current,
        power: voltage * current,
        isActive,
      };
    });
  }

  private findConnectedVoltageSource(
    component: Component, 
    components: Component[], 
    wires: Wire[]
  ): Component | null {
    // Simplified connection checking - in a real implementation, 
    // this would use proper graph traversal
    const voltageSources = components.filter(c => 
      c.type === 'dc_source' || c.type === 'ac_source' || c.type === 'battery'
    );
    
    // For demo purposes, assume all components are connected to the first voltage source
    return voltageSources.length > 0 ? voltageSources[0] : null;
  }

  private parseResistanceValue(value: string): number {
    // Parse resistance values like "1k", "470", "2.2M"
    const numericPart = parseFloat(value.replace(/[^\d.]/g, ''));
    const unit = value.replace(/[\d.]/g, '').toLowerCase();
    
    switch (unit) {
      case 'k':
      case 'ko':
        return numericPart * 1000;
      case 'm':
      case 'mo':
        return numericPart * 1000000;
      case 'g':
      case 'go':
        return numericPart * 1000000000;
      default:
        return numericPart || 1000; // Default to 1kΩ
    }
  }
}