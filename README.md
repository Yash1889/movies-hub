# 🎬 MovieTracker

A modern, responsive web application for tracking and discovering movies. Built with vanilla JavaScript, HTML, and CSS, MovieTracker allows users to search for movies, maintain watchlists, track watched movies with ratings, and discover trending content.

## ✨ Features

- **🎯 Movie Search** - Real-time search functionality with instant results
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🌙 Dark Theme** - Modern dark UI with smooth transitions
- **📋 Watchlist Management** - Add and remove movies to your personal watchlist
- **✅ Watched Movies** - Track watched movies with custom star ratings
- **🎭 Movie Details** - Comprehensive movie information including cast, ratings, and descriptions
- **🔥 Trending Movies** - Discover popular and trending movies
- **💾 Local Storage** - Data persists between browser sessions
- **⚡ Fast Performance** - Optimized loading and smooth user experience

## 🚀 Live Demo

Visit the live application: [MovieTracker](https://yash1889.github.io/movies-hub/)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with custom properties and flexbox
- **Vanilla JavaScript** - No frameworks, pure JavaScript for all functionality
- **TMDB API** - Movie data and images from The Movie Database
- **Local Storage** - Client-side data persistence

## 📁 Project Structure

```
movies-hub/
├── index.html          # Home page with hero section
├── movies.html         # Browse all movies
├── watchlist.html      # User's watchlist
├── watched.html        # Watched movies with ratings
├── movie-details.html  # Detailed movie information
├── script.js           # Main JavaScript functionality
├── styles.css          # Responsive CSS styling
├── config.js           # API configuration
└── README.md           # Project documentation
```

## 🏃‍♂️ Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash1889/movies-hub.git
   cd movies-hub
   ```

2. **Start a local server**
   
   **Option 1: Using Python**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Option 2: Using Node.js**
   ```bash
   npx serve .
   ```
   
   **Option 3: Using Live Server (VS Code extension)**
   - Install Live Server extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open your browser**
   Navigate to `http://localhost:8000`

### API Configuration

The application uses The Movie Database (TMDB) API. The API key is already configured in `config.js`:

```javascript
const API_KEY = '79790dd9dbd8d9233e4edeb1af652187';
```

> **Note**: For production use, consider using environment variables to secure your API key.

## 🎯 How to Use

### Home Page
- **Hero Section**: Features a random trending movie with background image
- **Search Bar**: Search for any movie by title
- **Trending Movies**: Browse currently trending movies

### Movies Page
- **Browse Movies**: View all available movies with pagination
- **Filter Options**: Sort by popularity, rating, or release date
- **Quick Actions**: Add movies to watchlist directly from the grid

### Watchlist
- **Manage Movies**: Add/remove movies you want to watch later
- **Persistent Storage**: Your watchlist is saved locally
- **Quick Access**: Easy navigation to movie details

### Watched Movies
- **Track Progress**: Mark movies as watched
- **Rate Movies**: Give star ratings (1-5 stars)
- **View History**: See all your watched movies with ratings

### Movie Details
- **Comprehensive Info**: Cast, crew, ratings, reviews, and more
- **High-Quality Images**: Movie posters and backdrop images
- **Interactive Elements**: Add to watchlist, mark as watched, rate

## 🔧 Customization

### Styling
The application uses a custom CSS framework with utility classes. Main styling is in `styles.css`:

- **Color Scheme**: Dark theme with accent colors
- **Typography**: Modern font stack with responsive sizing
- **Layout**: Flexbox-based responsive grid system
- **Animations**: Smooth transitions and hover effects

### Functionality
All JavaScript functionality is in `script.js`:

- **API Integration**: TMDB API calls and data processing
- **Local Storage**: Watchlist and watched movies management
- **Search**: Real-time movie search functionality
- **UI Interactions**: Mobile menu, search results, ratings

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **The Movie Database (TMDB)** for providing the movie data API
- **Movie posters and images** from TMDB
- **Icons and UI elements** for enhanced user experience

## 📞 Support

If you have any questions or need help with the application, please:

1. Check the [Issues](https://github.com/Yash1889/movies-hub/issues) page
2. Create a new issue with detailed description
3. Contact the maintainer

---

**Made with ❤️ by Yash Raj**