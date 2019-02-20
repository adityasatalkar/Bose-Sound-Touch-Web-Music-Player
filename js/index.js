const playButton = document.getElementById('play-song');
const pauseButton = document.getElementById('pause-song');
const nextSongButton = document.getElementById('next-song');
const prevSongButton = document.getElementById('prev-song');
const bluetoothButton = document.getElementById('bluetooth');
const volUpButton = document.getElementById('vol-up');
const volDownButton = document.getElementById('vol-down');
const volMuteButton = document.getElementById('vol-mute');

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;


var count = 0;

let apis = {
    boseSoundTouch: {
    //get user selected recomendation weather
        api:"http://192.168.1.15",
        port:":8090",
        getUrl: (endpoint) => {
            return apis.boseSoundTouch.api + apis.boseSoundTouch.port + "/" + endpoint
        },
        getVolumeUrlBody: (endpoint, value) => {
            return "<" + endpoint + ">" + value + "</"+endpoint+">"
        },
        getSourceUrlBody:(source, sourceAccount) => {
        	return "<ContentItem source=" + source + " sourceAccount=" + sourceAccount + "></ContentItem>"
        },
        getBluetoothUrlBody:(source) => {
            return "<ContentItem source=" + source + "></ContentItem>"
        },
        getKeyUrlBody:(state, sender, key) => {
        	return "<key state=" + state + " sender=" + sender + ">" + key + "</key>"
        }
    }
};

function getData(endpoint, element1) {
    var doc = ""
    var imagedata = ""
    var titledata = ""
    var artistdata = ""
    var albumdata = ""
    console.log('getData')
    var img = document.getElementById('image');
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", apis.boseSoundTouch.getUrl(endpoint), true);
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            doc = xmlHttpRequest.responseXML;
            console.log(doc)
            imagedata = doc.getElementsByTagName(element1)[0].getElementsByTagName('art')[0].firstChild.nodeValue;
            img.setAttribute("src", imagedata);
            console.log(imagedata)
            titledata = doc.getElementsByTagName(element1)[0].getElementsByTagName('track')[0].firstChild.nodeValue;
            document.getElementById("title").innerHTML = titledata;
            artistdata = doc.getElementsByTagName(element1)[0].getElementsByTagName('artist')[0].firstChild.nodeValue;
            document.getElementById("artist").innerHTML = artistdata;
            albumdata = doc.getElementsByTagName(element1)[0].getElementsByTagName('album')[0].firstChild.nodeValue;
            document.getElementById("album").innerHTML = albumdata;
            // count = volume;
        }
    };
    xmlHttpRequest.send(null);
}

const apiCall = (endpoint, bodyOfRequest) => {
	console.log("Endpoint : " + endpoint + "\n" + "Body of Request : " + bodyOfRequest)
	fetch(apis.boseSoundTouch.getUrl(endpoint), {method: 'post', body: bodyOfRequest})
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => console.log(data))
}

const playSong = () => {
    // <key state="press" sender="Gabbo">PLAY</key>
    console.log('playSong');
    var state = "press"
    var sender = "Gabbo"
    var key = "PLAY"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

const pauseSong = () => {
    // <key state="press" sender="Gabbo">PAUSE</key>
    console.log('pauseSong');
    var state = "press"
    var sender = "Gabbo"
    var key = "PAUSE"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

const nextSong = () => {
    // <key state="press" sender="Gabbo">NEXT_TRACK</key>
    console.log('nextSong');
    var state = "press"
    var sender = "Gabbo"
    var key = "NEXT_TRACK"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

const prevSong = () => {
    // <key state="press" sender="Gabbo">PREV_TRACK</key>
    console.log('prevSong');
    var state = "press"
    var sender = "Gabbo"
    var key = "PREV_TRACK"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

slider.oninput = function() {
	output.innerHTML = this.value;
	var bodyOfRequest =  apis.boseSoundTouch.getVolumeUrlBody('volume', this.value)
	apiCall('volume', bodyOfRequest)
}

window.setInterval(function(){
  /// call your function here
    getData('now_playing','nowPlaying')
}, 5000);

// powerButton.addEventListener('click', power);
playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);

// sourceButton.addEventListener('click', source);
// bluetoothButton.addEventListener('click', bluetooth);