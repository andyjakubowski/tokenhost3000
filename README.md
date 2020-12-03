# Intro

Tokenhost 3000 is a conceptual prototype of a web app for editing and delivering design tokens (styles) in real time.

I built this in six weeks right after finishing [Launch School](https://launchschool.com), a mastery-based curriculum focusing on programming fundamentals.

![GIF of the Tokenhost 3000 demo](tokenhost-intro.gif)

# Try the demo

Go to [https://tokenhost3000.herokuapp.com/](https://tokenhost3000.herokuapp.com/) and click the **Try Demo** button. You’ll get an account to play around that will self-destruct after 24 hours.

# Case Study

##### Table of Contents

1. Introduction
2. Design Tokens
3. Current Solutions
4. Design goals
5. Implementation
6. Challenges
7. Future
8. References

## 1. Introduction

### Main idea

_It should not take weeks to update the color of a single button_.

Wouldn’t it be great if designers could test the styling of a product by themselves, **in real time**?

### Inspiration

I envy designers working with physical materials. They know the material they work with, and manipulate it directly. As they experiment with the material, they immediately see what works and what doesn’t.

But as the complexity of what is being designed grows, that direct contact with the product frequently goes away. People take on smaller, specialized roles, and work together to produce the final result.

As a product designer, I’ve been in that latter camp a lot.

But as I invested more time into learning programming, I was impressed by how much order there was to some seemingly complex parts. Programmers were presented with a lot of power coming from tools, packages, and plugins, all of these things worked together nicely. As long as you follow a bunch of rules, you get a lot of capability _and_ retain control over the thing.

I really liked that. A perfect example was the Rack interface. Rack lets frameworks and web servers work together easily as long as they follow some basic rules set by Rack.

I wanted to see what it would feel like to be able to edit the fundamental properties of a design at runtime. I wanted to see how that would affect my design process.

### Features

Tokenhost 3000 lets you do these things:

- **create a space**, which will keep your lists of tokens for 48 hours
- **create lists of tokens**. For example, a Light Theme and a Dark Theme
- **create design tokens** with arbitrary names and values
- assign tokens to **categories** so they are easier to organize
- choose a token **type** — like Color, or Spacing — to visualize the value of the token
- **preview your tokens** by adding the Tokenhost 3000 JavaScript widget to whatever you are working on
- **switch between lists** of tokens with the Tokenhost 3000 JavaScript widget
- see your project’s styles change in **real time** as you update the tokens
- access and manipulate your tokens through an **API**
- you can also directly access a generated **CSS** file for a specific list of tokens you define

## 2. Design Tokens

### What’s a design token, anyway?

A design token lets you give a name and a value to something that gets repeated in your product a lot.

Imagine you want all the buttons on your website to be orange. You don’t want to repeat yourself over and over when building the thing. You’ll want to define that particular orange somewhere, and refer to that value by some name instead.

For example, you could have a token named “Color — Brand” with a value of “Orange”. Or, you could define a token named “Spacing — Large” and give it a value of “32”.

This is helpful because once you decide you want all buttons to be pink from now on, all you need to do is change your “Color — Brand” token from “Orange” to “Pink”. If done right, this saves you time and lets you focus on the experience of using your product.

### How design tokens are used

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

## 3. Current Solutions

I can’t think of any solution that delivers on the promise of being able to edit a set of design tokens and see them applied to the real product in real time. But there are some products out there that do one or several of the things mentioned above.

#### Figma, Sketch, Framer

These tools are great at the authoring and management stages. But, they don’t necessarily provide low-barrier ways to deploy whatever you create in a living product.

#### Zeplin

Zeplin is strong when it comes to management and distribution. It takes what you create in Figma or Sketch and presents it in a more accessible way to engineers.

You can define your style guide here, and you can link your real UI components to the designs. This is a step forward.

However, the conversion of designs your tool of choice is not lossless. You can’t resize any elements imported into Zeplin. The engineers are still forced to interpret the details of a design.

## 4. Design goals

### Real time

My goal for this project was to create software that would let you edit your design tokens and see them immediately applied to your product. Being able to immediately see how the changes you make affect the product means you can make better informed decisions more quickly.

A design tool like Figma lets you define a library of styles and components. Whenever you update that library, all of the changes will be applied to all the designs that make use of that library. I wanted to achieve the same effect, but the changes you’d make to your “library” of design tokens would be applied to the _product_ at runtime.

### System-first, not screen-first

Most design tools give you an infinite canvas upon which you draw rectangles. Those rectangles are representations of different pages or screens in your product.

This canvas is very flexible. You have unlimited options. Yes, you can use the styles in your library to limit yourself. But there’s nothing stopping you from _not_ using the styles in the library.

I wanted to flip that around and see what happens when you take the canvas away. The library would be the _only_ thing you could change in this demo.

### Easy to try

People be busy. I didn’t want to force people to create a whole new project just to see what I was trying to say.

So this demo would need to provide a way to access some sort of sample tokens and perhaps a sample project, so you could play around with it and get the concept.

## 5. Implementation

This section describes the technical solutions I chose to manage, store, and deliver tokens to clients.

### Managing tokens with a web app

Tokenhost 3000 offers a web interface that lets you manage your tokens. It’s a Rails app running on Heroku. The data is stored in a Postgres database.

Overall, a fairly standard Rails setup that I came up with based on what I’d learned in Launch School, and by following the great Rails Guides.

The web app offers a bare bones interface that assumes you experiment and come up with your tokens elsewhere. Once you know what colors, spacing values, or whatever other sorts of tokens you want, you add them to Tokenhost 3000.

### A generic API

Everything you can do with your Tokenhost space using the web app can be done using the Tokenhost API.

Rails has a very straightforward way of structuring HTTP responses depending on the type of request. Every route can have a JSON alternative. Rails provides an easy way of returning either HTML or JSON based on that.

For example, you can send a **GET** HTTP request to retrieve the tokens for a particular list. Or send a **PATCH** request to update a token.

This creates potential for interoperability. You could build a tool that uses the Zeplin API to sync the style guide stored in Zeplin with Tokenhost. Or you could build a tool that processes Tokenhost tokens; imagine you define one color, and then run a process that creates a bunch of new tokens that derive their value from the original.

### Real time delivery with a WebSocket

Real time delivery of tokens as they change is ensured with Rails Action Cable channels. Action Cable uses the WebSocket protocol under the hood. Clients can subscribe to those sockets, and receive updates.

The Tokenhost Widget included in the demo uses just that. When you load a page that includes the widget, it first uses the generic API to fetch the latest tokens. After that, any changes to tokens on the Tokenhost side are broadcast to the widget using Action Cable channels.

Action Cable uses Redis as a transient data store to ensure the content is synced across all the instances of the web app.

Any update to the space is reflected in the Widget immediately.

Using the Widget is simple. You include a provided script tag in your HTML markup, and it takes care of rendering the widget and connecting to your Tokenhost space. The script tag includes a few custom data attributes that are used to configure the script.

### Offline preview with the Tokenhost Widget

The Tokenhost Widget uses the latest available version of the tokens — even if the network is down.

This is because once the tokens are fetched with the API or received via a WebSocket, they’re stored in the browser’s local storage.

This lets you keep using the widget if Tokenhost goes down, or if you’re offline. And it limits the amount of requests made to Tokenhost.

Only one request is made when the page loads, and then all new data is delivered through a WebSocket. All new data is synced to local storage, and used to update the styles on the page.

### Static delivery with CSS

Tokenhost exposes every list of tokens as a separate CSS file you can link to in your HTML. Any time you change one of your tokens, the CSS file is regenerated.

This is a good option if you don’t want to execute any extra JavaScript, or if you don’t want to let people change the active token list in the Widget.

The CSS generation is triggered on any change to any token related to a particular list.

First, a string representation of the CSS is created. Then, a StringIO object is instantiated using the string. Lastly, the StringIO object is attached to the List Rails model.

The process of attaching the file to the List model is handled by Rails Active Storage, which then takes care of uploading the file to an Amazon S3 bucket.

## 6. Challenges

### Demonstrating value immediately

I really wanted to let people play around with tokens and see them instantly applied to a page.

Writing software to let people do that was one thing. Letting them immediately _feel_ the benefits was another thing entirely.

I’d need to “close the loop”. You’d have to be able to visit the demo page without any particular knowledge or available time and still be able to experience the whole thing.

So I decided I would not just have an API delivering design tokens, but also built a sample client that consumed the API and applied the tokens in a sample page.

In retrospect, this significantly increased the surface area of the problem I was dealing with. It meant I now had less time to dedicate to structuring or testing the API itself.

The trade-off of focusing on delivering this broader experience was that I had less time to polish everything to the extent that I wanted to in those six weeks.

As much as my inner critic hates to admit it, I think it was a good decision. And being forced into weighing these trade-offs in the first place was a good example of how real life product decisions have to be made sometimes.

### Performance

Every time someone clicks the **Try Demo** button, a new Tokenhost space is created just for them to experiment with.

And every time a new space is created, 3 sample token lists with a total of 50 tokens get created so they have something to experiment with immediately.

That’s a non-insignificant amount of work to do for every new space. Worse, I would initially execute an Active Record Callback to generate the CSS file every time a token record got created, updated, or destroyed.

This caused an unnecessary load on the server, so I had to find a workaround. I ended up generating the CSS conditionally, so now the CSS is generated once, after all the sample tokens are created for each list.

That made things faster. Probably fast enough for the purposes of showcasing this demo.

Another way to improve response times would be to create just the space record, return a response, and enqueue the sample list and token creation as background jobs. Once the background job got done, we could update the space page and display the sample content.

## 7. Future

- make token types more meaningful (for example, store the Red, Green, Blue, and Alpha components separately to allow for precise future manipulation)
- use category names as prefixes for token names (so all colors get a “color-” prefix)
- more direct token value affordances (color picker, sliders, etc.)
- tokens derivatives (tokens getting their value from another token)
- make it easier to figure out which elements on the page use which tokens so you know what to edit

## 8. References

### Design Tokens

#### [Using Design Tokens with the Lightning Design System](https://www.youtube.com/watch?v=wDBEc3dJJV8)

Great talk on YouTube on how design tokens were used at Salesforce.

#### [Design Tokens W3C Community Group](https://github.com/design-tokens/community-group)

The official _Design Tokens W3C Community Group_ repository for the design tokens specification. A number of people are trying to agree on a common standard for design tokens to increase interoperability between tools and processes.

### Design APIs

#### [Design APIs: the evolution of design systems](https://matthewstrom.com/writing/design-apis/)

Good introductory article on the concept of delivering aspects of a design using APIs.

#### [Zeplin API](https://docs.zeplin.dev/reference)

Zeplin launched their API in early 2020. You can grab anything you store in Zeplin and use it however you like.

### Custom CSS properties AKA CSS variables

#### [Lea Verou - CSS Variables: var(--subtitle);](https://www.youtube.com/watch?v=2an6-WVPuJU)

Another great YouTube talk on the applications of CSS variables.

#### [CSS Custom Properties and Theming](https://css-tricks.com/css-custom-properties-theming)

A nice, gentle intro to CSS variables from CSS Tricks.

#### [Custom properties on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
