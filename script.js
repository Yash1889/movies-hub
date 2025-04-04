// API configuration
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const currentYearElements = document.querySelectorAll('#current-year');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFooterYear();
  initSearch();
  
  // Page specific initialization
  const currentPage = getCurrentPage();
  
  if (currentPage === 'index') {
    initHomePage();
  } else if (currentPage === 'movies') {
    initMoviesPage();
  } else if (currentPage === 'watchlist') {
    initWatchlistPage();
  } else if (currentPage === 'watched') {
    initWatchedPage();
  } else if (currentPage === 'movie-details') {
    initMovieDetailsPage();
  }
});

// Get current page
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('movies.html')) {
    return 'movies';
  } else if (path.includes('watchlist.html')) {
    return 'watchlist';
  } else if (path.includes('watched.html')) {
    return 'watched';
  } else if (path.includes('movie-details.html')) {
    return 'movie-details';
  } else {
    return 'index';
  }
}

// Initialize mobile menu
function initMobileMenu() {
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      
      // Update icon
      const icon = menuToggle.querySelector('.menu-icon');
      if (mobileNav.classList.contains('active')) {
        icon.textContent = '✕';
      } else {
        icon.textContent = '☰';
      }
    });
  }
}

// Initialize footer year
function initFooterYear() {
  currentYearElements.forEach(element => {
    if (element) {
      element.textContent = new Date().getFullYear();
    }
  });
}

// Initialize search functionality
function initSearch() {
  if (!searchInput || !searchButton || !searchResults) return;
  
  const handleSearch = async () => {
    const query = searchInput.value.trim();
    
    if (!query) {
      searchResults.classList.remove('active');
      searchResults.innerHTML = '';
      return;
    }
    
    searchResults.innerHTML = '<div class="p-4 text-center">Loading...</div>';
    searchResults.classList.add('active');
    
    try {
      const data = await searchMovies(query);
      
      if (!data || !data.results || data.results.length === 0) {
        searchResults.innerHTML = '<div class="p-4 text-center">No movies found</div>';
        return;
      }
      
      searchResults.innerHTML = '';
      
      data.results.slice(0, 8).forEach(movie => {
        const resultItem = createSearchResultItem(movie);
        if (resultItem) {
          searchResults.appendChild(resultItem);
        }
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      searchResults.innerHTML = '<div class="p-4 text-center">Error searching movies</div>';
    }
  };
  
  searchButton.addEventListener('click', handleSearch);
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      searchResults.classList.add('active');
    }
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchButton.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });
}

// Create search result item
function createSearchResultItem(movie) {
  const item = document.createElement('div');
  item.className = 'search-result-item';
  
  const posterContainer = document.createElement('div');
  posterContainer.className = 'w-10 h-14 relative flex-shrink-0 mr-3';
  
  const poster = document.createElement('img');
  poster.src = getImageUrl(movie.poster_path, 'w92');
  poster.alt = movie.title;
  poster.className = 'search-result-poster';
  
  posterContainer.appendChild(poster);
  
  const infoContainer = document.createElement('div');
  
  const title = document.createElement('p');
  title.className = 'font-medium';
  title.textContent = movie.title;
  
  const year = document.createElement('p');
  year.className = 'text-sm text-muted';
  year.textContent = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown year';
  
  infoContainer.appendChild(title);
  infoContainer.appendChild(year);
  
  item.appendChild(posterContainer);
  item.appendChild(infoContainer);
  
  // Add click event
  item.addEventListener('click', () => {
    window.location.href = `movie-details.html?id=${movie.id}`;
  });
  
  return item;
}

// Initialize home page
async function initHomePage() {
  await loadHeroSection();
  await loadTrendingMovies();
}

// Load hero section with a random trending movie
async function loadHeroSection() {
  try {
    const heroSection = document.getElementById('hero-section');
    const featuredMovie = document.getElementById('featured-movie');
    
    if (!heroSection || !featuredMovie) return;
    
    const data = await getTrendingMovies('day');
    
    if (!data || !data.results || data.results.length === 0) return;
    
    // Get a random movie from the top 5
    const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
    const movie = data.results[randomIndex];
    
    // Set hero background
    heroSection.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('${getImageUrl(movie.backdrop_path, 'original')}')`;
    
    // Set featured movie
    featuredMovie.innerHTML = `
      <p class="text-sm text-gray-200 mb-2">Featured Movie</p>
      <h2 class="text-2xl font-bold mb-4">${movie.title}</h2>
      <button class="button primary" data-movie-id="${movie.id}">
        View Details
      </button>
    `;
    
    // Add event listener
    const viewDetailsBtn = featuredMovie.querySelector('button');
    viewDetailsBtn.addEventListener('click', () => {
      window.location.href = `movie-details.html?id=${movie.id}`;
    });
  } catch (error) {
    console.error('Error loading hero section:', error);
  }
}

// Load trending movies
async function loadTrendingMovies() {
  try {
    const trendingMoviesContainer = document.getElementById('trending-movies');
    
    if (!trendingMoviesContainer) return;
    
    const data = await getTrendingMovies('week');
    
    if (!data || !data.results || data.results.length === 0) {
      trendingMoviesContainer.innerHTML = '<p class="text-center">No trending movies found</p>';
      return;
    }
    
    // Clear skeletons
    trendingMoviesContainer.innerHTML = '';
    
    // Add movie cards
    data.results.slice(0, 6).forEach(movie => {
      const card = createMovieCard(movie);
      if (card) {
        trendingMoviesContainer.appendChild(card);
      }
    });
  } catch (error) {
    console.error('Error loading trending movies:', error);
    const trendingMoviesContainer = document.getElementById('trending-movies');
    if (trendingMoviesContainer) {
      trendingMoviesContainer.innerHTML = '<p class="text-center">Error loading trending movies</p>';
    }
  }
}

// Initialize movies page
let currentPage = 1;
let totalPages = 1;
let isLoading = false;

function initMoviesPage() {
  loadMovies();
  
  // Add event listener to load more button
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      loadMovies();
    });
  }
}

// Load popular movies
async function loadMovies() {
  try {
    if (isLoading) return;
    
    isLoading = true;
    const moviesGrid = document.getElementById('movies-grid');
    const loadMoreBtn = document.getElementById('load-more');
    
    if (!moviesGrid || !loadMoreBtn) return;
    
    // Show loading state
    if (currentPage === 1) {
      moviesGrid.innerHTML = '';
      for (let i = 0; i < 12; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'movie-skeleton';
        moviesGrid.appendChild(skeleton);
      }
    } else {
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.disabled = true;
    }
    
    const data = await getPopularMovies(currentPage);
    
    if (!data || !data.results || data.results.length === 0) {
      moviesGrid.innerHTML = '<p class="text-center">No movies found</p>';
      return;
    }
    
    // Clear skeletons if first page
    if (currentPage === 1) {
      moviesGrid.innerHTML = '';
    }
    
    // Add movie cards
    data.results.forEach(movie => {
      const card = createMovieCard(movie);
      if (card) {
        moviesGrid.appendChild(card);
      }
    });
    
    // Update pagination
    totalPages = data.total_pages || 1;
    
    // Update load more button
    loadMoreBtn.textContent = 'Load More';
    loadMoreBtn.disabled = false;
    
    if (currentPage >= totalPages) {
      document.getElementById('load-more-container').style.display = 'none';
    } else {
      document.getElementById('load-more-container').style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading movies:', error);
    const moviesGrid = document.getElementById('movies-grid');
    if (moviesGrid) {
      moviesGrid.innerHTML = '<p class="text-center">Error loading movies</p>';
    }
  } finally {
    isLoading = false;
  }
}

// Initialize watchlist page
function initWatchlistPage() {
  loadWatchlist();
  
  // Listen for watchlist updates
  window.addEventListener('watchlistUpdated', loadWatchlist);
}

// Load watchlist movies
function loadWatchlist() {
  const watchlistGrid = document.getElementById('watchlist-grid');
  const emptyWatchlist = document.getElementById('empty-watchlist');
  
  if (!watchlistGrid || !emptyWatchlist) return;
  
  const watchlist = getWatchlist();
  
  // Clear grid
  watchlistGrid.innerHTML = '';
  
  if (watchlist.length === 0) {
    watchlistGrid.style.display = 'none';
    emptyWatchlist.style.display = 'block';
    return;
  }
  
  watchlistGrid.style.display = 'grid';
  emptyWatchlist.style.display = 'none';
  
  // Add movie cards
  watchlist.forEach(movie => {
    const card = createMovieCard(movie);
    if (card) {
      watchlistGrid.appendChild(card);
    }
  });
}

// Initialize watched page
function initWatchedPage() {
  loadWatchedMovies();
  
  // Listen for watched list updates
  window.addEventListener('watchedUpdated', loadWatchedMovies);
}

// Load watched movies
function loadWatchedMovies() {
  const watchedGrid = document.getElementById('watched-grid');
  const emptyWatched = document.getElementById('empty-watched');
  
  if (!watchedGrid || !emptyWatched) return;
  
  const watchedMovies = getWatchedMovies();
  
  // Clear grid
  watchedGrid.innerHTML = '';
  
  if (watchedMovies.length === 0) {
    watchedGrid.style.display = 'none';
    emptyWatched.style.display = 'block';
    return;
  }
  
  watchedGrid.style.display = 'grid';
  emptyWatched.style.display = 'none';
  
  // Add movie cards
  watchedMovies.forEach(movie => {
    const card = createWatchedMovieCard(movie);
    if (card) {
      watchedGrid.appendChild(card);
    }
  });
}

// Initialize movie details page
async function initMovieDetailsPage() {
  await loadMovieDetails();
}

// Load movie details
async function loadMovieDetails() {
  try {
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id'));
    
    if (!movieId) {
      window.location.href = 'index.html';
      return;
    }
    
    // Fetch movie details
    const movie = await getMovieDetails(movieId);
    
    if (!movie) {
      document.getElementById('movie-details-skeleton').style.display = 'none';
      document.getElementById('movie-details').innerHTML = `
        <div class="container mx-auto px-4 py-8 text-center">
          <h1 class="text-2xl font-bold mb-4">Movie not found</h1>
          <p>The movie you're looking for doesn't exist or couldn't be loaded.</p>
          <a href="index.html" class="button primary mt-4">Go Home</a>
        </div>
      `;
      return;
    }
    
    // Update document title
    document.title = `${movie.title} - MovieTracker`;
    
    // Hide skeleton and show content
    document.getElementById('movie-details-skeleton').style.display = 'none';
    document.getElementById('movie-details').classList.remove('hidden');
    
    // Set backdrop
    document.getElementById('movie-backdrop').style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('${getImageUrl(movie.backdrop_path, 'original')}')`;
    
    // Set poster
    document.getElementById('movie-poster').src = getImageUrl(movie.poster_path);
    document.getElementById('movie-poster').alt = movie.title;
    
    // Set title
    document.getElementById('movie-title').textContent = movie.title;
    
    // Set rating
    document.getElementById('movie-rating').textContent = `${movie.vote_average.toFixed(1)}/10`;
    
    // Set year
    if (movie.release_date) {
      document.getElementById('movie-year').textContent = getYear(movie.release_date);
    }
    
    // Set runtime
    if (movie.runtime) {
      document.getElementById('movie-runtime').textContent = formatRuntime(movie.runtime);
      document.getElementById('movie-runtime-full').textContent = formatRuntime(movie.runtime);
      document.getElementById('movie-runtime-container').classList.remove('hidden');
    }
    
    // Set genres
    const genresContainer = document.getElementById('movie-genres');
    const genresList = document.getElementById('movie-genres-list');
    
    if (movie.genres && movie.genres.length > 0) {
      genresContainer.innerHTML = '';
      genresList.textContent = movie.genres.map(genre => genre.name).join(', ');
      
      movie.genres.forEach(genre => {
        const genreTag = document.createElement('span');
        genreTag.className = 'px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs';
        genreTag.textContent = genre.name;
        genresContainer.appendChild(genreTag);
      });
    }
    
    // Set overview
    document.getElementById('movie-overview').textContent = movie.overview;
    
    // Set release date
    document.getElementById('movie-release-date').textContent = formatDate(movie.release_date);
    
    // Set director
    const director = movie.credits?.crew.find(person => person.job === 'Director');
    if (director) {
      document.getElementById('movie-director').textContent = director.name;
      document.getElementById('movie-director-container').classList.remove('hidden');
    }
    
    // Set cast
    const castContainer = document.getElementById('movie-cast');
    if (movie.credits?.cast && movie.credits.cast.length > 0) {
      castContainer.innerHTML = '';
      
      movie.credits.cast.slice(0, 8).forEach(person => {
        const castItem = createCastItem(person);
        if (castItem) {
          castContainer.appendChild(castItem);
        }
      });
    }
    
    // Set watchlist button
    const watchlistBtn = document.getElementById('watchlist-btn');
    const inWatchlist = isInWatchlist(movie.id);
    
    if (inWatchlist) {
      watchlistBtn.classList.remove('outline');
      watchlistBtn.classList.add('primary');
      watchlistBtn.innerHTML = '<span class="icon mr-2">✓</span> In Watchlist';
    }
    
    watchlistBtn.addEventListener('click', () => {
      const isNowInWatchlist = isInWatchlist(movie.id);
      
      if (isNowInWatchlist) {
        removeFromWatchlist(movie.id);
        watchlistBtn.classList.add('outline');
        watchlistBtn.classList.remove('primary');
        watchlistBtn.innerHTML = '<span class="icon mr-2">+</span> Add to Watchlist';
        showToast(`${movie.title} removed from watchlist`);
      } else {
        addToWatchlist({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date
        });
        watchlistBtn.classList.remove('outline');
        watchlistBtn.classList.add('primary');
        watchlistBtn.innerHTML = '<span class="icon mr-2">✓</span> In Watchlist';
        showToast(`${movie.title} added to watchlist`);
      }
    });
    
    // Set watched button
    const watchedBtn = document.getElementById('watched-btn');
    const ratingContainer = document.getElementById('rating-container');
    const inWatched = isInWatched(movie.id);
    
    if (inWatched) {
      watchedBtn.classList.remove('outline');
      watchedBtn.classList.add('primary');
      watchedBtn.textContent = 'Watched';
      ratingContainer.classList.remove('hidden');
      
      // Set up star rating
      setupStarRating(movie.id);
    }
    
    watchedBtn.addEventListener('click', () => {
      const isNowInWatched = isInWatched(movie.id);
      
      if (isNowInWatched) {
        removeFromWatched(movie.id);
        watchedBtn.classList.add('outline');
        watchedBtn.classList.remove('primary');
        watchedBtn.textContent = 'Mark as Watched';
        ratingContainer.classList.add('hidden');
        showToast(`${movie.title} removed from watched movies`);
      } else {
        addToWatched({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          rating: 0
        });
        watchedBtn.classList.remove('outline');
        watchedBtn.classList.add('primary');
        watchedBtn.textContent = 'Watched';
        ratingContainer.classList.remove('hidden');
        
        // Set up star rating
        setupStarRating(movie.id);
        
        showToast(`${movie.title} added to watched movies`);
      }
    });
  } catch (error) {
    console.error('Error loading movie details:', error);
    document.getElementById('movie-details-skeleton').style.display = 'none';
    document.getElementById('movie-details').innerHTML = `
      <div class="container mx-auto px-4 py-8 text-center">
        <h1 class="text-2xl font-bold mb-4">Error loading movie</h1>
        <p>There was an error loading the movie details. Please try again later.</p>
        <a href="index.html" class="button primary mt-4">Go Home</a>
      </div>
    `;
  }
}

// Create cast item element
function createCastItem(person) {
  const item = document.createElement('div');
  item.className = 'cast-card';
  
  const photoContainer = document.createElement('div');
  photoContainer.className = 'relative aspect-poster';
  
  const photo = document.createElement('img');
  photo.src = getImageUrl(person.profile_path, 'w185');
  photo.alt = person.name;
  photo.className = 'cast-photo';
  
  photoContainer.appendChild(photo);
  
  const infoContainer = document.createElement('div');
  infoContainer.className = 'p-2';
  
  const name = document.createElement('p');
  name.className = 'font-medium text-sm';
  name.textContent = person.name;
  
  const character = document.createElement('p');
  character.className = 'text-xs text-muted';
  character.textContent = person.character;
  
  infoContainer.appendChild(name);
  infoContainer.appendChild(character);
  
  item.appendChild(photoContainer);
  item.appendChild(infoContainer);
  
  return item;
}

// Set up star rating
function setupStarRating(movieId) {
  const starRating = document.getElementById('star-rating');
  if (!starRating) return;
  
  // Clear existing stars
  starRating.innerHTML = '';
  
  // Get current rating
  const currentRating = getMovieRating(movieId);
  
  // Create stars
  for (let i = 1; i <= 10; i++) {
    const starBtn = document.createElement('button');
    starBtn.type = 'button';
    starBtn.className = i <= currentRating ? 'star-btn active' : 'star-btn';
    starBtn.innerHTML = '★';
    
    // Add event listeners
    starBtn.addEventListener('click', () => {
      updateRating(movieId, i);
      
      // Update UI
      const stars = starRating.querySelectorAll('.star-btn');
      stars.forEach((star, index) => {
        if (index < i) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
      
      showToast(`Rating updated to ${i}/10`);
    });
    
    starRating.appendChild(starBtn);
  }
  
  // Add rating text
  const ratingText = document.createElement('span');
  ratingText.className = 'ml-2 text-sm';
  ratingText.textContent = `${currentRating}/10`;
  starRating.appendChild(ratingText);
}

// Create movie card element
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.dataset.id = movie.id;
  
  const posterContainer = document.createElement('div');
  posterContainer.className = 'relative aspect-poster';
  
  const poster = document.createElement('img');
  poster.src = getImageUrl(movie.poster_path);
  poster.alt = movie.title;
  poster.className = 'movie-poster';
  
  const watchlistBtnContainer = document.createElement('div');
  watchlistBtnContainer.className = 'absolute top-2 right-2';
  
  const watchlistBtn = document.createElement('button');
  watchlistBtn.className = isInWatchlist(movie.id) ? 'icon-button active' : 'icon-button';
  watchlistBtn.innerHTML = isInWatchlist(movie.id) ? '✓' : '+';
  
  watchlistBtnContainer.appendChild(watchlistBtn);
  posterContainer.appendChild(poster);
  posterContainer.appendChild(watchlistBtnContainer);
  
  const infoContainer = document.createElement('div');
  infoContainer.className = 'p-3';
  
  const title = document.createElement('h3');
  title.className = 'font-medium line-clamp-1';
  title.title = movie.title;
  title.textContent = movie.title;
  
  const metaContainer = document.createElement('div');
  metaContainer.className = 'flex justify-between items-center mt-1';
  
  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'flex items-center';
  
  const starIcon = document.createElement('span');
  starIcon.className = 'icon text-yellow mr-1';
  starIcon.textContent = '★';
  
  const rating = document.createElement('span');
  rating.className = 'text-sm';
  rating.textContent = movie.vote_average.toFixed(1);
  
  ratingContainer.appendChild(starIcon);
  ratingContainer.appendChild(rating);
  
  const year = document.createElement('span');
  year.className = 'text-sm text-muted';
  year.textContent = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  
  metaContainer.appendChild(ratingContainer);
  metaContainer.appendChild(year);
  
  infoContainer.appendChild(title);
  infoContainer.appendChild(metaContainer);
  
  card.appendChild(posterContainer);
  card.appendChild(infoContainer);
  
  // Add event listeners
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.icon-button')) {
      window.location.href = `movie-details.html?id=${movie.id}`;
    }
  });
  
  watchlistBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      watchlistBtn.classList.remove('active');
      watchlistBtn.textContent = '+';
      showToast(`${movie.title} removed from watchlist`);
    } else {
      addToWatchlist(movie);
      watchlistBtn.classList.add('active');
      watchlistBtn.textContent = '✓';
      showToast(`${movie.title} added to watchlist`);
    }
  });
  
  return card;
}

// Create watched movie card
function createWatchedMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.dataset.id = movie.id;
  
  const posterContainer = document.createElement('div');
  posterContainer.className = 'relative aspect-poster';
  
  const poster = document.createElement('img');
  poster.src = getImageUrl(movie.poster_path);
  poster.alt = movie.title;
  poster.className = 'movie-poster';
  
  posterContainer.appendChild(poster);
  
  const infoContainer = document.createElement('div');
  infoContainer.className = 'p-3';
  
  const title = document.createElement('h3');
  title.className = 'font-medium line-clamp-1';
  title.title = movie.title;
  title.textContent = movie.title;
  
  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'flex items-center mt-1 mb-2';
  
  const starIcon = document.createElement('span');
  starIcon.className = 'icon text-yellow mr-1';
  starIcon.textContent = '★';
  
  const rating = document.createElement('span');
  rating.className = 'text-sm';
  rating.textContent = `${movie.rating}/10`;
  
  ratingContainer.appendChild(starIcon);
  ratingContainer.appendChild(rating);
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'button outline full-width';
  removeBtn.textContent = 'Remove';
  
  infoContainer.appendChild(title);
  infoContainer.appendChild(ratingContainer);
  infoContainer.appendChild(removeBtn);
  
  card.appendChild(posterContainer);
  card.appendChild(infoContainer);
  
  // Add event listeners
  card.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      window.location.href = `movie-details.html?id=${movie.id}`;
    }
  });
  
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeFromWatched(movie.id);
    showToast(`${movie.title} removed from watched movies`);
    
    // Remove card from DOM
    card.remove();
    
    // Check if watchlist is empty
    const watchedGrid = document.getElementById('watched-grid');
    const emptyWatched = document.getElementById('empty-watched');
    
    if (watchedGrid && emptyWatched && watchedGrid.children.length === 0) {
      watchedGrid.style.display = 'none';
      emptyWatched.style.display = 'block';
    }
  });
  
  return card;
}

// Show toast notification
function showToast(message) {
  // Check if toast container exists, create if not
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '1000';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.backgroundColor = 'var(--card)';
  toast.style.color = 'var(--card-foreground)';
  toast.style.border = '1px solid var(--border)';
  toast.style.borderRadius = 'var(--radius)';
  toast.style.padding = '12px 16px';
  toast.style.marginTop = '8px';
  toast.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'opacity 0.3s, transform 0.3s';
  
  toastContainer.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

// API Functions
async function fetchFromAPI(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from API:', error);
    return null;
  }
}

async function getTrendingMovies(timeWindow = 'week') {
  return fetchFromAPI(`/trending/movie/${timeWindow}`);
}

async function getPopularMovies(page = 1) {
  return fetchFromAPI('/movie/popular', { page });
}

async function getMovieDetails(id) {
  return fetchFromAPI(`/movie/${id}`, { append_to_response: 'credits' });
}

async function searchMovies(query) {
  return fetchFromAPI('/search/movie', { query });
}

function getImageUrl(path, size = 'w500') {
  if (!path) {
    return 'placeholder.jpg';
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

function formatRuntime(minutes) {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getYear(dateString) {
  if (!dateString) return 'Unknown';
  return new Date(dateString).getFullYear().toString();
}

// Storage Functions
function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem('watchlist') || '[]');
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
}

function addToWatchlist(movie) {
  try {
    const watchlist = getWatchlist();
    if (!watchlist.some(m => m.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
}

function removeFromWatchlist(id) {
  try {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.filter(movie => movie.id !== id);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
}

function isInWatchlist(id) {
  const watchlist = getWatchlist();
  return watchlist.some(movie => movie.id === id);
}

function getWatchedMovies() {
  try {
    return JSON.parse(localStorage.getItem('watchedMovies') || '[]');
  } catch (error) {
    console.error('Error getting watched movies:', error);
    return [];
  }
}

function addToWatched(movie) {
  try {
    const watchedMovies = getWatchedMovies();
    if (!watchedMovies.some(m => m.id === movie.id)) {
      // Add rating property if not present
      if (!movie.rating) {
        movie.rating = 0;
      }
      watchedMovies.push(movie);
      localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));

      // Remove from watchlist if present
      if (isInWatchlist(movie.id)) {
        removeFromWatchlist(movie.id);
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('watchedUpdated'));
    }
  } catch (error) {
    console.error('Error adding to watched:', error);
  }
}

function removeFromWatched(id) {
  try {
    const watchedMovies = getWatchedMovies();
    const updatedWatchedMovies = watchedMovies.filter(movie => movie.id !== id);
    localStorage.setItem('watchedMovies', JSON.stringify(updatedWatchedMovies));
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('watchedUpdated'));
  } catch (error) {
    console.error('Error removing from watched:', error);
  }
}

function isInWatched(id) {
  const watchedMovies = getWatchedMovies();
  return watchedMovies.some(movie => movie.id === id);
}

function updateRating(id, rating) {
  try {
    const watchedMovies = getWatchedMovies();
    const movieIndex = watchedMovies.findIndex(movie => movie.id === id);

    if (movieIndex !== -1) {
      watchedMovies[movieIndex].rating = rating;
      localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('watchedUpdated'));
    }
  } catch (error) {
    console.error('Error updating rating:', error);
  }
}

function getMovieRating(id) {
  const watchedMovies = getWatchedMovies();
  const movie = watchedMovies.find(m => m.id === id);
  return movie ? movie.rating : 0;
}