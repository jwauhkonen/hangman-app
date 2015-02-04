# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150204013310) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", force: true do |t|
    t.string   "word",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entries", ["word"], name: "index_entries_on_word", using: :btree

  create_table "games", force: true do |t|
    t.integer  "user_id",                      null: false
    t.string   "game_word",                    null: false
    t.string   "current_word",                 null: false
    t.string   "guessed_letters", default: [],              array: true
    t.integer  "wrong_guesses",                null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "session_token", null: false
    t.integer  "games_won",     null: false
    t.integer  "games_lost",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["session_token"], name: "index_users_on_session_token", using: :btree

end
