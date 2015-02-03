class User < ActiveRecord::Base
  validates :session_token, presence: true
  
  after_initialize :ensure_session_token
  
  
  private
  
  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end
  
  def reset_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end
  
  
end
