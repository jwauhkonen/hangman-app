namespace :db do
  task :dictionary => :environment do
    entries = File.readlines("lib/dictionary.txt")
  
    entries.each do |entry|
      Entry.create(word: entry.chomp)
    end
  end
end

