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
		this.checkGameOver();
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
	
	GameView.prototype.checkGameOver = function () {
		if (this.currentWord.indexOf("_") === -1) {
			alert("You win!")
		}
		
		if (this.wrongGuesses === 10) {
			alert("You lose!")
			var selector = '.hangman-cover[data-id="11"]'
			$(selector).css("visibility", "hidden");
		}
	}
	
	GameView.prototype.renderGame = function () {
		this.renderCurrentWord();
		this.renderGuessedLetters();
		this.renderWrongGuesses();
		this.revealLimb();
	}
	
	GameView.prototype.revealLimb = function () {
		var selector = '.hangman-cover[data-id="' + this.wrongGuesses + '"]'
		$(selector).css("opacity", "0");
		$(selector).css("transition", "opacity 1s");
	}
	
	GameView.prototype.listenForInput = function () {
		var that = this;
		
		var clickSubmit = function () {
			var guess = $("#player-guess")[0].value
			that.submitGuess(guess);
		};
		
		$("#guess-button").on("click", clickSubmit);
		
		$("#game-area").on("keypress", function (e) {
			if (e.which === 13) {
				clickSubmit();
			}
		});
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