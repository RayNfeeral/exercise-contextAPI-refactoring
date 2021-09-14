// src/App.js
import React, { Component } from 'react';

import { SubredditContext } from './context/SubredditsContext';
import Posts from './components/Posts';
import Selector from './components/Selector';

class App extends Component {
  componentDidMount() {
    const { selectedSubreddit, fetchPostsIfNeeded } = this.context;
    fetchPostsIfNeeded(selectedSubreddit);
  }

  handleRefreshClick(event) {
    event.preventDefault();

    const { selectedSubreddit, refreshSubreddit, fetchPostsIfNeeded } = this.context;
    refreshSubreddit(selectedSubreddit);
    fetchPostsIfNeeded(selectedSubreddit);
  }

  renderLastUpdatedAt() {
    const { selectedSubreddit, postsBySubreddit } = this.context;
    const { lastUpdated } = postsBySubreddit[selectedSubreddit];

    return <span>{`Last updated at ${new Date(lastUpdated).toLocaleTimeString()}.`}</span>;
  }

  renderRefreshButton() {
    const { selectedSubreddit, postsBySubreddit } = this.context;
    const { isFetching } = postsBySubreddit[selectedSubreddit];

    return (
      <button
        type="button"
        onClick={(event) => this.handleRefreshClick(event)}
        disabled={isFetching}
      >
        Refresh
      </button>
    );
  }

  render() {
    const { selectedSubreddit, postsBySubreddit, selectSubreddit } = this.context;
    const { isFetching, lastUpdated, items: posts = [] } = postsBySubreddit[selectedSubreddit];

    const isEmpty = posts.length === 0;

    return (
      <div>
        <Selector
          value={selectedSubreddit}
          onChange={(nextSubreddit) => selectSubreddit(nextSubreddit)}
          options={Object.keys(postsBySubreddit)}
        />
        <div>
          {lastUpdated && this.renderLastUpdatedAt()}
          {this.renderRefreshButton()}
        </div>
        {isFetching && <h2>Loading...</h2>}
        {!isFetching && isEmpty && <h2>Empty.</h2>}
        {!isFetching && !isEmpty && <Posts posts={posts} />}
      </div>
    );
  }
}

App.contextType = SubredditContext;

export default App;
