/*
 *  Markov Composer (Web version) (based on version 0.2.4)
 * 
 *  Copyright (C) 2015 - Andrej Budinčević
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* State variables */
var loaded = false;
var playing = false;

/* Asynchronous note generation */
var lastFNote = 0, lastSNote = 0;
var q = new Queue();

/* Maximum number of queued notes, reduces unnecessary ajax requests */
var maxQueue = 10;

/* Sigma.JS instance */
var s;

/* A simple counter, used to keep track of number of notes played */
var cnt = 0;

/* Human readable note names */
var note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/* Status indicator */
var hl;

/* Disables multiple timers on refresh */
var last_timer;

/* Initializer */
$(function() {
 	hl = $("#footer .status .highlight");

 	/* Creating a new instance of sigma.js */
 	hl.html(" Sigma.JS...");

 	s = new sigma({
 		settings: {
 			zoomingRatio: 1, /* a hack to prevent zooming in by mouse */
 			rescaleIgnoreSize: true, /* keep original node sizes when rescaling */
 			autoResize: false, /* prevents graph resizing */
 			enableCamera: false, /* disables drag */
 			prefix: '',
 			bounds: {
 				maxX: $(document).width(),
 				maxY: $(document).height(),
 				minX: 0,
 				minY: 0,
 				sizeMax: 8,
 				weightMax: 1
 			},
 			width: $(document).width(),
 			height: $(document).height()
 		}
 	});

 	s.addRenderer({
 		container: document.querySelector('#main'),
 		type: 'canvas'
 	});

 	setTimeout(function() { hl.html(" MIDI.js..."); }, 100);

 	MIDI.loadPlugin({
 		instrument: "acoustic_grand_piano",
 		onsuccess: function() {
 			randStart();

 			loaded = true;
 			MIDI.setVolume(0, 127); /* Set volume for channel 0 to maximum value */
 		}});

 	/* Events */

 	/* Play/pause */
 	$("#play").click(pause);

 	/* Refresh */
 	$("#refresh").click(randStart);
});

/* Simple util function returning a random integer */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/* Function  that fills the main queue with notes, prevents possible lag */
function fillQueue(fNote, sNote, start) {
	if(q.getLength() < maxQueue) {
		$.ajax({
			type: "GET",
			url: "http://46.101.150.11:4567/chain/" + fNote + "/" + sNote,
			timeout: 501,
			dataType: "json"
		}).done(function(rData) {
			q.enqueue(rData);

			lastFNote = sNote;
			lastSNote = rData.note.id;

			fillQueue(sNote, rData.note.id, false);

			if(start) {
				$("#play").removeClass("fa-play").addClass("fa-pause");
				$("#footer .status").show();
				$("#footer .status").html("Playing note <span class=\"highlight\">none</span>");
				hl = $("#footer .status .highlight");
				play();
			}
		});
	}
}

/* Pauses playback */
function pause() {
	playing = !playing;

	if(!playing) 
		$("#play").removeClass("fa-pause").addClass("fa-play");
	else {
		$("#play").removeClass("fa-play").addClass("fa-pause");
		play();
	}
}

/* Start the composition process */
function start(fNote, sNote) {
	$("#footer .status").html("All loaded!");
	$("#footer .status").hide();

	playing = true;
	cnt = 0;

	s.graph.clear();

	s.graph.addNode({
		id: 'v' + cnt, 
		x: $(document).width()/2,
		y: $(document).width()/2,
		size: 20, 
		color: '#018184'
	});

	s.refresh();

	window.dispatchEvent(new Event('resize')); /* warning ! dirty HACK that fixes graph rendering issues */

	$("#header .composition .name").html("F" + fNote + "S" + sNote);

	q = new Queue();

	clearTimeout(last_timer);

	fillQueue(fNote, sNote, true);
}

/* Populate starting note values with two random values between 0-127 */
function randStart() {
	start(Math.round(Math.random()*127), Math.round(Math.random()*127));
}

/* Play note by note and generate the graph visualization */
function play() {
	if(playing) {
		fillQueue(lastFNote, lastSNote, false);

		if(!q.isEmpty()) {
			var note = q.dequeue();
			playNote(note);

			used = note.note.id % note.all_notes;
			
			for(i = 0; i < note.all_notes; i++) {
				var val = i == used ? 'v' + cnt : 'uv' + i + 'c' + cnt;
				var size = getRandomInt((i == used) ? 15 : 5, 25);

				s.graph.addNode({
					id: val, 

					x: i != used ? getRandomInt(0+size/2, $(document).width()-size/2) : ($(document).width()/127)*note.note.id,
					y: getRandomInt(0+size/2, $(document).height()-size/2),
					size: size,

					color: i == used ? '#018184' : '#c40169'
				});

				if(i == used)
					s.graph.addEdge({
						id: 'e' + val + 'c' + i + 'cn' + cnt,
						source: val,
						target: 'v' + (cnt-1),
						color: '#00a8ad'
					});

				s.refresh();
			}

			removeOld();

			last_timer = setTimeout(play, note.note.pause);
		}
	}
}

/* Play a note */
function playNote(note) {
	hl.html(note_names[note.note.id%12]);

	MIDI.noteOn(0, note.note.id, note.note.velocity, 0);
	MIDI.noteOff(0, note.note.id, note.note.pause);
	cnt++;
}

/* Remove old parts of the visualization graph to prevent high memory usage */
function removeOld() {
	s.graph.nodes().forEach(function(n) {
		if((n.id.charAt(0) == 'u' && parseInt(n.id.split("c").pop()) == cnt-2) || (n.id.charAt(0) == 'v' && parseInt(n.id.split("v").pop()) == cnt-5)) {
			s.graph.dropNode(n.id); 
			s.refresh();
		}
	});	
}