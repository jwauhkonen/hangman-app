Rails.application.routes.draw do
  root to: "sessions#new"
  
  resource :session, only: [:new, :create, :destroy]
  
  resources :games, only: [:new, :show, :update, :create]
end
