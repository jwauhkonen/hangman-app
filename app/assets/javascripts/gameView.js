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
		this.getGameData();
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
				that.renderGame();
			}
		})
	}
	
	GameView.prototype.renderGame = function () {
		this.renderCurrentWord();
		this.renderGuessedLetters();
		this.renderWrongGuesses();
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