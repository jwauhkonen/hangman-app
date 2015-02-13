class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  helper_method :current_user, :word_list
  
  private
  
  def word_list
    @word_list ||= generate_word_list
  end
  
  def generate_word_list
    File.readlines("lib/dictionary.txt").map { |word| word = word.chomp }
  end
  
  def current_user
    return nil unless session[:token]
    @current_user ||= User.find_by_session_token(session[:token])
  end
  
  def signed_in?
    !current_user.nil?
  end
  
  def require_signed_in!
    redirect_to new_session_url unless signed_in?
  end
  
  def sign_in!(user)
    @current_user = user
    session[:token] = user.reset_token!
  end
  
  def destroy_current_user!
    current_user.destroy
    session[:token] = nil
  end
end
