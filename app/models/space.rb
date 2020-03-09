class Space < ApplicationRecord
  has_many :lists, dependent: :destroy

  before_create :set_slug

  def to_param
    slug
  end

  private

    def generate_slug
      array = []

      3.times { array << Faker::Creature::Animal.unique.name }
      Faker::UniqueGenerator.clear

      array.join('-')
    end

    def set_slug
      loop do
        self.slug = generate_slug
        break unless Space.where(slug: slug).exists?
      end
    end
end
