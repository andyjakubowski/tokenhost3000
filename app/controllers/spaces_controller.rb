class SpacesController < ApplicationController
  before_action :check_space_expiration, only: [:show]

  def index
    @spaces = Space.all
  end

  def show
    @space = Space.find_by slug: params[:slug]

    if !@space
      render 'spaces/not_found'
    elsif @space.expired?
      render 'spaces/expired'
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
    @space = Space.find_by slug: params[:slug]
    @space.destroy
    respond_to do |format|
      format.html { redirect_to spaces_url, notice: 'Space deleted.' }
      format.json { head :no_content }
    end
  end

  private

    def check_space_expiration
      space = Space.find_by slug: params[:slug]

      if space
        render 'spaces/expired' if space.expired?
      else
        render 'other/404'
      end
    end
end
