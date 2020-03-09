class HomeController < ApplicationController
  layout 'home'

  def show
    @space = Space.new
    render 'home/show'
  end
end