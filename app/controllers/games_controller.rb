class GamesController < ApplicationController
  before_action :require_signed_in!
  
  def new
    @game = current_user.games.new
    @game.game_word = word_list.select { |word| (word.length > 7) && (word.length < 11) }.sample
    @game.current_word = ("_" * @game.game_word.length)
    @game.wrong_guesses = 0
    @game.state = "ongoing"
    
    @game.save
    render :new
  end
  
  def create
    check_forfeit
    redirect_to new_game_url
  end
  
  def show
    @game = Game.find(params[:id])
    render :show
  end
  
  def update
    @game = Game.find(params[:id])
    letter = params[:letter]
    
    update_current_word(letter)
    update_wrong_guesses(letter)
    update_guessed_letters(letter)
    check_for_win
    check_for_loss
    
    update_win_count
    @game.save
    render :new
  end
  
  
  private
  
  
  def check_forfeit
    if params[:id]
      @game = Game.find(params[:id])
      
      if @game.state == "ongoing"
        @game.state = "lost"
        update_win_count
      end
    end
  end
  
  def update_win_count
    @user = current_user
    
    if @game.state == "won"
      @user.games_won += 1
    elsif @game.state == "lost"
      @user.games_lost += 1
    end
    
    @user.save
  end
  
  def check_for_win
    if @game.game_word == @game.current_word
      @game.state = "won"
    end
  end
  
  def check_for_loss
    if @game.wrong_guesses == 10
      @game.state = "lost"
    end
  end
  
  def update_current_word(letter)
    new_current_word = @game.current_word.split("")
    
    (0...@game.game_word.length).each do |i|
      if @game.game_word[i] == letter
        new_current_word[i] = letter
      end
    end
    
    @game.current_word = new_current_word.join("")
  end
  
  def update_wrong_guesses(letter)
     @game.wrong_guesses += 1 unless @game.game_word.include?(letter)
  end
  
  def update_guessed_letters(letter)
    new_guessed_letters = []
    @game.guessed_letters.each { |guess| new_guessed_letters << guess }
    new_guessed_letters << letter
    @game.guessed_letters = new_guessed_letters
  end
  
end
