class Category < ApplicationRecord
  validates :name, presence: true
  has_many :tokens, dependent: :nullify
  belongs_to :space

  before_create :set_order_id

  private
    def set_order_id
      current_max_order_id = self.space.categories.map { |c| c.order_id }.max || 0
      self.order_id = current_max_order_id + 1
    end
end
