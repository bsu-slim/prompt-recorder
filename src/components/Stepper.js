import React from 'react';
import { withRouter } from 'react-router-dom';
import { Step } from 'semantic-ui-react';

class Stepper extends React.Component {
  onClick = (e, target) => {
    this.props.history.push(target.value);
  }

  render() {
    let steps = this.props.steps;
    let items = [];
    for(const [index, value] of steps.entries()) {
      switch(value.state) {
        case "completed":
          items.push(<Step completed key={index} description={value.description} title={value.title} onClick={this.onClick} value={value.href} />);
          break;
        case "active":
          items.push(<Step active key={index} description={value.description} title={value.title} onClick={this.onClick} value={value.href}/>);
          break;
        default:
          items.push(<Step disabled key={index} description={value.description} title={value.title} onClick={this.onClick} value={value.href} />);
          break;
      }
    }
    return (
      <Step.Group widths={steps.length} size='mini' ordered>
        {items}
      </Step.Group>
    );
  }
}

export default withRouter(Stepper);