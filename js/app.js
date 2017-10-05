
// oAuth token: https://developer.spotify.com/web-api/console/get-search-item/
//var token = 'BQDrnS7aej53u3p4VuSScL827Ou78N-hMOwWDJz6wRwOVN4NjTjqoZb0Jl9ZWoY4gG6OOBYQzhzg03rKdvaVX6n53g0F0aUCboKRCuRCoJAwQjsQKtFoZZyxb7YM0B8zRfjKU2za';

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

var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var SpotifireApi = {
  apiKey: '8eb8889dad5d4a4f8fa4ec40e472cb6d',
  apiSecret: 'ac64eda063e247ee933c6e7e298df0b1',
  token: '',
  // -- TOKEN
  // https://developer.spotify.com/web-api/authorization-guide/#client-credentials-flow
  requestToken: function () {
    console.log('-'.repeat(15));
    console.log(this.apiKey, this.apiSecret);
    $.ajax({
      data: { 'grant_type' : 'client_credentials' },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization' : 'Basic ' + btoa(this.apiKey + ':' + this.apiSecret) 
      },
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
    }).then(function (resp) {
      console.log(resp);
    }).fail(this.requestErrorHandler);
  },

  // -- REQUEST
  requestData: function (url, data, callBackFunction) {
    $.ajax({
      dataType: "json",
      data: data,
      headers: { Authorization: 'Bearer ' + this.token },
      url: url,
      timeout: 2000,
    }).then(callBackFunction)
      .fail(this.requestErrorHandler);
  },

  requestErrorHandler: function (error) {
    console.error('>> request error: ', error.statusText);
    var message = error.statusText === 'HTTP/2.0 401' ? 'Spotify token has expired' : error.statusText
    $message.html('<span style="color: #BC0213;">' + message + '</span>');
  }
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
    SpotifireApi.requestData(url, data, requestArtistsHandler);
  }
  $spotifireInput.val('');
});

// --- ON ARTIST CLICK
$(document).on('click', 'li.artist a', function (event) {
  event.preventDefault();

  artistName = $(this).data('artist-name');
  var artistId = $(this).data('artist-id');

  var url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums';

  SpotifireApi.requestData(url, null, requestAlbumsHandler);
})

// --- ON ALBUM CLICK
$(document).on('click', 'li.album a', function (event) {
  event.preventDefault();

  albumName = $(this).data('album-name');
  var albumId = $(this).data('album-id');

  var url = 'https://api.spotify.com/v1/albums/' + albumId + '/tracks';

  SpotifireApi.requestData(url, null, requestSongsHandler);
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

console.log('--- COMO ---', SpotifireApi.token);

if (SpotifireApi.token === '') {
  console.log('--- TOKEN ---');
  SpotifireApi.requestToken();
}