# bett-stuff
Scratch Bets app alternate realitty 

# Scratch Bets Vue Application

A modern Vue 3 mobile-first betting application with responsive design for portrait and landscape orientations.

## Features

- 📱 Mobile-first responsive design
- 🔄 Three-tier navigation system
- 💾 State persistence with Pinia
- 🎨 Dynamic theming based on sections
- 👆 Touch gestures support
- 🔐 JWT authentication
- 📊 Real-time bet updates

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Vue Router
- Pinia (State Management)
- Axios (API calls)
- CSS3 with custom properties

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/scratch-bets-vue.git
cd scratch-bets-vue
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your API endpoint

## Development

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Build

Build for production:
\`\`\`bash
npm run build
\`\`\`

Preview production build:
\`\`\`bash
npm run preview
\`\`\`

## Project Structure

- `/src/components` - Reusable Vue components
- `/src/views` - Page components for each route
- `/src/stores` - Pinia state management stores
- `/src/services` - API service modules
- `/src/composables` - Reusable composition functions
- `/src/assets` - Static assets and styles
- `/src/router` - Vue Router configuration
- `/src/utils` - Utility functions and constants

## Navigation Structure

The app features a three-tier navigation system:

1. **Main Sections**: My Stuff, Bet Stuff, League Stuff
2. **Sub-Sections**: Each main section has 3 sub-sections
3. **Filters**: Each sub-section has filterable views

## API Integration

The app connects to a Flask backend with the following endpoints:

- `/login` - User authentication
- `/change_password` - Password management
- `/create_bet` - Create new bets
- `/call_bet` - Call existing bets
- `/update_bet` - Update bet information
- `/bandwagon_bet` - Join existing bets
- `/get_recent_bets` - Fetch recent bet data
- `/get_bet` - Get specific bet details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.
```

## Installation & Setup Instructions

1. **Create the project directory:**
\`\`\`bash
mkdir scratch-bets-vue
cd scratch-bets-vue
\`\`\`

2. **Initialize the project with the files above:**
   - Copy all the file contents into their respective locations
   - Ensure the folder structure matches exactly

3. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

4. **Configure environment:**
\`\`\`bash
cp .env.example .env
# Edit .env with your backend API URL
\`\`\`

5. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

6. **For production build:**
\`\`\`bash
npm run build
\`\`\`

## Key Features Implemented

1. **Complete Vue 3 Architecture** - Using Composition API and script setup syntax
2. **State Management** - Pinia stores for navigation, user, and bets
3. **Routing** - Vue Router with nested routes matching the navigation structure
4. **API Integration** - Axios with interceptors for authentication
5. **Responsive Design** - Portrait/landscape support with adaptive layouts
6. **Touch Gestures** - Swipe support for filter navigation
7. **Component Architecture** - Modular, reusable components
8. **Development Tools** - Vite for fast builds and HMR
9. **Type Safety** - Proper prop validation and emit definitions
10. **Memory System** - Preserves last viewed states and filters