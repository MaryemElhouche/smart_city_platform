export const environment = {
  production: false,
  apiGatewayUrl: 'http://localhost:8080/api',
  endpoints: {
    airQuality: '/air-quality',
    mobility: '/mobility',
    dataExplorer: '/graphql',
    emergency: '/emergency'
  },
  wsUrl: 'ws://localhost:8080/ws'
};
