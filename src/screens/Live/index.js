import React, {PureComponent} from 'react';
import {Live, PreviewLive} from '_organisms';

class LiveScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPreview: true,
    };

    this.goLive = this.goLive.bind(this);
  }

  goLive() {
    this.setState({isPreview: false});
  }

  render() {
    const {isPreview} = this.state;
    if (!isPreview) {
      return <PreviewLive onGoLive={this.goLive} />;
    }

    return <Live />;
  }
}

export default LiveScreen;
