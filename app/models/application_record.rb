class ApplicationRecord < ActiveRecord::Base
  before_create :randomize_id

  self.abstract_class = true

  private
    def randomize_id
      loop do
        self.id = SecureRandom.random_number(10_000_000)
        break unless self.class.where(id: self.id).exists?
      end
    end
end
