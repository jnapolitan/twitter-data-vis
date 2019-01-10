# twitter-data-vis - visualizing real-time sentiment by topic on Twitter

## Background and Overview

Twitter is a useful mechanism to get a pulse on a topic of conversation. For example, what are the most popular Tweets around the #MeToo movement? What are people in South America saying about #Trump?

The goal of this project is to parse and visualize location-based sentiment around conversation topics happening on Twitter; not just using Tweet content and attributes (like geolocation), but also using sentiment analysis of the text. Through this, I hope to illustrate the deltas in overall sentiment regarding different topics around the world that might not otherwise be obvious.

## Functionality and MVP

Through TwitterDataVis, users will be able to:

- [ ] Enter a string as a topic or hashtag search query
- [ ] See a live stream of Tweets pertaining to that topic (will be sampled if frequency is too high)
- [ ] See a world map visualizing the location and sentiment for each Tweet as it happens
- [ ] Zoom in and out of the map for more detailed sentiment visualization

## Wireframes

![wireframe](https://github.com/jnapolitan/twitter-data-vis/blob/master/assets/wireframe.png)

## Architecture and Technologies

This project will be implemented using:

- Vanilla JavaScript and Node.js for overall structure
- Twitter's Stream API that provides a live stream of Tweets based on a topic or "trend"
- D3.js for data visualization and interactivity
- Sentiment - AFINN-based sentiment analysis for Node.js

## Implementation Timeline

#### Day 1
- [ ] Set up project skeleton and test Twitter Stream API calls in Postman
- [ ] Read up on D3 and practice simple visualizations
- [ ] Research similar projects on Github

#### Day 2
- [ ] Continue learning and experimenting with D3
- [ ] Practice visualizing data being pulled from Twitter (hard code)

#### Day 3
- [ ] Configure user input to create new Twitter Stream API call
- [ ] Parse and organize relevant data on frontend
- [ ] Finalize visualization strategy (what maps/chart views would be most beneficial)

#### Day 4
- [ ] Begin basic visualization of incoming data with D3
- [ ] Refine visualizations to update when new data is received

#### Day 5
- [ ] Polis final map and chart animations to represent incoming data
- [ ] Add interactivity to explore data at different levels (continent, country, state)

## Bonus features
- [ ] Add a sampled stream of Tweets for the current query to provide more color around sentiment
- [ ] Add additional beneficial charts and visualizations not originally planned for




