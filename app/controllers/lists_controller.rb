class ListsController < ApplicationController
  before_action :set_space
  before_action :check_space_expiration
  before_action :set_list, only: [:show, :edit, :update, :destroy, :css, :example]
  layout 'example', only: [:example]

  def show
    @tokensByCategory = groupTokens(@list)
    @space = @list.space
  end

  def new
    @space = Space.find_by slug: params[:space_slug]
    @list = List.new
  end

  def edit
  end

  def create
    @space = Space.find_by slug: params[:space_slug]
    @list = @space.lists.new(list_params)

    respond_to do |format|
      if @list.save
        format.html { redirect_to @list, notice: 'List was successfully created.' }
        format.json { render :show, status: :created, location: @list }

        ActionCable.server.broadcast("space_#{@space.slug}", {
          message_type: 'list_create',
          list: @list
        })
      else
        format.html { render 'new' }
      end
    end
  end

  def update
    respond_to do |format|
      if @list.update(list_params)
        format.html { redirect_to @list, notice: 'List was successfully updated.' }
        format.json { render :show, status: :ok, location: @list }

        ActionCable.server.broadcast("space_#{@list.space.slug}", {
          message_type: 'list_update',
          list: @list
        })
      else
        format.html { render :show }
      end
    end
  end

  def destroy
    @list.destroy
    respond_to do |format|
      format.html { redirect_to space_url(@list.space), notice: 'List deleted.' }
      format.json { head :no_content }
    end

    ActionCable.server.broadcast("space_#{@list.space.slug}", {
      message_type: 'list_destroy',
      list_id: @list.id
    })
  end

  def css
    if @list.stylesheet.attached?
      redirect_to url_for(@list.stylesheet)
    else
      redirect_to @list
    end
  end

  def example
    if !@list.stylesheet.attached?
      redirect_to @list
    end
  end

  private

    def set_space
      list = List.find_by(id: params[:id])

      if list
        @space = list.space
      else
        @space = Space.find_by(slug: params[:space_slug]) || nil
      end
    end

    def set_list
      @list = List.find(params[:id])
    end

    def check_space_expiration
      if @space
        if @space.expired?
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

    def list_params
      params.require(:list).permit(:name, :space_slug, :description, :project_url)
    end

    def groupTokens(list)
      result = []

      list.space.categories.order('order_id').each do |category|
        object = {}
        object['category'] = category
        object['tokens'] = category.tokens.where(list_id: list.id).order('LOWER(name)')
        result << object
      end

      unless list.tokens.where(category_id: nil).empty?
        object = {}
        object['category'] = nil
        object['tokens'] = list.tokens.where(category_id: nil).order('LOWER(name)')
        result << object
      end

      result
    end
end
