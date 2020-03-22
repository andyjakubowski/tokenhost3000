
# This Token Thing 2020

##### Table of Contents  
[1. Introduction](#introduction)  
[2. Design Tokens](#design-tokens)  
[3. Current Solutions](#current-solutions)  
[4. Design goals](#design-goals)  
[5. Implementation](#implementation)  
[6. Challenges](#challenges)  
[7. Future](#future)  
[8. References](#references)  

<a name="introduction"/>

## 1. Introduction

This is the result of six-week-long exploration on the topic of design tokens. I wanted 

### Main idea

It should not take weeks to update the color of a single button. Wouldn’t it be great if designers could test the styling of a product by themselves, **in real time**?

### Inspiration

I envy designers working with physical materials. They know the material they work with, and manipulate it directly. As they experiment with the material, they immediately see what works and what doesn’t.

But as the complexity of what is being designed grows, that direct contact with the product frequently goes away. People take on smaller, specialized roles, and work together to produce the final result.

As a product designer, I’ve been in that latter camp a lot.

But as I invested more time into learning programming, I was impressed by how much order there was to some seemingly complex parts. Programmers were presented with a lot of power coming from tools, packages, and plugins, all of these things worked together nicely. As long as you follow a bunch of rules, you get a lot of capability *and* retain control over the thing.

I really liked that. A perfect example was the Rack interface. Rack lets frameworks and web servers work together easily as long as they follow some basic rules set by Rack.

I wanted to see what it would feel like to be able to edit the fundamental properties of a design at runtime. I wanted to see how that would affect my design process.

### Features

This Token Thing 2020 lets you do these things:

- **create a space**, which will keep your lists of tokens for 48 hours
- **create lists of tokens**. For example, a Light Theme and a Dark Theme
- **create design tokens** with arbitrary names and values
- assign tokens to **categories** so they are easier to organize
- choose a token **type** — like Color, or Spacing — to visualize the value of the token
- **preview your tokens** by adding the Token Widget 2020 to whatever you are working on
- **switch between lists** of tokens with the Token Widget 2020
- see your project’s styles change in **real time** as you update the tokens
- access and manipulate your tokens through an **API**
- you can also directly access a generated **CSS** file for a specific list of tokens you define

<a name="design-tokens"/>

## 2. Design Tokens

### What is a design token, anyway?

A design token lets you give a name and a value to something that gets repeated in your product a lot.

Imagine you want all the buttons on your website to be orange. You don’t want to repeat yourself over and over when building the thing. You’ll want to define that particular orange somewhere, and refer to that value by some name instead.

For example, you could have a token named “Color — Brand” with a value of “Orange”. Or, you could define a token named “Spacing — Large” and give it a value of “32”.

This is helpful because once you decide you want all buttons to be pink from now on, all you need to do is change your “Color — Brand” token from “Orange” to “Pink”. If done right, this saves you time and lets you focus on the experience of using your product.

### How are design tokens used

### 4 stages: authoring, management, distribution, consumption

<a name="current-solutions"/>

## 3. Current Solutions
- in-house solutions
- plug-ins
- Zeplin

<a name="design-goals"/>

## 4. Design goals
- real-time
- system-first, not screen-first
- easy to try

<a name="implementation"/>

## 5. Implementation
- management: web app (Rails, BEM)
- distribution: static CSS file storage (Active Storage, S3)
- distribution: API (Rails)
- distribution: WebSocket (Rails)
- consumption: Widget (CSS Custom Properties, Storage API, Action Cable)
- consumption: offline mode

<a name="challenges"/>

## 6. Challenges
- surface area and time limits (6 weeks is not that much time)
- performance: creating spaces with built-in sample lists, CSS generation
- Widget and offline storage

<a name="future"/>

## 7. Future
- stricter types and input validation
- add namespacing to categories
- more direct token value affordances (color picker, sliders, etc.)
- tokens derivatives (tokens getting their value from another token)
- make it easier to figure out which elements on the page use which tokens so you know what to edit

<a name="references"/>

## 8. References
- Lea Verou’s Custom CSS Properties talk
- Jina Anne’s design systems talk
- The Book of Shaders