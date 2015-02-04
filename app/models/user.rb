class User < ActiveRecord::Base
  validates :session_token, presence: true
  
  after_initialize :ensure_session_token, :set_win_record
  
  has_many :games
  
  def reset_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end 
  
  
  private
  
  
  def set_win_record
    self.games_won = 0
    self.games_lost = 0
  end
  
  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end
  
end
