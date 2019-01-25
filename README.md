# Twitter Data Vis
#### Visualizing real-time sentiment by topic on Twitter

## Background and Overview

Twitter is the mainstream platform for getting a pulse on not only what's happening in the world, but how people are talking about different current current events and happenings.

The goal of this project is to parse and visualize sentiment around conversation topics happening on Twitter; not just using Tweet content and other attributes (such as geolocation), but also using sentiment analysis of the text. Through this, I hope to illustrate the deltas in overall sentiment regarding different topics around the world that might not otherwise be obvious.

## Functionality and MVP

Through Twitter Data Vis, users are able to:

- [ ] Enter a topic string as a search query
- [ ] See a world map visualizing the location and sentiment for each Tweet as it happens

## Wireframes

![wireframe](https://github.com/jnapolitan/twitter-data-vis/blob/master/assets/wireframe.png)

## Architecture and Technologies

- React for the frontend
- Node.js and Express.js for the backend/server
- Twitter's Stream API and Socket.io to maintain incoming data
- Twitter (NPM module) to handle API config and connections
- D3.js for data visualization
- Sentiment (NPM module) for AFINN-165 sentiment analysis on text


