class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :user_id, null: false
      t.string :game_word, null: false
      t.string :current_word, null: false
      t.string :guessed_letters, array: true, default: []
      t.integer :wrong_guesses, null: false

      t.timestamps
    end
  end
end