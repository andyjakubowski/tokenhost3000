class SpacesController < ApplicationController
  def index
    @spaces = Space.all
  end

  def show
    @space = Space.find_by slug: params[:slug]

    if (!@space)
      render 'spaces/not_found'
    end
  end

  def create
    @space = Space.new

    if @space.save
      redirect_to @space, notice: 'Space created. It will self-destruct in about 48 hours. Enjoy.'
    else
      render 'home/show'
    end
  end

  def destroy
  end
end
