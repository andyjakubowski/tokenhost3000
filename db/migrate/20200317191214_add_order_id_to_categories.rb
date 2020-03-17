class AddOrderIdToCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :categories, :order_id, :integer
  end
end
