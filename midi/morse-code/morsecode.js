function log(x) {
	post(x);
	post("\n");
}

var MORSE_CODE = "";
var FN_MORSE = "";

outlets = 4;

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

var alphabet = {
    'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
    'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
    'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
    'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
    'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
    'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
    'y': '-.--',  'z': '--..',  ' ': '/',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
    '9': '----.', '0': '-----', 
}

function add_spaces_to_morse(str) {
	
	var str_with_spaces = "";
	
	// "!" = note-on. no note-off
	// ">" = nothing. send onset note-off
	// "*" = nothing. dont send note-off

	
	for(var i = 0; i < str.length; i++) {
		
		if (str[i] === ".") {
			
			str_with_spaces += ".>";
			
		} else if (str[i] === "-") {
			
			str_with_spaces += ".**>";

		} else if (str[i] == " ") {

			str_with_spaces += "**";
			
		} else if (str[i] === "/") {
			
			str_with_spaces += "**";
			
		} else {
			
			log("Ooops fucker");
		}
			
	}
	
	return str_with_spaces;
}

function morse(i) {
	// i = i % FN_MORSE.length;
	if (typeof(FN_MORSE[i]) !== "undefined") {
		outlet(2, FN_MORSE[i]);
	}
}

function str_to_morse_code(str) {

	var morse_arr = [];
	for (var i = 0; i < str.length; i++) {
		morse_arr.push(alphabet[str[i].toLowerCase()]);
	}
	return morse_arr.join(" ");
}

function text() {
	var words = [];
	for (var i = 1; i < arguments.length; i++) {
		words.push(arguments[i]);
	}
	
	morse_str = words.join(" ");
	
	/* Clean up all non characters we can't convert */
	var regex = /[A-Za-z0-9 ]{1}/g;
 	var m, morse_str_clean = "";
	
	while ((m = regex.exec(morse_str)) !== null) {
    	// This is necessary to avoid infinite loops with zero-width matches
    	if (m.index === regex.lastIndex) {
        	regex.lastIndex++;
    	}
    
    	// The result can be accessed through the `m`-variable.
    	m.forEach(function (match, groupIndex) {
        	morse_str_clean += match;
    	});
	}

	
	/* Turn sanitized string into proper morse code string */
	MORSE_CODE = str_to_morse_code(morse_str_clean);


	FN_MORSE = add_spaces_to_morse(MORSE_CODE);
	
	log(FN_MORSE);

	
	outlet(0, morse_str_clean);
	
	outlet(1, MORSE_CODE);
}