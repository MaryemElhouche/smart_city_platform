export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  apiGatewayUrl: 'http://localhost:8080',
  gatewayAuth: {
    username: 'admin',
    password: 'admin123'
  },
  endpoints: {
    airQuality: '/air-quality',
    mobility: '/mobility',
    dataExplorer: '/graphql',
    emergency: '/emergency'
  },
  wsUrl: 'ws://localhost:8080/ws'
};
