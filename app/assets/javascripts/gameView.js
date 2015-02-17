(function () {
	if (typeof Hangman === "undefined") {
		window.Hangman = {};
	}
	
	var GameView = Hangman.GameView = function ($el, gameId, wins, losses) {
		this.$el = $el;
		this.gameId = gameId;
		this.wins = wins;
		this.losses = losses;
	
		this.renderWinCount();
		// getGameData prompts the next move on success.
		this.getGameData();
		this.listenForInput();
	}
	
	GameView.prototype.checkForfeit = function () {
		var that = this;
		
		if (confirm("Forfeit this game and start a new one?") === true) {
			$("#restart-button").click();
		}
	}
	
	GameView.prototype.checkGameOver = function () {
		if (this.state !== "ongoing") {
			this.gameOver();
		}
	}
	
	GameView.prototype.gameOver = function () {
		// getWinCount prompts renderWinCount
		this.getWinCount();
		$("#game-info").empty();
		this.revealWord();
		// brings #restart-button to front
		$("#forfeit-check-button").css("z-index", "-10");
		
		if (this.state === "won") {
			$("#game-over-message").css("color", "blue");
			$("#game-over-message").html("Great Job! With your superior intellect you have saved a man's life.");
		} else if (this.state === "lost") {
			$("#game-over-message").css("color", "red");
			$("#game-over-message").html("For shame! This poor man's death will forever be on your conscience.");
		}
	}
	
	GameView.prototype.getGameData = function () {
		var that = this;
		$.ajax({
			url: "/games/" + this.gameId,
			type: "GET",
			dataType: "json",
			success: function (data) {
				that.updateGame(data);
			}
		})
	}
	
	GameView.prototype.getWinCount = function () {
		var that = this;
		$.ajax({
			url: "/session",
			type: "GET",
			success: function (data) {
				that.wins = data.games_won;
				that.losses = data.games_lost;
				that.renderWinCount();
			}
		})
	}
	
	GameView.prototype.listenForInput = function () {
		$("#forfeit-check-button").on("click", this.checkForfeit.bind(this));
		
		$(document).on("keypress", function (e) {
			if (e.keyCode === 13) {
				if (this.state === "ongoing") {
					$("#forfeit-check-button").click();
				} else {
					$("#restart-button").click();
				}
			} else {
				this.submitGuess(e);
			}
		}.bind(this));
	}
	
	GameView.prototype.renderCurrentWord = function () {
		var wordString = this.currentWord.split("").join(" ")
		$("#current-word").html(wordString);
	}
	
	GameView.prototype.renderGame = function () {
		this.renderCurrentWord();
		this.renderGuessedLetters();
		this.renderWrongGuesses();
		this.revealLimb(this.wrongGuesses);
	}
	
	GameView.prototype.renderGuessedLetters = function () {
		var guessesString = this.guessedLetters.sort().join(", ");
		$("#guessed-letters").html("Guessed letters: " + guessesString);
	}
	
	GameView.prototype.renderWinCount = function () {
		$("#win-count").html(this.wins + " wins - " + this.losses + " losses");
	}
	
	GameView.prototype.renderWrongGuesses = function () {
		var guessesLeft = (10 - this.wrongGuesses)
		$("#wrong-guesses").html("You have " + guessesLeft + " wrong guesses left.");
	}
	
	GameView.prototype.revealLimb = function (limbNum) {
		for (var limb = 1; limb <= limbNum; limb++) {
			var selector = '.hangman-cover[data-id="' + limb + '"]'
			if (!($(selector).css("opacity") === "0")) {
				$(selector).css("opacity", "0");
				$(selector).css("transition", "opacity 1s");
			}
		}
	}
	
	GameView.prototype.revealWord = function () {
		$.ajax({
			url: "/games/" + this.gameId,
			type: "GET",
			dataType: "json",
			success: function (data) {
				$("#full-word").html(data.game_word);
			}
		})
	}
	
	GameView.prototype.submitGuess = function (e) {
		var guess = String.fromCharCode(e.keyCode)
		var that = this;
		if (this.validMove(guess)) {
			$.ajax({
				url: "/games/" + this.gameId,
				type: "PATCH",
				data: {
					letter: guess
				},
				success: function () {
					that.getGameData();
				}
			})
		}
		
		$("#player-guess").val("");
	}
	
	GameView.prototype.updateGame = function (data) {
		this.currentWord = data.current_word;
		this.guessedLetters = data.guessed_letters;
		this.wrongGuesses = data.wrong_guesses;
		this.state = data.state;
		this.renderGame();
		this.checkGameOver();
	}
	
	GameView.prototype.validMove = function (guess) {
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
	
})();