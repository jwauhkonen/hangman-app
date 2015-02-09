(function () {
	if (typeof Hangman === "undefined") {
		window.Hangman = {};
	}
	
	var GameView = Hangman.GameView = function ($el, gameId) {
		this.$el = $el;
		this.gameId = gameId;
		this.currentWord = "";
		this.guessedLetters = [];
		this.wrongGuesses = 0;
		
		// getGameData prompts the next move the game on success.
		this.getGameData();
		this.listenForInput();
	}
	
	GameView.prototype.updateGame = function (data) {
		this.currentWord = data.current_word;
		this.guessedLetters = data.guessed_letters;
		this.wrongGuesses = data.wrong_guesses;
		this.renderGame();
	}
	
	GameView.prototype.getGameData = function () {
		var that = this;
		$.ajax({
			url: this.gameId,
			type: "GET",
			success: function (data) {
				that.updateGame(data);
			}
		})
	}
	
	GameView.prototype.renderGame = function () {
		this.renderCurrentWord();
		this.renderGuessedLetters();
		this.renderWrongGuesses();
	}
	
	GameView.prototype.listenForInput = function () {
		$("#guess-button").on("click", function () {
			var guess = $("#player-guess")[0].value
			this.submitGuess(guess);
		}.bind(this));
	}
	
	GameView.prototype.submitGuess = function (guess) {
		console.log(guess);
		var that = this;
		if (this.validMove(guess)) {
			$.ajax({
				url: this.gameId,
				type: "PATCH",
				data: {
					letter: guess
				},
				success: function () {
					console.log('hooray')
					that.getGameData();
				}
			})
		}
		
		$("#player-guess").val("");
	}
	
	GameView.prototype.validMove = function (guess) {
		if (guess.length !== 1) {
			alert("Guess must be a single character.");
			return false
		}
		
		if (/[a-z]/.test(guess) === false) {
			alert("Guess must be a lower-case letter.");
			return false
		}
		
		if (this.guessedLetters.indexOf(guess) !== -1) {
			alert("Cannot guess the same letter twice.");
			return false
		}
		
		return true
	}
	
	GameView.prototype.renderCurrentWord = function () {
		$("#current-word").html("current word is " + this.currentWord);
	}
	
	GameView.prototype.renderGuessedLetters = function () {
		var guessesString = "";
		this.guessedLetters.forEach( function (letter) {
			guessesString += (letter + ", ")
		})
		$("#guessed-letters").html("guessed letters are " + guessesString);
	}
	
	GameView.prototype.renderWrongGuesses = function () {
		$("#wrong-guesses").html("there are " + this.wrongGuesses + "wrong guesses.");
	}
	
	
	
	
})();