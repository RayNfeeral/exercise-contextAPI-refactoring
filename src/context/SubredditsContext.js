import React, { createContext } from 'react';

import { getPostsBySubreddit } from '../services/redditAPI';

export const SubredditContext = createContext({});

export class SubredditProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postsBySubreddit: {
        frontend: {
          shouldRefreshSubreddit: false,
          isFetching: false,
        },
        reactjs: {
          shouldRefreshSubreddit: false,
          isFetching: false,
        },
      },
      selectedSubreddit: 'reactjs',
    };
  }

  fetchPosts = (subreddit) => {
    this.requestPosts(subreddit);

    return getPostsBySubreddit(subreddit).then(
      (posts) => this.receivePostsSuccess(subreddit, posts),
      (error) => this.receivePostsFailure(subreddit, error.message),
    );
  }

  receivePostsSuccess = (subreddit, json) => {
    this.setState(({ postsBySubreddit }) => ({
      postsBySubreddit: {
        ...postsBySubreddit,
        [subreddit]: {
          ...postsBySubreddit[subreddit],shouldRefreshSubreddit: false,
          items: json.data.children.map((child) => child.data),
          isFetching: false,
          lastUpdated: Date.now(),
        }
      }
    }));
  }

  receivePostsFailure = (subreddit, error) => {
    this.setState(({ postsBySubreddit }) => ({
      postsBySubreddit: {
        ...postsBySubreddit,
        [subreddit]: {
          ...postsBySubreddit[subreddit],
          shouldRefreshSubreddit: false,
          error,
          items: [],
          isFetching: false,
        }
      }
    }));
  }

  refreshSubreddit = (subreddit) => {
    this.setState(({ postsBySubreddit }) => ({
      postsBySubreddit: {
        ...postsBySubreddit,
        [subreddit]: {
          ...postsBySubreddit[subreddit],
          shouldRefreshSubreddit: true,
        }
      }
    }));
  }

  requestPosts = (subreddit) => {
    this.setState(({ postsBySubreddit }) => ({
      postsBySubreddit: {
        ...postsBySubreddit,
        [subreddit]: {
          ...postsBySubreddit[subreddit],
          shouldRefreshSubreddit: false,
          isFetching: true,
        }
      }
    }));
  }

  selectSubreddit = (subreddit) => {
    this.setState({
      selectedSubreddit: subreddit,
    });
  }

  shouldFetchPosts = (subreddit) => {
    const { postsBySubreddit } = this.state;
    const posts = postsBySubreddit[subreddit];
  
    if (!posts.items) return true;
    if (posts.isFetching) return false;
    return posts.shouldRefreshSubreddit;
  };

  fetchPostsIfNeeded = (subreddit) => {
    this.shouldFetchPosts(subreddit) && this.fetchPosts(subreddit);
  }

  componentDidUpdate(_, prevState) {
    const { state } = this;

    if (prevState.selectedSubreddit !== state.selectedSubreddit) {
      const { selectedSubreddit } = state;
      this.fetchPostsIfNeeded(selectedSubreddit);
    }
  }

  render() {
    const { children } = this.props;
    const { fetchPostsIfNeeded, refreshSubreddit, requestPosts, selectSubreddit } = this;

    return (
      <SubredditContext.Provider
        value={{
          ...this.state,
          fetchPostsIfNeeded,
          refreshSubreddit,
          requestPosts,
          selectSubreddit,
        }}
      >
        { children }
      </SubredditContext.Provider>
    );
  };
}
