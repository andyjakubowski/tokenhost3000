class HomeController < ApplicationController
  before_action do
    @markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML)
  end

  layout 'home'

  def show
    @space = Space.new
    render 'home/show'
  end
end