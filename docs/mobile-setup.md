# Mobile App Setup and Testing Guide

This guide explains how to set up, run, and test the Vivy Nest Admin mobile application.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Expo CLI** (installed globally)
4. **Android Studio** or **Xcode** for emulator/simulator (optional)
5. **Physical device** with Expo Go app (optional)

## Setup Instructions

### 1. Navigate to the Mobile App Directory

```bash
cd vivy-nest-admin/vivy-mobile
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

If you encounter dependency conflicts, try:

```bash
npm install --legacy-peer-deps
```

### 3. Start the Development Server

```bash
npm start
# or
yarn start
# or
expo start
```

This will start the Metro bundler and display a QR code in the terminal.

## Running the App

### On iOS Simulator

```bash
expo start --ios
```

### On Android Emulator

```bash
expo start --android
```

### On Physical Device

1. Install the **Expo Go** app on your device
2. Ensure your device and computer are on the same network
3. Scan the QR code displayed in the terminal or Expo Dev Tools

## Backend Configuration

The mobile app communicates with the Vivy Nest Admin backend. Make sure the backend is running:

### 1. Start the Backend Server

From the root directory of the project:

```bash
pnpm pm2:dev
```

### 2. Verify Backend is Running

The backend should be accessible at `http://localhost:9200`

You can verify this by running:

```bash
curl http://localhost:9200/auth/login
```

You should receive a response indicating that the captcha has expired (which is expected).

### 3. Update API Configuration (if needed)

Check the API configuration in `vivy-mobile/constants/api.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:9200' // Vivy Nest Admin port
```

**Important for Physical Devices**: When testing on a physical device, you'll need to use your computer's IP address instead of localhost:

```typescript
export const API_BASE_URL = 'http://192.168.1.100:9200' // Replace with your computer's IP
```

To find your computer's IP address:

- **macOS/Linux**: Run `ifconfig` or `ipconfig getifaddr en0`
- **Windows**: Run `ipconfig`

## Testing API Connection

### Automated Test

The app includes a built-in test to verify API connectivity:

1. Navigate to the "Register" screen in the app
2. The app will automatically test the API connection
3. You should see test results indicating successful connection

### Manual Test

You can also manually test the API connection:

1. Open the login screen
2. Enter any username and password
3. Submit the form
4. You should see an error message about the captcha, which indicates successful communication with the backend

## Authentication Flow

The mobile app implements a complete authentication flow:

1. **Login Screen**: Users enter their credentials
2. **API Call**: Credentials are sent to the backend
3. **Token Storage**: JWT token is stored securely
4. **Protected Routes**: Access to main app screens requires authentication
5. **Logout**: Users can securely log out

## Key Features

### 1. Authentication

- Login with username/password
- Token-based authentication using JWT
- Session management
- Protected routes

### 2. API Integration

- REST API communication with backend
- Error handling
- Loading states

### 3. State Management

- React Context for global state
- AsyncStorage for persistent data

### 4. UI Components

- Custom components for consistent UI
- Responsive design
- Loading indicators

## Troubleshooting

### Common Issues

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

4. **iOS simulator not starting**:
   - Ensure Xcode is installed
   - Run `sudo xcode-select -s /Applications/Xcode.app` (adjust path as needed)

5. **Android emulator issues**:
   - Ensure Android Studio is installed
   - Ensure ANDROID_HOME environment variable is set

### Debugging

1. **Check logs**:
   ```bash
   expo start --dev-client
   ```

2. **Enable remote debugging**:
   - Shake the device or press `Cmd+D` (iOS) or `Cmd+M` (Android)
   - Select "Debug" or "Debug Remote JS"

3. **Check network requests**:
   - Use React Native Debugger
   - Use Flipper for advanced debugging

## Development Guidelines

### Adding New Screens

1. Create new files in the `app/` directory
2. Follow the existing navigation pattern
3. Use TypeScript for type safety

### Adding New Components

1. Create reusable components in the `components/` directory
2. Follow the existing component pattern
3. Use TypeScript interfaces for props

### API Integration

1. Add new services in the `services/` directory
2. Follow the existing service pattern
3. Handle errors appropriately

### State Management

1. Use React Context for global state
2. Use component state for local state
3. Use AsyncStorage for persistent data

## Testing

### Manual Testing

1. Test login with valid credentials
2. Test login with invalid credentials
3. Test navigation between screens
4. Test logout functionality
5. Test protected routes

### Automated Testing

The project includes basic unit tests. To run them:

```bash
npm test
# or
yarn test
```

## Deployment

### Building for Production

1. **iOS**:
   ```bash
   expo build:ios
   ```

2. **Android**:
   ```bash
   expo build:android
   ```

### Publishing Over-the-Air Updates

```bash
expo publish
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.