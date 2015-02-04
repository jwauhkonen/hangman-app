class Game < ActiveRecord::Base
  validates :user_id, :game_word, :current_word, :wrong_guesses, presence: true
  
  after_initialize :set_game_stats
  
  belongs_to :user
  
  
  private
  
  
  def set_game_stats
    self.game_word = Entry.where("char_length(word) > 6 AND char_length(word) < 13").sample.word
    self.current_word = ("_" * self.game_word.length)
    self.wrong_guesses = 0
  end
  
end