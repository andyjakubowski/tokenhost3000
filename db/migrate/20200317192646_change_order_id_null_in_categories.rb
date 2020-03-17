class ChangeOrderIdNullInCategories < ActiveRecord::Migration[6.0]
  def change
    change_column_null :categories, :order_id, false, 1
  end
end
