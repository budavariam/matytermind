import React from 'react';

type MyProps = { };
type GameResponse = {
  goodGuess: number,
  goodColour: number,
  isOver: boolean
}

type MyState = { 
  error: {message: string} | null,
  isLoaded: boolean,
  id: string,
  lastResp: GameResponse,
 };

export class MyComponent extends React.Component<MyProps, MyState> {
    constructor(props: any) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        id: "",
        lastResp: {
          goodGuess: 0,
          goodColour: 0,
          isOver: false
        }
      };
    }
  
    componentDidMount() {
      fetch("/api/start")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              id: result.id
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }

    handleClick(id: string) {
      fetch('/api/guess', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          guess: [1,2,3,4]
        })
      })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            lastResp: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
  
    render() {
      const { error, isLoaded, id, lastResp } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <div>
            <button onClick={() => this.handleClick(id)}>{id}</button>
            <div>
              Last response: {lastResp.isOver ? "YAAY" : "Go on!"} {lastResp.goodColour} {lastResp.goodGuess}
            </div>
          </div>
        );
      }
    }
  }