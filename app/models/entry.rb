class Entry < ActiveRecord::Base
  validates :word, presence: true
  
end
