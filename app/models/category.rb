class Category < ApplicationRecord
  validates :name, presence: true
  has_many :tokens, dependent: :nullify
end
