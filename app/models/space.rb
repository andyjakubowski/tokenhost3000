class Space < ApplicationRecord
  has_many :lists, dependent: :destroy

  before_create :set_slug
  after_create :create_sample_list

  def to_param
    slug
  end

  private

    def generate_slug
      array = []

      3.times { array << Faker::Creature::Animal.unique.name.parameterize }
      Faker::UniqueGenerator.clear

      array.join('-')
    end

    def set_slug
      loop do
        self.slug = generate_slug
        break unless Space.where(slug: slug).exists?
      end
    end

    def create_sample_list
      self.lists.create(name: 'Sample List')
    end
end
