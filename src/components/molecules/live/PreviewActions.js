import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  Typography,
  Colors,
  Wizard,
  Card,
  MaskedInput,
} from 'react-native-ui-lib';
import Share from 'react-native-share';
import {ButtonWithTextIcon, ButtonWithIcon, Icon} from '_atoms';
import {ItemDetailsDialog, ShareDialog} from '_molecules';
// import Toast from 'react-native-toast-message';

class ActionsSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      activeIndex: 0,
      complete: false,
    };
    this.copy = this.copy.bind(this);
    this.goToNextStep = this.goToNextStep.bind(this);
    this.completeAddItem = this.completeAddItem.bind(this);
    this.renderCurrentStep = this.renderCurrentStep.bind(this);
    this.renderSection = this.renderSection.bind(this);
  }

  copy() {
    this.setState({
      copied: true,
    });
  }

  getStepState(index: number) {
    const {activeIndex} = this.state;
    let state = Wizard.States.ENABLED;

    if (activeIndex > index - 1) {
      state = Wizard.States.COMPLETED;
    }

    return state;
  }

  goToNextStep() {
    const {activeIndex} = this.state;
    switch (activeIndex) {
      case 0:
        this.setState({activeIndex: activeIndex + 1});
        break;
      case 1:
        this.dialog.showDialog();
        break;
      case 2:
        this.shareDialog.showDialog();
        break;
      case 3:
        this.props.callback();
        break;
    }
  }

  completeAddItem() {
    const {activeIndex} = this.state;
    this.setState({activeIndex: activeIndex + 1});
    // Toast.show({
    //   type: 'success',
    //   text1: 'Copied',
    //   text2: 'Coppied to your clipboard',
    //   position: 'bottom',
    // });
  }

  renderSection() {
    const {activeIndex, copied} = this.state;
    switch (activeIndex) {
      case 0:
        return <View />;
      case 1:
        return <View />;
      case 2:
        return <View />;
      case 3:
        return <View />;
      default:
        break;
    }
  }

  renderCurrentStep() {
    const {activeIndex, copied} = this.state;

    let text = 'Next';
    let iconName = 'arrow-right';
    switch (activeIndex) {
      case 0:
        text = 'All Good';
        break;
      case 1:
        text = 'Add First Item';
        iconName = 'plus-square';
        break;
      case 2:
        text = 'Invite others';
        iconName = 'send';
        break;
      case 3:
        text = 'Start live';
        iconName = 'video';
        break;
    }

    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        {this.renderSection()}

        <Card
          // useNative
          enableShadow
          borderRadius={10}
          elevation={20}
          onPress={this.goToNextStep}
          activeScale={0.96}
          backgroundColor="#282B28"
          style={styles.cardContainer}>
          <Text style={{...Typography.text50, color: '#FFF'}}>{text}</Text>
          <Icon
            iconType={'Feather'}
            iconName={iconName}
            iconColor={'#FFF'}
            iconSize={30}
          />
        </Card>
      </View>
    );
  }

  render() {
    const {copied, activeIndex, complete} = this.state;
    const {eventItem} = this.props;

    return (
      <View style={styles.container}>
        <Wizard
          containerStyle={{backgroundColor: '#FFF', borderRadius: 10}}
          activeIndex={activeIndex}>
          <Wizard.Step
            circleColor="#000"
            color="#000"
            circleSize={22}
            labelStyle={{...Typography.text60H}}
            state={this.getStepState(0)}
            label={'Check camera'}
          />
          <Wizard.Step
            circleColor="#000"
            color="#000"
            circleSize={22}
            labelStyle={{...Typography.text60H}}
            state={this.getStepState(1)}
            label={'Add First Item'}
          />
          <Wizard.Step
            circleColor="#000"
            color="#000"
            circleSize={22}
            labelStyle={{...Typography.text60H}}
            state={this.getStepState(2)}
            label={'Invite others'}
          />
        </Wizard>

        {this.renderCurrentStep()}

        <ItemDetailsDialog
          callback={this.completeAddItem}
          ref={r => (this.dialog = r)}
        />

        <ShareDialog
          eventItem={eventItem}
          callback={this.completeAddItem}
          ref={r => (this.shareDialog = r)}
        />
      </View>
    );
  }
}

export default ActionsSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 20,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  cardContainer: {
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});
