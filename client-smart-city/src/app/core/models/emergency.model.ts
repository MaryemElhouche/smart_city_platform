export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
}

export interface EmergencyUnit {
  id: number;
  name: string;
  type: 'AMBULANCE' | 'POLICE' | 'FIRE_TRUCK';
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  location?: Location;
  resourceIds?: number[];
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  quantity: number;
  unitId?: number;
}

export interface EmergencyEvent {
  id: number;
  title: string;
  description: string;
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL
  status: string; // REPORTED, IN_PROGRESS, RESOLVED
  location?: Location;
  assignedUnit?: EmergencyUnit;
}

export interface IncidentLog {
  id: number;
  incidentId: number;
  unitId: number;
  action: string;
  timestamp: string;
  notes: string;
}
