export interface Location {
  id?: number;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface EmergencyEvent {
  id?: number;
  description: string;
  severity: string;
  status: string;
  location?: Location;
  assignedUnitId?: number;
}

export interface EmergencyUnit {
  id?: number;
  name: string;
  type: string;
  status: string;
  location?: Location;
  resourceIds?: number[];
  incidentLogIds?: number[];
}

export interface Resource {
  id?: number;
  name: string;
  type: string;
  status: string;
  assignedUnitId?: number;
  assignedEventId?: number;
}

export interface IncidentLog {
  id?: number;
  message: string;
  timestamp?: string;
  eventId?: number;
  unitId?: number;
  resourceId?: number;
}

export interface EmergencyDashboardStats {
  events: number;
  units: number;
  resources: number;
  logs: number;
  criticalEvents: EmergencyEvent[];
  availableUnits: EmergencyUnit[];
}
