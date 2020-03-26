
# Case Study

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

This is the result of a six-week-long exploration on the topic of design tokens. I wanted 

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

Tokenhost 3000 lets you do these things:

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

Having a bunch of values that everyone agrees to use leads to consistency and harmony across the product. It also forces people to think about systems, and not individual screens or flows. You have an inventory of styles and values that both designers and engineers agree to use, which is nice.

Big companies with big products will sometimes publish their design systems and the design tokens they use in those systems.

### The 4 stages of working with tokens

Obviously there are many ways to slice this cake, but I like to visualize working with tokens using these 4 stages.

#### Authoring

You figure out what tokens you think your product should have. You may come up with a set of colors, and a set of spacing values you’d like to reuse throughout the product.

Tokens are not limited to visual styles. You could define a default animation curve that should be used in your product, and then store that as a token.

#### Management

Once you’ve decided on a set of tokens you want to use, you need to store and look at them somewhere.

This depends on your tools. You could store your styles in a Figma or Sketch library. You could define your tokens in Zeplin. Or, you could document your tokens in a team wiki.

#### Distribution

You’ve now defined your tokens and you’re storing them somewhere. Next, those tokens need to be communicated to all the people actually building the software.

Let’s say you change your “Brand Color” token. How will the engineers be notified of this?

This could be as easy as tapping your team mate on their shoulder, or messaging on Slack. Or maybe they will get a Zeplin notification. Or maybe you have a more complex process where those changes reach the codebase directly.

#### Consumption

How are the tokens applied in the end? Are the values defined by designers interpreted and translated by engineers? Or are they used directly?

Are all the tokens sufficient to build an interface? Or do engineers need to create derivates of the tokens to get things done?

<a name="current-solutions"/>

## 3. Current Solutions

I can’t think of any solution that delivers on the promise of being able to edit a set of design tokens and see them applied to the real product in real time. But there are many products out there that do one thing well.

#### Figma, Sketch, Framer

These tools are great at the authoring and management stages. But, they don’t necessarily provide low-barrier ways to deploy whatever you create in a living product.

#### Zeplin

Zeplin is strong when it comes to management and distribution. It takes what you create in Figma or Sketch and presents it in a more accessible way to engineers.

You can define your style guide here, and you can link your real UI components to the designs. This is a step forward.

However, the conversion of designs your tool of choice is not lossless. You can’t resize any elements imported into Zeplin. The engineers are still forced to interpret the details of a design.

<a name="design-goals"/>

## 4. Design goals

### Real time

My goal for this project was to create software that would let you edit your design tokens and see them immediately applied to your product. Being able to immediately see how the changes you make affect the product means you can make better informed decisions more quickly.

A design tool like Figma lets you define a library of styles and components. Whenever you update that library, all of the changes will be applied to all the designs that make use of that library. I wanted to achieve the same effect, but the changes you’d make to your “library” of design tokens would be applied to the *product* at runtime.

### System-first, not screen-first

Most design tools give you an infinite canvas upon which you draw rectangles. Those rectangles are representations of different pages or screens in your product.

This canvas is very flexible. You have unlimited options. Yes, you can use the styles in your library to limit yourself. But there’s nothing stopping you from *not* using the styles in the library.

I wanted to flip that around and see what happens when you take the canvas away. The library would be the *only* thing you could change in this demo.

### Easy to try

People be busy. I didn’t want to force people to create a whole new project just to see what I was trying to say.

So this demo would need to provide a way to access some sort of sample tokens and perhaps a sample project, so you could play around with it and get the concept.

<a name="implementation"/>

## 5. Implementation

### Managing tokens with a web app

### A generic API

### Real time delivery with a WebSocket

### Static delivery with CSS

### Offline preview

<a name="challenges"/>

## 6. Challenges

### A lot to do in not a lot of time

I knew from the start I had to scope down the project as much as possible. And yet, it was difficult to get things done in 6 weeks.

### Performance

### Synchronizing offline data

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