class CategoriesController < ApplicationController
  def index
    @categories = Category.all

    respond_to do |format|
      format.html { render 'other/404' }
      format.json { render :index, status: :ok }
    end
  end

  def show
    @category = Category.find(params[:id])
  end

  def new
    @category = Category.new
  end

  def edit
    @category = Category.find(params[:id])
  end

  def create
    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to lists_path, notice: 'Category created.' }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render 'new' }
      end
    end
  end

  def update
    @category = Category.find(params[:id])

    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to lists_path, notice: 'Successfully edited the category.' }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render 'edit' }
      end

    end
  end

  def destroy
    @category = Category.find(params[:id])
    @category.destroy

    respond_to do |format|
      format.html { redirect_to lists_url, notice: 'Category deleted.' }
      format.json { head :no_content }
    end
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end