require 'test_helper'

class SpacesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get spaces_index_url
    assert_response :success
  end

  test "should get show" do
    get spaces_show_url
    assert_response :success
  end

  test "should get new" do
    get spaces_new_url
    assert_response :success
  end

  test "should get edit" do
    get spaces_edit_url
    assert_response :success
  end

  test "should get create" do
    get spaces_create_url
    assert_response :success
  end

  test "should get update" do
    get spaces_update_url
    assert_response :success
  end

  test "should get destroy" do
    get spaces_destroy_url
    assert_response :success
  end

end
