'use strict';
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const error = document.getElementById('error');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in the DOM
function showData(data) {
  const songData = data.data;
  result.innerHTML = `<ul class="songs">
  ${songData
    .map(
      song => `<li>
    <span><strong>${song.artist.name}</strong> - ${song.title_short}</span>
    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}" >Get Lyrics</button>
    </li>
    `
    )
    .join('')}
  </ul>`;

  if (data.prev || data.next) {
    more.innerHTML = `
    ${
      data.prev
        ? `<button class="btn btn-pagination" onclick="GetMoreSongs('${data.prev}')"><i class="fa-solid fa-chevron-left"></i> Prev</button>`
        : ''
    }
    ${
      data.next
        ? `<button class="btn btn-pagination" onclick="GetMoreSongs('${data.next}')">Next <i class="fa-solid fa-chevron-right"></i></button>`
        : ''
    }

    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs
async function GetMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}
// Get Lyrics
async function GetLyrics(artist, title) {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  const data = await res.json();

  const lyrics =
    data.lyrics === undefined
      ? 'Sorry, but no lyrics were found'
      : data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  result.innerHTML = `
  <h2><strong>${artist}</strong> - ${title}</h2>
  <p>${lyrics}</p>
  `;
  more.innerHTML = '';
}

// Event Listeners
form.addEventListener('submit', e => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (!search.value) {
    error.classList.add('error');
  } else {
    searchSongs(searchTerm);
  }
  search.blur();
});
search.addEventListener('focus', () => {
  search.value = '';
  error.classList.contains('error') ? error.classList.remove('error') : '';
});

// Get Lyrics on button click
result.addEventListener('click', e => {
  const clickedEl = e.target;
  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.dataset.artist;
    const title = clickedEl.dataset.songtitle;
    GetLyrics(artist, title);
  }
});
