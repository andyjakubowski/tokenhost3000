class ChangeOrderIdDefaultInCategories < ActiveRecord::Migration[6.0]
  def change
    change_column_default :categories, :order_id, from: nil, to: 1
  end
end
