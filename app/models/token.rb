class Token < ApplicationRecord
  belongs_to :list
  belongs_to :category, optional: true

  after_commit { self.list.update_stylesheet }
  after_rollback { self.list.update_stylesheet }
end
