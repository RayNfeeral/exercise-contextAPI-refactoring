import React, { createContext } from 'react';

export const CarsContext = createContext({});

export class CarsProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: {
        red: false,
        blue: false,
        yellow: false,
      },
    };
  }

  moveCar = (car, side) => {
    this.setState(({ cars }) => ({
      cars: {
        ...cars,
        [car]: side,
      },
    }));
  }

  render() {
    const { children } = this.props;

    return (
      <CarsContext.Provider value={ { ...this.state, moveCar: this.moveCar } }>
        { children }
      </CarsContext.Provider>
    )
  }
}
