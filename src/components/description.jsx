import React from 'react';

const Description = () => (
  <div className='info-panel'>
    <h3>What is this?</h3>
    <p>This project uses Twitter's Stream API, D3 geo visualization, and sentiment analysis to visualize how people are talking about particular subjects.</p>
    <p>Enter a subject, and as people tweet about that subject you will see dots appear on the map.</p>
    <p><span className='red'><strong>Red</strong></span> dots indicate negative sentiment.</p>
    <p><span className='green'><strong>Green</strong></span> dots indicate positive sentiment.</p>
    <p><span className='gray'><strong>Gray</strong></span> dots indicate neutral sentiment.</p>
    <p>The <strong>size</strong> of the dots indicate the severity of sentiment. The smaller the dot, the less severe the sentiment.</p>
    <h4>*Please note*</h4>
    <p>This is an ongoing project with more visualizations to come. If it seems like there aren't many (or any) Tweets being visualized, it's likely due to one of the following:</p>
    <ul>
      <li>Not as many Tweets are geo-tagged as you might think (and we're working on non-geotagged visualizations to fill the void).</li>
      <li>Twitter's free API (although a fantastic resource) can be somewhat limited.</li>
    </ul>
    <p>If you really want to see this project in action, type in "Trump" and let it run for a minute or two.</p>
  </div>
)

export default Description;