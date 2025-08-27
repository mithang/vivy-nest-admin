# Vivy Mobile App

This is the mobile application for the Vivy Nest Admin system, built with React Native and Expo.

## Setup Instructions

### Prerequisites
1. Node.js (v18 or higher)
2. npm or yarn
3. Expo CLI (installed globally)
4. Android Studio or Xcode for emulator/simulator
5. Physical device with Expo Go app (optional)

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd vivy-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   # or
   expo start
   ```

2. To run on iOS simulator:
   ```bash
   expo start --ios
   ```

3. To run on Android emulator:
   ```bash
   expo start --android
   ```

4. To run on a physical device:
   - Install the Expo Go app on your device
   - Scan the QR code displayed in the terminal or Expo Dev Tools

### Backend Configuration

The mobile app communicates with the Vivy Nest Admin backend. Make sure the backend is running:

1. Start the backend server:
   ```bash
   # From the root directory
   pnpm pm2:dev
   ```

2. The backend should be accessible at `http://localhost:9200`

3. Update the API configuration in `constants/api.ts` if needed:
   ```typescript
   export const API_BASE_URL = 'http://localhost:9200' // Change if backend runs on different host/port
   ```

   **Note for physical devices**: When testing on a physical device, you'll need to use your computer's IP address instead of localhost:
   ```typescript
   export const API_BASE_URL = 'http://192.168.1.100:9200' // Replace with your computer's IP
   ```

### Testing API Connection

To verify that the mobile app can communicate with the backend:

1. Navigate to the "Register" screen in the app
2. The app will automatically test the API connection
3. You should see test results indicating successful connection

### Authentication

The app includes a complete authentication system:

1. Login screen with username/password authentication
2. Token-based authentication using JWT
3. User session management
4. Protected routes that require authentication

### Folder Structure

```
vivy-mobile/
├── app/                 # App screens and navigation
├── assets/              # Images, fonts, and other assets
├── components/          # Reusable UI components
├── constants/           # Configuration constants
├── context/             # React context providers
├── services/            # API services and utilities
└── README.md            # This file
```

### Key Features Implemented

1. **Authentication Flow**:
   - Login with username/password
   - Logout functionality
   - Session management
   - Protected routes

2. **API Integration**:
   - REST API communication with backend
   - Token-based authentication
   - Error handling

3. **State Management**:
   - React Context for global state
   - AsyncStorage for persistent data

4. **UI Components**:
   - Custom components for consistent UI
   - Responsive design

### Troubleshooting

**Common Issues**:

1. **Cannot connect to backend on physical device**:
   - Ensure your computer and device are on the same network
   - Use your computer's IP address instead of localhost
   - Check firewall settings

2. **Dependencies not installing**:
   - Try using `--legacy-peer-deps` flag:
     ```bash
     npm install --legacy-peer-deps
     ```

3. **Metro bundler issues**:
   - Clear cache and restart:
     ```bash
     expo start -c
     ```

### Development Guidelines

1. **Adding New Screens**:
   - Create new files in the `app/` directory
   - Follow the existing navigation pattern

2. **Adding New Components**:
   - Create reusable components in the `components/` directory
   - Use TypeScript for type safety

3. **API Integration**:
   - Add new services in the `services/` directory
   - Follow the existing service pattern

4. **State Management**:
   - Use React Context for global state
   - Use component state for local state

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### License

This project is licensed under the MIT License.