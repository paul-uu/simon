var SIMON = SIMON || {};
SIMON.game_over = true;
var colors_reg     = [' ', '#FFAB07', '#E9D558', '#72AD75', '#0E8D94'],
    colors_bright  = [' ', '#ffd508', '#ffff6e', '#8ed892', '#11b0b9'];

SIMON.namespace = function(namespace_string) {
	var parts = namespace_string.split('.'),
		parent = SIMON,
		i;
	if (parts[0] === "SIMON") {
		parts = parts.slice(1);
	}
	for (i = 0; i < parts.length; i++) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};

// array of randomly generated buttons to memorize
SIMON.simon_array = [];

// number score
SIMON.score = 0;

// little start button animation/initiate game - game_loop()
SIMON.game_started = false;
$('#start').on('click', function() {
	if (SIMON.game_started) {
		console.log('game already started');
		return;
	} else {

		$(this).animate({
			left:'10px'
		}, 500);
		$('#score').animate({
			right:'10px',
			opacity: 1.0
		}, 500);
		$('#turn').animate({
			width: '180px',
			opacity: 1.0
		}, 500);
		SIMON.game_started = true;
		SIMON.game_over = false;
		SIMON.simon_turn();
	}
});

SIMON.simon_turn = function(flag) {

	if (!flag) {

		$("#turn > strong").text("simon");
		$('.simon_button').removeClass('user_turn');

		// setTimeout used to cause a 2 second delay before 
		// simon's turn begins
		setTimeout(function() {

			// generate new button for user to click
			var value = Math.floor(Math.random() * 4) + 1, i = 0;

			// add to simon_array
			SIMON.simon_array.push(value);

			// 'play back' simon's buttons out of array
			var turn_end = SIMON.simon_array.length;
			var interval_id = setInterval(a, 800);
			function a() {
				if (i < turn_end) {
					button_on(SIMON.simon_array[i]);
					i++;
				} else {
					clearInterval(interval_id);
				}
			}
			SIMON.user_turn();
			SIMON.simon_turn(true);
		}, 1300);
	}
};

// --------------------------------------------
// what happens during the user's turn
SIMON.user_turn = function() {

	$('.simon_button').addClass('user_turn');
	var clicks = 0, length = SIMON.simon_array.length;

	var interval_id = setInterval(a, 1000);
	function a() {

		if (clicks >= length) {
			console.log('turn over');
			if (!SIMON.game_over) {
				SIMON.score++;
				update_score();
			}
			clearInterval(interval_id);
			SIMON.simon_turn();
		
		} else {
			$("#turn > strong").text("you");
			console.log('waiting for user to finish turn');
		}
	}

	$('.simon_button').unbind('mousedown');
	$('.simon_button').on('mousedown', function() {

		var button_clicked = $(this).text();
		button_clicked = parseInt(button_clicked, 10);

		// change button color / play it's corresponding audio
		$(this).css('background-color', colors_bright[button_clicked]);
		play_audio($(this).text());
		
		// wrong user input
		if ( button_clicked != SIMON.simon_array[clicks] ) {
			console.log('you lost');
			SIMON.game_over = true;
			clearInterval(interval_id);
		}
		// correct user input
		else {
			clicks += 1;
		}
	});
	$('.simon_button').unbind('mouseup');
	$('.simon_button').on('mouseup', function() {
		$(this).css('background-color', colors_reg[parseInt($(this).text(), 10)]);
	});
};

// --------------------------------------------
// helper function:

/* Button handling */
function button_on(number) {
	play_audio(number);
	change_color(number);
}
function play_audio(button_num) {
	sound = document.getElementById("audio_" + button_num.toString());
	sound.currentTime = 0;
	sound.play();
}
function change_color(button_num) {
	var button = $("#button_" + button_num.toString()),
		color = hexc(button.css("background-color"));
	button.css('background-color', shade_color(color, 25));
	setTimeout(function() { button.css('background-color', color); }, 700);
}
/* keep score div updated */
function update_score() {
	$('#score').text(SIMON.score);
}
