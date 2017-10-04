
// oAuth token: https://developer.spotify.com/web-api/console/get-search-item/
var token = 'BQDrnS7aej53u3p4VuSScL827Ou78N-hMOwWDJz6wRwOVN4NjTjqoZb0Jl9ZWoY4gG6OOBYQzhzg03rKdvaVX6n53g0F0aUCboKRCuRCoJAwQjsQKtFoZZyxb7YM0B8zRfjKU2za';

var spotifyQuery = '';

var artistName = '';
var albumName = '';
var playingSongId = '';

// var snd;

var backgrounColorArtists = 'plum';
var backgrounColorAlbums = 'gold';
var backgrounColorSongs = '#A9E190';

var messageArtist = '';
var messageAlbums = '';

var $spotifireInput = $('.spotifire-form > .spotifire-input');
var $message = $('.spotifire-form > .message');
var $artistsList = $('.spotifire > .artists > .artists-list');
var $albumsList = $('.spotifire > .albums > .albums-list');
var $songsList = $('.spotifire > .songs > .songs-list');
var $audio = $('#audio');

$spotifireInput.focus();

function requestToSpotify(url, data, callBackFunction) {
  $.ajax({
    dataType: "json",
    url: url,
    data: data,
    headers: { Authorization: 'Bearer ' + token },
    timeout: 2000,
  }).then(callBackFunction)
    .fail(requestErrorHandler);
}

function requestErrorHandler(error) {
  console.error('>> request error: ', error.statusText);
  var message = error.statusText === 'HTTP/2.0 401' ? 'Spotify token has expired' : error.statusText
  $message.html('<span style="color: #BC0213;">' + message + '</span>');
}

// --- ARTISTS
function requestArtistsHandler(json) {
  if (!json.artists) {
    $message.text(spotifireInput.val() + ' is not an artist');
    return null;
  }
  messageArtist = json.artists.total + ' artists found for <strong>' + spotifyQuery +  '</strong>';
  $message.html(messageArtist);

  if (!json.artists.items) {
    $message.html('there\'s no artist that match <strong>' + spotifyQuery + '</strong>');
    return null;
  }

  $artistsList.empty();
  json.artists.items.forEach(artist => {
    var randomBackgroundColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 === #ffffff;
    var artistNoImage = 'https://dummyimage.com/300x300/' + randomBackgroundColor + '/ffffff&text=' + artist.name.split(' ').join('+');
    var imageArtist = (artist.images && artist.images.length > 0) ? artist.images[1].url : artistNoImage;

    var newArtist = $('<li class="artist"><a href="#" data-artist-id="' + artist.id + '" data-artist-name="' + artist.name + '"><img src="' + imageArtist + '"></a></li>');

    $artistsList.append(newArtist);
  });

  $(document.body).css('background-color', backgrounColorArtists);
}

// --- ALBUMS
function requestAlbumsHandler(json) {
  $artistsList.parent().hide();

  $albumsList.empty();

  if (!json.items) {
    $message.html('there\'s no albums for artist <strong>' + artistName + '</strong>');
    return null;
  }
  messageAlbums = json.total + ' albums found for <a href="#" class="retro-artist">artist</a> <strong>' + artistName + '</strong>';
  $message.html(messageAlbums);

  json.items.forEach(album => {
    var randomBackgroundColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 === #ffffff;
    var albumNoImage = 'https://dummyimage.com/300x300/' + randomBackgroundColor + '/ffffff&text=' + album.name.split(' ').join('+');
    var imageAlbum = (album.images && album.images.length > 0) ? album.images[1].url : albumNoImage;

    var newAlbum = $('<li class="album"><a href="#" data-album-id="' + album.id + '" data-album-name="' + album.name + '"><img src="' + imageAlbum + '"></a></li>');

    $albumsList.append(newAlbum);
  });

  $(document.body).css('background-color', backgrounColorAlbums);
  $albumsList.parent().show();
}

// --- SONGS
function requestSongsHandler(json) {
  $albumsList.parent().hide();

  $songsList.empty();

  if (!json.items) {
    $message.html('there\'s no songs for album <strong>' + albumName + '</strong>');
    return null;
  }
  $message.html(json.total + ' songs found in the <a href="#" class="retro-album">album</a> <strong>' + albumName +  '</strong>, from <a href="#" class="retro-artist">artist</a> <strong>' + artistName +  '</strong>');

  json.items.forEach(song => {
    var randomBackgroundColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 === #ffffff;

    var info = '<h3>' + artistName + '</h3><br><h2>' + albumName + '</h2><br><h1>' + song.name + '</h1>';
    if (song.preview_url)
      info += '<i class="fa fa-play fa-2x" aria-hidden="true"></i>';

    var player = '<div class="player" style="background-color: #' + randomBackgroundColor + ';">' + info + '</div>';
    var anchor = player;

    if (song.preview_url)
      anchor = '<a href="#" data-song-url="' + song.preview_url + '" data-song-id="' + song.id + '">' + player + '</a>';

    var newSong = $('<li class="song">' + anchor + '</li>');

    // var audio = '<span>no song file<br><br>:-/</span>';
    // if (song.preview_url)
    //   audio = '<audio controls><source src="' + song.preview_url + '" type="audio/mpeg"></audio>';

    $songsList.append(newSong);
  });

  $(document.body).css('background-color', backgrounColorSongs);
  $songsList.parent().show();
}

// --- ON SUBMIT
$('.spotifire-form').on('submit', function (event) {
  event.preventDefault();

  // if (snd && !snd.paused)
  //   snd.pause();
  if (!$audio.paused)
    $audio.trigger('pause');

  $artistsList.parent().show();
  $albumsList.parent().hide();
  $songsList.parent().hide();

  var url = 'https://api.spotify.com/v1/search/';
  spotifyQuery = $spotifireInput.val();

  if (spotifyQuery) {
    var data = {
      q: spotifyQuery, //encodeURI(spotifyQuery),
      type: 'artist'
    }
    requestToSpotify(url, data, requestArtistsHandler);
  }
  $spotifireInput.val('');
});

// --- ON ARTIST CLICK
$(document).on('click', 'li.artist a', function (event) {
  event.preventDefault();

  artistName = $(this).data('artist-name');
  var artistId = $(this).data('artist-id');

  var url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums';

  requestToSpotify(url, null, requestAlbumsHandler);
})

// --- ON ALBUM CLICK
$(document).on('click', 'li.album a', function (event) {
  event.preventDefault();

  albumName = $(this).data('album-name');
  var albumId = $(this).data('album-id');

  var url = 'https://api.spotify.com/v1/albums/' + albumId + '/tracks';

  requestToSpotify(url, null, requestSongsHandler);
})

// --- ON SONG CLICK
$(document).on('click', 'li.song a', function (event) {
  event.preventDefault();

  // if (snd && !snd.paused) {
  //   snd.pause();
  if (!$audio.paused) {
    $audio.trigger('pause');

    var isPlaying = $songsList.find('.playing');
    isPlaying.removeClass('playing');

    var playerButton = isPlaying.find('.fa')
    playerButton.removeClass('fa-pause');
    playerButton.addClass('fa-play');
  }

  if (playingSongId === $(this).data('song-id')) {
    playingSongId = '';
    return null;
  }

  // delete snd;

  var songUrl = $(this).data('song-url');
  if (songUrl) {
    // snd = new Audio(songUrl);
    // snd.play();
    $audio.attr('src', songUrl);
    $audio.trigger('play');

    var playerDiv = $(this).find('.player');
    playerDiv.addClass('playing');

    var playerButton =  playerDiv.find('.fa');
    playerButton.removeClass('fa-play');
    playerButton.addClass('fa-pause');

    playingSongId = $(this).data('song-id');
  }
});

// --- ON RETRO CLICK
$message.on('click', 'a', function () {
  switch ($(this).attr('class')) {
    case 'retro-artist':
      $(document.body).css('background-color', backgrounColorArtists);
      $message.html(messageArtist);
      $artistsList.parent().show();
      $albumsList.parent().hide();
      $songsList.parent().hide();
      break;
    case 'retro-album':
      $(document.body).css('background-color', backgrounColorAlbums);
      $message.html(messageAlbums);
      $albumsList.parent().show();
      $songsList.parent().hide();
      break;
  }
});

// --- ON AUDIO ENDED
$audio.on('ended', function () {
  var isPlaying = $songsList.find('.playing');
  isPlaying.removeClass('playing');

  var playerButton = isPlaying.find('.fa')
  playerButton.removeClass('fa-pause');
  playerButton.addClass('fa-play');
});
