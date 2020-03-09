class SetSlugNotNullInSpace < ActiveRecord::Migration[6.0]
  def change
    change_column_null(:spaces, :slug, false)
  end
end
