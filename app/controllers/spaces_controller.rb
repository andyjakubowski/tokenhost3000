class SpacesController < ApplicationController
  http_basic_authenticate_with name: ENV['BASIC_AUTH_USER'], password: ENV['BASIC_AUTH_PASSWORD'], only: [:destroy, :index]

  before_action :check_space_expiration, only: [:show]

  def index
    @spaces = Space.all
  end

  def show
    @space = Space.find_by slug: params[:slug]
  end

  def create
    @space = Space.new

    if @space.save
      redirect_to @space, notice: 'Space created. Enjoy!'
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
        if space.expired?
          respond_to do |format|
            format.html { render 'spaces/expired', status: :gone }
            format.json { render 'spaces/expired', status: :gone }
          end
        end
      else
        respond_to do |format|
          format.html { render 'other/404', status: :not_found }
          format.json { render 'other/404', status: :not_found }
        end
      end
    end
end
