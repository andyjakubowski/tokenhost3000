class ListsController < ApplicationController
  before_action :set_list, only: [:show, :edit, :update, :destroy, :css, :example]
  layout 'example', only: [:example]

  def index
    @lists = List.all
    @categories = Category.all
  end

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
      else
        format.html { render :new }
      end
    end
  end

  def update
    respond_to do |format|
      if @list.update(list_params)
        format.html { redirect_to @list, notice: 'List was successfully updated.' }
        format.json { render :show, status: :ok, location: @list }
      else
        format.html { render :edit }
      end
    end
  end

  def destroy
    @list.destroy
    respond_to do |format|
      format.html { redirect_to space_url(@list.space), notice: 'List was successfully destroyed.' }
      format.json { head :no_content }
    end
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
    def set_list
      @list = List.find(params[:id])
    end

    def list_params
      params.require(:list).permit(:name, :space_slug)
    end

    def groupTokens(list)
      result = []

      list.space.categories.order('id').each do |category|
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
