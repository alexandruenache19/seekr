import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
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
    const {user, eventItem} = this.props;
    const {info} = user;

    if (isPreview) {
      return (
        <PreviewLive info={info} onGoLive={this.goLive} eventItem={eventItem} />
      );
    }

    return <Live info={info} eventItem={eventItem} />;
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LiveScreen);
