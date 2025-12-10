export interface Transport {
  id?: number;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  status: string;
  delayMinutes?: number;
  availableSeats?: number;
  lineId?: number;
  vehicleId?: number;
  transportLine?: TransportLine;
  vehicle?: Vehicle;
}

export interface TransportLine {
  id?: number;
  lineNumber: string;
  type: string;
  stationIds?: number[];
  stations?: Station[];
}

export interface Station {
  id?: number;
  name: string;
  latitude?: number;
  longitude?: number;
  lineId?: number;
  line?: TransportLine;
}

export interface Vehicle {
  id?: number;
  registrationNumber: string;
  capacity?: number;
  status: string;
}

export interface DashboardStats {
  transports: number;
  lines: number;
  stations: number;
  vehicles: number;
  recentTransports: Transport[];
}
