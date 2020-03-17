class Space < ApplicationRecord
  has_many :lists, dependent: :destroy
  has_many :categories, dependent: :destroy

  EXPIRATION_TIME_HOURS = 32
  SECONDS_IN_AN_HOUR = 3600

  before_create :set_slug
  after_create :create_sample_categories, :create_sample_lists

  def to_param
    slug
  end

  def expired?
    elapsed_seconds = Time.now - self.created_at
    total_seconds = EXPIRATION_TIME_HOURS * SECONDS_IN_AN_HOUR
    elapsed_time > expiration_time
  end

  def hours_until_expiration
    total_seconds = EXPIRATION_TIME_HOURS * SECONDS_IN_AN_HOUR
    elapsed_seconds = Time.now - self.created_at
    hours = (total_seconds - elapsed_seconds) / SECONDS_IN_AN_HOUR
    hours.floor
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

    def create_sample_categories
      seed_categories = YAML::load_file('db/seeds/categories.yml')
      seed_categories.each do |category|
        self.categories.create!(name: category['name'])
      end
    end

    def create_sample_lists
      create_list('Sample Light', 'light.yml')
      create_list('Sample Dark', 'dark.yml')
    end

    def create_list(list_name, filename)
      list = self.lists.new(name: list_name)
      tokens = YAML::load_file("db/seeds/tokens/#{filename}")

      tokens.each do |token|
        category = self.categories.find_by(name: token['category'])

        if category
          token['category_id'] = category.id
        end

        token.delete 'category'
      end
      list.tokens.new(tokens)
      list.save
      list.generate_css
    end
end
