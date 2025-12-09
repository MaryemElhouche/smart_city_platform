export interface Vehicle {
  id: number;
  registrationNumber: string;
  capacity: number;
  status: string; // ACTIVE, MAINTENANCE, OUT_OF_SERVICE
}

export interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  lineId?: number;
}

export interface TransportLine {
  id: number;
  lineNumber: string;
  type: 'BUS' | 'METRO' | 'TRAM';
}

export interface Transport {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string; // ON_TIME, DELAYED, CANCELLED
  delayMinutes: number;
  availableSeats: number;
  transportLine?: TransportLine;
  vehicle?: Vehicle;
}
