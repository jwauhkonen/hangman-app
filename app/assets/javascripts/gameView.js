(function () {
	if (typeof Hangman === "undefined") {
		window.Hangman = {};
	}
	
	var GameView = Hangman.GameView = function ($el, gameId, wins, losses) {
		this.$el = $el;
		this.gameId = gameId;
		this.wins = wins;
		this.losses = losses;
		this.currentWord = "";
		this.guessedLetters = [];
		this.wrongGuesses = 0;
	
		// getGameData prompts the next move on success.
		this.renderWinCount();
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
	
	GameView.prototype.gameWin = function () {
		var that = this;
		$.ajax({
			url: "/session",
			type: "PATCH",
			data: {
				game: "win"
			},
			success: function () {
				that.wins += 1;
				that.renderWinCount();
			}
		})
	}
	
	GameView.prototype.gameLoss = function () {
		var that = this;
		$.ajax({
			url: "/session",
			type: "PATCH",
			data: {
				game: "lose"
			},
			success: function () {
				that.losses += 1
				that.renderWinCount();
			}
		})
	}
	
	GameView.prototype.checkGameOver = function () {
		if (this.currentWord.indexOf("_") === -1) {
			this.gameWin();
		}
		
		if (this.wrongGuesses === 10) {
			this.gameLoss();
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
	
	GameView.prototype.renderWinCount = function () {
		$("#win-count").html(this.wins + " wins - " + this.losses + " losses");
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
		var wordString = this.currentWord.split("").join(" ")
		$("#current-word").html(wordString);
	}
	
	GameView.prototype.renderGuessedLetters = function () {
		var guessesString = this.guessedLetters.sort().join(", ");
		$("#guessed-letters").html("Guessed letters: " + guessesString);
	}
	
	GameView.prototype.renderWrongGuesses = function () {
		var guessesLeft = (10 - this.wrongGuesses)
		$("#wrong-guesses").html("You have " + guessesLeft + " wrong guesses left.");
	}
	
	
	
	
})();