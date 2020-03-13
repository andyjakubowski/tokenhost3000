# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Category.create!([
#   { name: 'Colors' }, 
#   { name: 'Font Sizes' },
#   { name: 'Spacing Values' },
#   { name: 'Border Radii' },
#   { name: 'Shadow Blurs' }
# ])

# List.create!([
#   { name: 'Apple iOS' },
#   { name: 'Material Design' },
#   { name: 'Polaris' },
#   { name: 'Lightning' },
#   { name: 'Andy’s Favorites' }
# ])

# List.all.each do |list|
#   Category.all.each do |category|
#     10.times do
#       Token.create!(
#         name: Faker::Name.unique.name,
#         value: Faker::Color.unique.hex_color,
#         list_id: list.id,
#         category_id: category.id
#       )
#     end
#   end
# end

# List.create!([
#   { name: '🦸🏽‍♀️🦸🏿‍♂️ Superhero Cards 2'},
#   { name: '⬛️ The Darkness' }
# ])

# tokens = JSON.parse('[
#     {
#         "id": 256,
#         "name": "color-text-tertiary",
#         "value": "#B8B4BD",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:53:28.161Z",
#         "updated_at": "2020-02-25T15:53:28.161Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/256.json"
#     },
#     {
#         "id": 255,
#         "name": "color-text-secondary",
#         "value": "#5A4F65",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:53:09.091Z",
#         "updated_at": "2020-02-25T15:53:09.091Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/255.json"
#     },
#     {
#         "id": 257,
#         "name": "color-text-inverse-primary",
#         "value": "#EAE7EE",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:53:42.233Z",
#         "updated_at": "2020-02-25T15:53:42.233Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/257.json"
#     },
#     {
#         "id": 258,
#         "name": "color-background-canvas",
#         "value": "#F7F6F8",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:53:54.615Z",
#         "updated_at": "2020-02-25T15:53:54.615Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/258.json"
#     },
#     {
#         "id": 259,
#         "name": "color-background-surface",
#         "value": "#FFFFFF",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:54:04.707Z",
#         "updated_at": "2020-02-25T15:54:04.707Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/259.json"
#     },
#     {
#         "id": 260,
#         "name": "color-background-inverse",
#         "value": "#0F0817",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:54:18.177Z",
#         "updated_at": "2020-02-25T15:54:18.177Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/260.json"
#     },
#     {
#         "id": 261,
#         "name": "color-interactive-primary",
#         "value": "#FF820F",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:54:41.661Z",
#         "updated_at": "2020-02-25T15:55:37.569Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/261.json"
#     },
#     {
#         "id": 262,
#         "name": "color-interactive-inverse",
#         "value": "#FFFFFF",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:54:56.422Z",
#         "updated_at": "2020-02-25T15:54:56.422Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/262.json"
#     },
#     {
#         "id": 263,
#         "name": "font-size-extra-large",
#         "value": "48",
#         "list_id": 6,
#         "category_id": 2,
#         "created_at": "2020-02-25T15:56:05.735Z",
#         "updated_at": "2020-02-25T15:56:05.735Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/263.json"
#     },
#     {
#         "id": 264,
#         "name": "font-size-large",
#         "value": "32",
#         "list_id": 6,
#         "category_id": 2,
#         "created_at": "2020-02-25T15:56:14.781Z",
#         "updated_at": "2020-02-25T15:56:14.781Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/264.json"
#     },
#     {
#         "id": 265,
#         "name": "font-size-medium",
#         "value": "24",
#         "list_id": 6,
#         "category_id": 2,
#         "created_at": "2020-02-25T15:56:28.857Z",
#         "updated_at": "2020-02-25T15:56:28.857Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/265.json"
#     },
#     {
#         "id": 266,
#         "name": "font-size-regular",
#         "value": "20",
#         "list_id": 6,
#         "category_id": 2,
#         "created_at": "2020-02-25T15:56:39.381Z",
#         "updated_at": "2020-02-25T15:56:39.381Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/266.json"
#     },
#     {
#         "id": 267,
#         "name": "font-size-small",
#         "value": "16",
#         "list_id": 6,
#         "category_id": 2,
#         "created_at": "2020-02-25T15:56:49.548Z",
#         "updated_at": "2020-02-25T15:56:49.548Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/267.json"
#     },
#     {
#         "id": 268,
#         "name": "spacing-extra-large",
#         "value": "72",
#         "list_id": 6,
#         "category_id": 3,
#         "created_at": "2020-02-25T15:57:05.282Z",
#         "updated_at": "2020-02-25T15:57:05.282Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/268.json"
#     },
#     {
#         "id": 269,
#         "name": "spacing-large",
#         "value": "48",
#         "list_id": 6,
#         "category_id": 3,
#         "created_at": "2020-02-25T15:57:19.353Z",
#         "updated_at": "2020-02-25T15:57:19.353Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/269.json"
#     },
#     {
#         "id": 270,
#         "name": "spacing-medium",
#         "value": "24",
#         "list_id": 6,
#         "category_id": 3,
#         "created_at": "2020-02-25T15:57:27.725Z",
#         "updated_at": "2020-02-25T15:57:27.725Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/270.json"
#     },
#     {
#         "id": 271,
#         "name": "spacing-regular",
#         "value": "16",
#         "list_id": 6,
#         "category_id": 3,
#         "created_at": "2020-02-25T15:57:37.741Z",
#         "updated_at": "2020-02-25T15:57:37.741Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/271.json"
#     },
#     {
#         "id": 272,
#         "name": "spacing-small",
#         "value": "8",
#         "list_id": 6,
#         "category_id": 3,
#         "created_at": "2020-02-25T15:57:45.813Z",
#         "updated_at": "2020-02-25T15:57:45.813Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/272.json"
#     },
#     {
#         "id": 273,
#         "name": "spacing-tiny",
#         "value": "4",
#         "list_id": 6,
#         "category_id": 3,
#         "created_at": "2020-02-25T15:57:55.063Z",
#         "updated_at": "2020-02-25T15:57:55.063Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/273.json"
#     },
#     {
#         "id": 274,
#         "name": "radius-large",
#         "value": "16",
#         "list_id": 6,
#         "category_id": 4,
#         "created_at": "2020-02-25T15:58:39.673Z",
#         "updated_at": "2020-02-25T15:58:39.673Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/274.json"
#     },
#     {
#         "id": 275,
#         "name": "radius-medium",
#         "value": "12",
#         "list_id": 6,
#         "category_id": 4,
#         "created_at": "2020-02-25T15:58:46.379Z",
#         "updated_at": "2020-02-25T15:59:32.245Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/275.json"
#     },
#     {
#         "id": 276,
#         "name": "radius-regular",
#         "value": "8",
#         "list_id": 6,
#         "category_id": 4,
#         "created_at": "2020-02-25T15:58:56.277Z",
#         "updated_at": "2020-02-25T15:58:56.277Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/276.json"
#     },
#     {
#         "id": 254,
#         "name": "color-text-primary",
#         "value": "#0A070D",
#         "list_id": 6,
#         "category_id": 1,
#         "created_at": "2020-02-25T15:28:57.344Z",
#         "updated_at": "2020-02-25T16:01:18.147Z",
#         "url": "https://andy-capstone-week-03.herokuapp.com/lists/6/tokens/254.json"
#     }
# ]')

# superheroCards = List.find_by(name: '🦸🏽‍♀️🦸🏿‍♂️ Superhero Cards 2')
# theDarkness = List.find_by(name: '⬛️ The Darkness')
# tokens.each do |token|
#   Token.create!(name: token['name'], value: token['value'], list_id: superheroCards.id, category_id: token['category_id'])
#   Token.create!(name: token['name'], value: token['value'], list_id: theDarkness.id, category_id: token['category_id'])
# end

# def generate_slug
#   array = []

#   3.times { array << Faker::Creature::Animal.unique.name }
#   Faker::UniqueGenerator.clear

#   array.join('-')
# end

# Space.where(slug: nil).each do |space|
#   space.update(slug: generate_slug)
# end
