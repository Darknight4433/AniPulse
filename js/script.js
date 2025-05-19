// DOM Elements
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const animeList = document.getElementById('animeList');
const animeDetails = document.getElementById('animeDetails');
const detailContent = document.getElementById('detailContent');
const closeDetails = document.getElementById('closeDetails');

// API Configuration
const API_URL = "https://api.jikan.moe/v4";

// Fetch anime from API
async function fetchAnime(query = "") {
  try {
    animeList.innerHTML = "<div class='loading'><i class='fas fa-spinner fa-spin'></i> Loading...</div>";
    
    const endpoint = query 
      ? `${API_URL}/anime?q=${encodeURIComponent(query)}` 
      : `${API_URL}/top/anime`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    displayAnime(data.data || []);
  } catch (error) {
    animeList.innerHTML = "<div class='error'><i class='fas fa-exclamation-triangle'></i> Failed to load anime</div>";
  }
}

// Display anime list
function displayAnime(animeArray) {
  animeList.innerHTML = animeArray.slice(0, 12).map(anime => `
    <div class="anime-card" data-id="${anime.mal_id}">
      <img src="${anime.images?.jpg?.image_url}" alt="${anime.title}">
      <div class="anime-info">
        <h3>${anime.title}</h3>
        <p>⭐ ${anime.score || 'N/A'}</p>
        <p>Episodes: ${anime.episodes || '?'}</p>
      </div>
    </div>
  `).join("");

  // Add click event to each card
  document.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('click', () => showAnimeDetails(card.dataset.id));
  });
}

// Show anime details
async function showAnimeDetails(animeId) {
  try {
    const response = await fetch(`${API_URL}/anime/${animeId}/full`);
    const { data } = await response.json();
    
    detailContent.innerHTML = `
      <div class="detail-header">
        <img src="${data.images?.jpg?.large_image_url}" alt="${data.title}">
        <div>
          <h2>${data.title}</h2>
          <p>⭐ ${data.score || 'N/A'} | ${data.episodes || '?'} Episodes</p>
          <p>${data.year || ''} • ${data.status || ''}</p>
        </div>
      </div>
      <div class="detail-body">
        <h3>Synopsis</h3>
        <p>${data.synopsis || 'No synopsis available.'}</p>
        <h3>Genres</h3>
        <p>${data.genres?.map(g => g.name).join(', ') || 'Unknown'}</p>
      </div>
    `;
    
    animeDetails.classList.remove('hidden');
  } catch (error) {
    detailContent.innerHTML = "<p>Failed to load details</p>";
  }
}

// Event Listeners
searchBtn.addEventListener('click', () => fetchAnime(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchAnime(searchInput.value.trim());
});
closeDetails.addEventListener('click', () => animeDetails.classList.add('hidden'));

// Initial load
fetchAnime();