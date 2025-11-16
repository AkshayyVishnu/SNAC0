# SNACO - Smart Campus Navigation System

A fully integrated, full-stack campus navigation platform is intended to assist students, visitors, and staff in effectively exploring the campus and guiding for directions. It integrates interactive maps, intelligent route planning, the discovery of places categorized for easy search, and real-time weather updates into one seamless experience. SNACO is constructed using a modern technology stack: React for the frontend and UI, Node.js and Express for the backend, MongoDB for data persistence, and Mapbox for high-performance mapping and 2D and 3D map rendering.



## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)



## Features

### Authentication & Authorization
- **User Registration**: Create new and distinct accounts with username and password 
- **User Login**: Secure authentication with password hashing (bcrypt) for added security
- **Role-Based Access Control**: Separate interfaces and features for Admin and Regular Users
- **Session Management**: Persistent login sessions using localStorage

### Interactive Map Features
- **Mapbox Integration**: Full-featured interactive map using Mapbox GL JS
- **Map Navigation**: Pan, zoom, and rotate and other map controls
- **Map Clicking**: Click directly on the map to add map points or collect places
- **Custom Map Styling**: Configurable map center, zoom level, and appearance
- **Real-time Map Updates**: Dynamic route and place visualization

### Route Management
- **Create Routes**: Build custom routes with multiple waypoints
- **Map-Based Route Creation**: Click on the map to add waypoints visually
- **Manual Waypoint Entry**: Enter coordinates manually for precise route planning
- **Edit Routes**: Update route names, descriptions, waypoints, and colors
- **Delete Routes**: Remove unwanted routes with confirmation
- **Route Visualization**: Display routes on the map with custom colors
- **Route Selection**: Click routes to highlight and auto-zoom to view
- **Multiple Waypoints**: Support for unlimited waypoints per route
- **Waypoint Reordering**: Reorder waypoints using up/down buttons
- **Custom Route Colors**: Assign unique colors to differentiate routes

### Place Management
- **Place Creation**: Add new places with name, description, and coordinates
- **Place Categories**: Organize places into 8 categories:
  - 🍽️ Eateries (restaurants, cafes)
  - ⚽ Recreation (stadiums, courts, gyms)
  - 📚 Educational (classrooms, departments)
  - 🏛️ Administration (admin buildings)
  - 🏠 Staff Quarters
  - 🏘️ Hostel (student hostels)
  - 📖 Library
  - 📍 Other
- **Place Filtering**: Filter places by category with visual category buttons
- **Place Search**: Search and select places from autocomplete suggestions
- **Place Details Modal**: View comprehensive place information including:
  - Name and category
  - Description
  - Opening hours (with current status indicator)
  - Contact information (phone, email, website)
  - Current weather information
  - Exact coordinates
- **Place Collection from Map**: Admin can click on map to collect places (bulk collection mode)
- **Bulk Place Import**: Import multiple places at once via JSON
- **Place Editing**: Edit place details, categories, and information (Admin only)
- **Place Deletion**: Remove places from the database (Admin only)

### Navigation Features
- **Route Calculation**: Calculate optimal routes between two points
- **Multiple Navigation Profiles**: Choose from:
  - Driving
  - Walking
  - Cycling
- **Start/End Location Selection**: 
  - Select from existing places
  - Use current location (geolocation)
  - Enter custom coordinates
- **Autocomplete Search**: Smart place search with suggestions
- **Current Location Detection**: Automatic geolocation support
- **Route Visualization**: Display calculated routes on the map
- **Clear Navigation**: Reset navigation routes easily

### Weather Integration
- **Real-time Weather Data**: Display current weather for any location
- **Weather Widget**: Shows:
  - Current temperature (°C)
  - "Feels like" temperature
  - Weather description (cloudy, sunny, etc.)
  - Humidity percentage
  - Wind speed (m/s)
  - Location name
- **Weather in Place Details**: Weather information automatically displayed for each place
- **Weather Refresh**: Manual refresh button to update weather data
- **OpenWeatherMap Integration**: Powered by OpenWeatherMap API

### User Interface
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile
- **Mobile-Optimized**: Touch-friendly interface with mobile menu
- **Sidebar Panel**: Collapsible sidebar for routes and places
- **Modal Dialogs**: User-friendly modals for place details and forms
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Clear error messages and validation feedback
- **Category Icons**: Visual category indicators for easy recognition
- **Color-Coded Routes**: Visual distinction between different routes

### Admin Features
- **Full CRUD Operations**: Create, read, update, and delete routes and places
- **Place Collection Mode**: Special mode to collect places by clicking on the map
- **Bulk Operations**: Import multiple places at once
- **Route Management**: Full control over all routes in the system
- **Place Management**: Complete place database management

### User Features
- **View Routes**: Browse and view all available routes
- **View Places**: Explore places by category
- **Navigation**: Calculate and view routes between locations
- **Place Details**: View detailed information about places
- **Weather Information**: Access weather data for places



## Tech Stack

### Frontend
- **React 19.0.0** - Modern UI library
- **React DOM 19.0.0** - React rendering
- **Mapbox GL JS 3.15.0** - Interactive maps
- **React Map GL 7.1.7** - React wrapper for Mapbox
- **Mapbox GL Directions 4.3.1** - Route directions
- **Mapbox GL Geocoder 5.1.0** - Location search
- **Turf.js 6.5.0** - Geospatial analysis
- **Axios 1.13.1** - HTTP client
- **React Scripts 5.0.1** - Build tooling

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **MongoDB 6.20.0** - Database driver
- **Mongoose 8.0.3** - ODM for MongoDB
- **bcryptjs 3.0.2** - Password hashing
- **express-validator 7.0.1** - Input validation
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variables
- **node-fetch 2.7.0** - HTTP requests

### Development Tools
- **Concurrently 8.2.2** - Run multiple processes
- **Nodemon 3.0.2** - Auto-restart server

### External APIs
- **Mapbox API** - Maps and geocoding
- **OpenWeatherMap API** - Weather data



## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation) OR **MongoDB Atlas** account (cloud)
- **Mapbox Account** - [Sign up](https://www.mapbox.com/) (free tier available)
- **OpenWeatherMap Account** - [Sign up](https://openweathermap.org/api) (free tier available)



## Installation

### Step 1: Clone or Navigate to Project

```bash
cd SNAC0
```

### Step 2: Install Dependencies

Install all dependencies (root, server, and client) with a single command:

```bash
npm run install-all
```

Or install them separately:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```



## Environment Configuration

### Step 1: Create Server Environment File

Create a `.env` file in the `server/` directory:


PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus_navigation
MAPBOX_API_KEY=your_mapbox_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here


### Step 2: Create Client Environment File

Create a `.env` file in the `client/` directory:


REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_api_key_here
REACT_APP_API_URL=http://localhost:5000/api


### Step 3: Get API Keys

#### Mapbox API Key
1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Navigate to your account page
3. Go to "Access Tokens"
4. Copy your default public token or create a new one
5. Add it to both `.env` files (replace `your_mapbox_api_key_here`)

#### OpenWeatherMap API Key
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Go to [API Keys page](https://home.openweathermap.org/api_keys)
3. Copy your API key
4. Add it to `server/.env` (replace `your_openweather_api_key_here`)

**Note:** `.env` files are already in `.gitignore` for security.



## Database Setup

### Option A: Local MongoDB

1. **Install MongoDB** on your machine
   - Windows: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS/Linux
   mongod
   ```

3. **Use Default Connection String**
   The default `MONGODB_URI` in `server/.env` will work:
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus_navigation
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create Free Cluster**
   - Choose **FREE (M0)** tier
   - Select a cloud provider and region
   - Click "Create Deployment"

3. **Create Database User**
   - Username: Choose a username
   - Password: Create a strong password (save this!)
   - Click "Create Database User"

4. **Configure Network Access**
   - Click "Add My Current IP Address" (for development)
   - Or add `0.0.0.0/0` to allow from anywhere (less secure)

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" as driver
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Add database name: `?retryWrites=true&w=majority` → `/campus_navigation?retryWrites=true&w=majority`

6. **Update server/.env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/campus_navigation?retryWrites=true&w=majority
   ```

For detailed MongoDB Atlas setup, see [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)



## How to Use

### Starting the Application

#### Option 1: Run Both Server and Client Together (Recommended)

```bash
npm run dev
```

This starts both the backend server (port 5000) and frontend (port 3000) simultaneously.

#### Option 2: Run Separately

**Terminal 1 - Start Server:**
```bash
npm run server
```

**Terminal 2 - Start Client:**
```bash
npm run client
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000



## User Workflows

### 1. First-Time Setup

1. **Create an Account**
   - Click "Sign Up" on the login page
   - Enter a username (minimum 3 characters)
   - Enter a password (minimum 6 characters)
   - Click "Sign Up"
   - You'll be automatically logged in

2. **Admin Account** (Optional)
   - To create an admin account, you need to manually set `role: 'admin'` in the database
   - Or modify the signup endpoint to allow admin registration

### 2. Regular User Workflow

#### Viewing Routes
1. Routes are displayed in the left sidebar
2. Click on any route to view it on the map
3. The map automatically zooms to show the selected route
4. Routes are color-coded for easy identification

#### Using Navigation
1. Click on the "Navigation" section in the sidebar
2. **Set Start Location:**
   - Type to search for a place, OR
   - Click "📍 Use My Location" to use GPS, OR
   - Click "🖱️ Click Map" and click on the map
3. **Set End Location:** Same options as start location
4. **Choose Profile:** Select driving, walking, or cycling
5. Click "Calculate Route" to see the route on the map
6. Click "Clear" to reset navigation

#### Exploring Places
1. Click on the "Places" section in the sidebar
2. **Filter by Category:** Click category buttons (🍽️ Eateries, ⚽ Recreation, etc.)
3. **View All Places:** Click "📍 All Places" to see everything
4. **View Place Details:** Click on any place to see:
   - Description
   - Opening hours and current status
   - Contact information
   - Weather information
   - Exact coordinates

### 3. Admin Workflow

#### Creating a Route

**Method 1: Map Clicking**
1. Click "New Route" button
2. Enter route name and description (optional)
3. Click "🖱️ Click Map" button
4. Click anywhere on the map to add waypoints
5. Optionally add names to waypoints
6. Choose a color for your route
7. Click "Create Route"

**Method 2: Manual Entry**
1. Click "New Route" button
2. Enter route name and description
3. Click "+ Add Manually"
4. Enter latitude and longitude for each waypoint
5. Reorder waypoints using ↑ ↓ buttons if needed
6. Choose a color
7. Click "Create Route"

#### Editing a Route
1. Find the route in the routes list
2. Click "Edit" button
3. Modify name, description, waypoints, or color
4. Use map clicking or manual entry to add more waypoints
5. Click "Update Route"

#### Deleting a Route
1. Find the route in the routes list
2. Click "Delete" button
3. Confirm deletion

#### Adding Places

**Method 1: Single Place**
1. Click "Places" section
2. Click "Add Place" (if available) or use the form
3. Enter place name, description, category
4. Enter coordinates or click on map
5. Add opening hours and contact info (optional)
6. Click "Save"

**Method 2: Collect from Map (Bulk)**
1. Click "Places" section
2. Click "📍 Collect from Map" button
3. Click on places visible on the map
4. Enter the place name when prompted
5. Repeat for multiple places
6. Click "💾 Save Collected" when done
7. All collected places will be saved to the database

**Method 3: Bulk Import**
1. Prepare a JSON file with place data (see `PLACES_IMPORT_EXAMPLE.json`)
2. Use the bulk import API endpoint (see API documentation)

#### Editing Places
1. Find the place in the places list
2. Click the "✏️" edit button
3. Modify any details (name, category, description, hours, contact)
4. Click "Save"

#### Deleting Places
1. Find the place in the places list
2. Click the delete button (if available)
3. Confirm deletion



## Project Structure

```
SNAC0/
├── client/                          # React frontend application
│   ├── public/                      # Static files
│   │   └── index.html              # HTML template
│   ├── src/                        # Source code
│   │   ├── components/             # React components
│   │   │   ├── AdminPage.js       # Admin dashboard
│   │   │   ├── UserPage.js        # User dashboard
│   │   │   ├── Login.js           # Login component
│   │   │   ├── Signup.js          # Signup component
│   │   │   ├── MapComponent.js    # Main map component
│   │   │   ├── RoutePanel.js      # Route management panel
│   │   │   ├── RouteList.js       # Route list display
│   │   │   ├── RouteForm.js       # Route creation/editing form
│   │   │   ├── NavigationPanel.js # Navigation controls
│   │   │   ├── PlaceCategorizer.js # Place management
│   │   │   ├── PlaceForm.js       # Place creation/editing form
│   │   │   ├── PlaceDetails.js    # Place details modal
│   │   │   └── WeatherWidget.js   # Weather display widget
│   │   ├── App.js                 # Main app component
│   │   ├── App.css                # Global styles
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Base styles
│   ├── package.json               # Frontend dependencies
│   └── .env                       # Frontend environment variables
│
├── server/                         # Node.js/Express backend
│   ├── models/                    # MongoDB schemas
│   │   ├── User.js               # User model
│   │   ├── Route.js              # Route model
│   │   └── Place.js              # Place model
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── routeRoutes.js        # Route CRUD endpoints
│   │   └── placeRoutes.js        # Place CRUD endpoints
│   ├── index.js                  # Server entry point
│   ├── package.json              # Backend dependencies
│   └── .env                      # Backend environment variables
│
├── package.json                   # Root package.json with scripts
├── README.md                      # This file
├── SETUP.md                       # Detailed setup guide
├── MONGODB_ATLAS_SETUP.md        # MongoDB Atlas setup guide
├── WEATHER_API_SETUP.md          # Weather API setup guide
├── EXTRACT_PLACES_FROM_MAP.md    # Place extraction guide
└── PLACES_IMPORT_EXAMPLE.json    # Example place import file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
  - Body: `{ username, password, role? }`
- `POST /api/auth/login` - User login
  - Body: `{ username, password }`

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get a specific route
- `POST /api/routes` - Create a new route
  - Body: `{ name, description?, waypoints[], color? }`
- `PUT /api/routes/:id` - Update a route
- `DELETE /api/routes/:id` - Delete a route

### Places
- `GET /api/places` - Get all places
- `GET /api/places/category/:category` - Get places by category
- `GET /api/places/:id` - Get a specific place
- `POST /api/places` - Create a new place
  - Body: `{ name, description?, category, latitude, longitude, openingHours?, contactInfo? }`
- `PUT /api/places/:id` - Update a place
- `DELETE /api/places/:id` - Delete a place
- `POST /api/places/bulk-import` - Bulk import places
  - Body: `{ places: [{ name, category, latitude, longitude, ... }] }`

### Weather
- `GET /api/weather?lat={latitude}&lng={longitude}` - Get weather data

### Health Check
- `GET /api/health` - Server health check


## Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository
Fork the repository to your GitHub account.

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add: Description of your feature"
```

Use clear commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Refactor:` for code refactoring

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Go to the original repository
- Click "New Pull Request"
- Describe your changes clearly
- Reference any related issues

### Development Guidelines

- **Code Style**: Follow existing code patterns
- **Testing**: Test all new features before submitting
- **Documentation**: Update README if adding new features
- **Environment Variables**: Never commit `.env` files
- **API Keys**: Never commit API keys or secrets


## Troubleshooting

### Common Issues

#### Mapbox Not Loading
**Symptoms:** Map doesn't appear, console shows Mapbox errors

**Solutions:**
- Verify `REACT_APP_MAPBOX_ACCESS_TOKEN` is set in `client/.env`
- Ensure your Mapbox API key is valid and active
- Check Mapbox account for usage limits
- Restart the React development server after changing `.env`
- Clear browser cache and hard refresh (Ctrl+Shift+R)

#### MongoDB Connection Error
**Symptoms:** Server logs show "MongoDB connection error"

**Solutions:**
- **Local MongoDB:**
  - Ensure MongoDB service is running: `mongod` or `net start MongoDB`
  - Verify connection string in `server/.env`: `mongodb://localhost:27017/campus_navigation`
  - Check MongoDB is listening on port 27017
- **MongoDB Atlas:**
  - Verify connection string is correct in `server/.env`
  - Check network access settings (IP whitelist)
  - Ensure username and password are URL-encoded if they contain special characters
  - Verify database name is included in connection string

#### CORS Errors
**Symptoms:** Browser console shows CORS policy errors

**Solutions:**
- Ensure server is running on port 5000
- Verify `REACT_APP_API_URL` in `client/.env` matches server URL
- Check server CORS configuration in `server/index.js`
- Ensure both server and client are running

#### Routes Not Saving
**Symptoms:** Routes don't persist after creation

**Solutions:**
- Check MongoDB connection (look for "MongoDB connected successfully" in server logs)
- Verify server is running and accessible
- Check browser console for API errors
- Verify route data format matches schema requirements

#### Weather Not Loading
**Symptoms:** Weather widget shows error or doesn't display

**Solutions:**
- Verify `OPENWEATHER_API_KEY` is set in `server/.env`
- Check OpenWeatherMap API key is valid
- Verify API key hasn't exceeded free tier limits
- Check server logs for weather API errors
- Ensure coordinates are valid (latitude/longitude)

#### Places Not Appearing on Map
**Symptoms:** Places are in database but not visible on map

**Solutions:**
- Verify places have valid latitude/longitude coordinates
- Check map bounds and zoom level
- Ensure places are marked as `isActive: true`
- Refresh the page to reload places
- Check browser console for errors

#### Authentication Issues
**Symptoms:** Can't login or signup fails

**Solutions:**
- Verify username is at least 3 characters
- Verify password is at least 6 characters
- Check for duplicate usernames (signup)
- Verify MongoDB is connected (users are stored in database)
- Check server logs for authentication errors

#### Port Already in Use
**Symptoms:** Error: "Port 5000 is already in use" or "Port 3000 is already in use"

**Solutions:**
- **Windows:**
  ```bash
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- **macOS/Linux:**
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```
- Or change ports in `.env` files and update accordingly

#### Module Not Found Errors
**Symptoms:** "Cannot find module" errors

**Solutions:**
- Delete `node_modules` folders:
  ```bash
  rm -rf node_modules server/node_modules client/node_modules
  ```
- Delete lock files:
  ```bash
  rm package-lock.json server/package-lock.json client/package-lock.json
  ```
- Reinstall dependencies:
  ```bash
  npm run install-all
  ```

#### Environment Variables Not Loading
**Symptoms:** API keys not working, undefined values

**Solutions:**
- Ensure `.env` files are in correct directories (`server/` and `client/`)
- Verify `.env` file syntax (no spaces around `=`)
- Restart development servers after changing `.env`
- For React, ensure variables start with `REACT_APP_`
- Check for typos in variable names

### Getting Help

If you encounter issues not covered here:

1. **Check Server Logs**: Look at terminal output for error messages
2. **Check Browser Console**: Open DevTools (F12) and check for errors
3. **Verify Configuration**: Double-check all `.env` files
4. **Review Documentation**: Check `SETUP.md` and other guide files
5. **Test API Endpoints**: Use Postman or curl to test backend directly

### Debug Mode

Enable verbose logging:
- Server: Check `server/index.js` for console.log statements
- Client: Check browser DevTools console
- MongoDB: Enable MongoDB logging in connection options


## License

ISC


## Acknowledgments

- **Mapbox** for mapping services
- **OpenWeatherMap** for weather data
- **MongoDB** for database services
- All open-source contributors


**Last Updated:** 2024