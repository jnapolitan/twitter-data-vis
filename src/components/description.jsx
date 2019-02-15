import React from 'react';

const Description = () => (
  <div className='info-panel'>
    <h3>What is this?</h3>
    <p>This project uses Twitter's Stream API, D3, and sentiment analysis to visualize how people are talking about particular topics.</p>
    <p>Enter a topic, and as people tweet about that topic you will see a few different visualizations.</p>
    <p><span className='red'><strong>Red</strong></span> indicates negative sentiment.</p>
    <p><span className='green'><strong>Green</strong></span> indicates positive sentiment.</p>
    <p><span className='gray'><strong>Gray</strong></span> indicates neutral sentiment.</p>
    <h4>*Please note*</h4>
    <p>Twitter's Stream API only offers a limited number of connections. If the app doesn't appear to be working, please try again later!</p>
  </div>
)

export default Description;