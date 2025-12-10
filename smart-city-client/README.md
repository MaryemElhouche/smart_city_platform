# Smart City Mobility Client (Angular)

A modern, intuitive Angular web client for managing the Smart City Mobility services. Built with Angular 17 standalone components and pastel color design.

## Features

- 🚌 **Transport Management**: Create, view, update, and delete transports
- 🛤️ **Line Management**: Manage transport lines with stations and schedules
- 🚏 **Station Management**: Handle station details including location and accessibility
- 🚐 **Vehicle Fleet**: Track and manage the vehicle fleet
- 📊 **Dashboard**: Overview of all mobility data with quick statistics
- 🎨 **Pastel Design**: Modern, eye-friendly interface with pastel color scheme
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- ⚡ **Standalone Components**: Uses Angular 17 standalone components for better performance

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Angular CLI 17+
- Gateway service running on port 8080

## Installation

1. Navigate to the client directory:
```bash
cd smart-city-client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open your browser at `http://localhost:3000`

## Configuration

The client connects to the Gateway service via a proxy configured in `proxy.conf.json`.

### API Authentication

The client uses HTTP Basic Authentication via an Angular interceptor:
- **Username**: admin
- **Password**: admin123

You can modify these credentials in `src/app/interceptors/auth.interceptor.ts`.

## Project Structure

```
smart-city-client/
├── src/
│   ├── app/
│   │   ├── components/          # Shared components
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── modal/
│   │   │   └── toast/
│   │   ├── pages/               # Page components
│   │   │   ├── dashboard/
│   │   │   ├── transports/
│   │   │   ├── lines/
│   │   │   ├── stations/
│   │   │   └── vehicles/
│   │   ├── services/            # API services
│   │   │   ├── mobility.service.ts
│   │   │   └── toast.service.ts
│   │   ├── models/              # TypeScript interfaces
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.scss              # Global styles
│   ├── index.html
│   └── main.ts
├── angular.json                 # Angular CLI config
├── tsconfig.json               # TypeScript config
├── proxy.conf.json             # Dev server proxy
├── package.json
├── Dockerfile
├── nginx.conf
└── README.md
```

## Running with Docker

### Build and run standalone:
```bash
docker build -t smart-city-client .
docker run -p 3000:3000 smart-city-client
```

### Run with docker-compose (all services):
```bash
# From project root
docker-compose -f docker-compose-all.yml up --build
```

## API Endpoints (via Gateway)

The client communicates with these endpoints through the Gateway:

| Resource   | Endpoint                    | Methods                   |
|------------|----------------------------|---------------------------|
| Transports | `/mobility/api/transports` | GET, POST, PUT, DELETE    |
| Lines      | `/mobility/api/lines`      | GET, POST, PUT, DELETE    |
| Stations   | `/mobility/api/stations`   | GET, POST, PUT, DELETE    |
| Vehicles   | `/mobility/api/vehicles`   | GET, POST, PUT, DELETE    |

## Development

### Available Scripts

- `npm start` - Start development server with proxy
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with optimizations
- `npm run watch` - Build and watch for changes

### Adding New Features

1. **New Services**: Create in `src/app/services/`
2. **New Pages**: Create in `src/app/pages/`, add route in `app.routes.ts`
3. **New Components**: Create in `src/app/components/`
4. **New Models**: Add interfaces to `src/app/models/`

## Color Palette

The application uses a carefully selected pastel color palette defined in `styles.scss`:

| Color       | CSS Variable        | Hex     |
|-------------|--------------------|---------| 
| Blue        | `--pastel-blue`    | #A8D8EA |
| Green       | `--pastel-green`   | #A8E6CF |
| Purple      | `--pastel-purple`  | #DCD0FF |
| Pink        | `--pastel-pink`    | #FFD3E0 |
| Yellow      | `--pastel-yellow`  | #FFFACD |
| Coral       | `--pastel-coral`   | #FFB7B2 |
| Mint        | `--pastel-mint`    | #B5EAD7 |

## Technologies Used

- **Angular 17** - Frontend framework with standalone components
- **RxJS** - Reactive programming
- **TypeScript** - Type safety
- **SCSS** - Styling
- **Nginx** - Production server (Docker)
- **Font Awesome** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of the Smart City Platform project.
