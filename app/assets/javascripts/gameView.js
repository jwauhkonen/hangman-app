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
		
		// getGameData renders the game on success.
		this.getGameData();
		this.listenForInput();
	}
	
	GameView.prototype.getGameData = function () {
		var that = this;
		$.ajax({
			url: this.gameId,
			type: "GET",
			success: function (data) {
				that.currentWord = data.current_word;
				that.guessedLetters = data.guessed_letters;
				that.wrongGuesses = data.wrong_guesses;
				debugger
				that.renderGame();
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
		// $.ajax({
// 			url: "/games",
// 			type: "POST",
// 			data: {
// 				id: this.gameId,
// 				letter: guess
// 			},
// 			success: function () {
// 				console.log('it worked')
// 			}
//
// 		});


	}
	
	GameView.prototype.renderCurrentWord = function () {
		$("#current-word").html("current word is " + this.currentWord);
	}
	
	GameView.prototype.renderGuessedLetters = function () {
		$("#guessed-letters").html("guessed letters are " + this.guessedLetters);
	}
	
	GameView.prototype.renderWrongGuesses = function () {
		$("#wrong-guesses").html("there are " + this.wrongGuesses + "wrong guesses.");
	}
	
	
	
	
})();