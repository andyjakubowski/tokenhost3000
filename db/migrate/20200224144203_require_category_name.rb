class RequireCategoryName < ActiveRecord::Migration[6.0]
  def change
    change_column_null :categories, :name, false
  end
end
