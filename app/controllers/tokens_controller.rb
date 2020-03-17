class TokensController < ApplicationController
  before_action :check_space_expiration
  before_action :set_list, only: [:index, :create]

  def index
    @tokens = @list.tokens
  end

  def edit
    @token = Token.find(params[:id])
  end

  def create
    @token = @list.tokens.new(token_params)
    respond_to do |format|
      if @token.save
        @list.generate_css
        format.html { redirect_to list_path(@list), notice: 'Token created.' }
        format.json { render :show, status: :created, location: token_url(@token) }
      else
        format.html { render 'lists/show' }
        format.json { render json: @token.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @token = Token.find(params[:id])

    respond_to do |format|
      if @token.update(token_params)
        @token.list.generate_css
        format.html { redirect_to @token.list, notice: 'Token updated.' }
        format.json { render :show, status: :ok, location: token_url(@token) }
      else
        format.html { render 'edit' }
      end
    end
  end

  def destroy
    @token = Token.find(params[:id])
    @token.destroy

    @token.list.generate_css
    respond_to do |format|
      format.html { redirect_to @token.list, notice: 'Token deleted.' }
      format.json { head :no_content }
    end
  end

  private

    def check_space_expiration
      token = Token.find_by(id: params[:id])

      if token
        list = token.list
      else
        list = List.find_by(id: params[:list_id])
      end

      space = list.space if list

      if space
        render 'spaces/expired' if space.expired?
      else
        render 'other/404'
      end
    end

    def set_list
      @list = List.find(params[:list_id])
    end

    def token_params
      params.require(:token).permit(:name, :value, :category_id, :list_id, :type)
    end
end
