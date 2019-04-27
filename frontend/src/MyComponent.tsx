import React from 'react';

type MyProps = { };
type MyState = { 
  error: {message: string} | null,
  isLoaded: boolean,
  id: string
 };

export class MyComponent extends React.Component<MyProps, MyState> {
    constructor(props: any) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        id: ""
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
  
    render() {
      const { error, isLoaded, id } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <ul>
            <li>{id}</li>
          </ul>
        );
      }
    }
  }