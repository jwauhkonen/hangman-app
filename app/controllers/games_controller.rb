class GamesController < ApplicationController
  
  def new
    @game = current_user.games.new
    @game.game_word = Entry.where("char_length(word) > 3 AND char_length(word) < 8").sample.word
    @game.current_word = ("_" * @game.game_word.length)
    @game.wrong_guesses = 0
    
    @game.save
    render :new
  end
  
  def show
    @game = Game.find(params[:id])
    render :show
  end
  
  def update
    @game = Game.find(params[:id])
    letter = params[:letter]
    new_current_word = @game.current_word.split("")
    new_guessed_letters = []
    @game.guessed_letters.each { |guess| new_guessed_letters << guess }
    wrong = true
    
    new_guessed_letters << letter

    (0...@game.game_word.length).each do |i|
      if @game.game_word[i] == letter
        new_current_word[i] = letter
        wrong = false
      end
    end
    
    @game.current_word = new_current_word.join("")
    @game.guessed_letters = new_guessed_letters
    @game.wrong_guesses += 1 if wrong
    @game.save
    render :new
  end
  
end
