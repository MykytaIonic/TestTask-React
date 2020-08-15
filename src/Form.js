import React, { Component } from 'react';
import './Form.css';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

const GET_LAUNCHES = gql`
  query launchList($launch_date_local: Date) {
    launchesPast(find: {launch_date_local: $launch_date_local}) {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        flickr_images
      }
      rocket {
        rocket_name
      }
    }
  }
`;

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 0,
      launchesPast: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleYearChange(event) {
    console.log(event.target.value);
    if (event.target.value.length <= 4) {
      this.setState({ year: event.target.value });
    }
  }

  render() {
    return (
      <div className="container">
       <form className="input_data" onSubmit={this.handleSubmit}>
         <label className="main_text">Enter the launch year</label>
         <br/>
         <input
            type="number"
            value={this.state.year}
            onChange={this.handleYearChange}
          />
          <br/>
          <ApolloConsumer>
          {client => (
          <button onClick={async () => {
                    const { data } = await client.query({
                      query: GET_LAUNCHES,
                      variables: { launch_date_local: this.state.year }
                    });
                    this.setState({ launchesPast: data });
                    console.log(this.state.launchesPast);
                    }}>Send
          </button>
           )}
          </ApolloConsumer>
        </form>
        <div className="launches_container">
         {this.state.launchesPast &&
          this.state.launchesPast.launchesPast &&
          this.state.launchesPast.launchesPast.map((item, index) => {
            return (
              <div key={index}>
                <p className="text_items">{`${item.mission_name}  ${item.launch_date_local}  ${item.launch_site['site_name_long']} ${item.rocket['rocket_name']}`}</p>
                  {item.links &&
                    item.links.flickr_images &&
                     item.links.flickr_images.map((item, index) => {
                    return (
                      <span key={index}>
                        <img className="rocket_image" src={item} alt="rocket"/>
                      </span>
                    )
                  })}
              </div>
            );
         })}
        </div>
      </div>
   );
 }
}
