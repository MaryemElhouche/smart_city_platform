export interface GraphQLZone {
  id: string;
  name: string;
  coordinates: string;
}

export interface GraphQLStation {
  id: string;
  name: string;
  location: string;
}

export interface IncidentSummary {
  id: string;
  type: string;
  location: string;
  status: string;
}

export interface CityOverview {
  zone: GraphQLZone;
  currentAQI: number;
  trendingPollutants: string[];
  nearestStations: GraphQLStation[];
  activeIncidents: IncidentSummary[];
}

export interface TravelSuggestions {
  fromStation: string;
  toStation: string;
  recommendedLine: string;
  airQualityRecommendation: string;
}

export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}
