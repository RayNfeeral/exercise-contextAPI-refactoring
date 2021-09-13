import React, { createContext } from 'react';

export const TrafficContext = createContext({});

export class TrafficProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signal: { color: 'red' },
    };
  }

  changeSignal = (color) => {
    this.setState({
      signal: {
        color,
      }
    });
  }

  render() {
    const { children } = this.props;

    return (
      <TrafficContext.Provider value={ { ...this.state, changeSignal: this.changeSignal } }>
        { children }
      </TrafficContext.Provider>
    )
  }
}
