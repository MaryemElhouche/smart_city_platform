// Data GraphQL Models

export interface Zone {
  id?: string;
  name: string;
  coordinates?: string;
}

export interface Station {
  id?: string;
  name: string;
  location: string;
}

export interface EmergencyEventSummary {
  id?: string;
  type: string;
  location: string;
  status: string;
}

export interface CityOverview {
  id?: string;
  zone: Zone;
  currentAQI: number;
  trendingPollutants: string[];
  nearestStations: Station[];
  activeIncidents: EmergencyEventSummary[];
}

export interface TravelSuggestions {
  id?: string;
  fromStation: string;
  toStation: string;
  recommendedLine: string;
  airQualityRecommendation: string;
}

export interface IncidentSummary {
  id?: string;
  type: string;
  location: string;
  status: string;
  etaOfUnit?: string;
}

// GraphQL Query/Response types
export interface GraphQLResponse<T> {
  data: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

// Dashboard stats
export interface DataDashboardStats {
  totalZones: number;
  avgAQI: number;
  activeIncidents: number;
  travelRoutes: number;
}
