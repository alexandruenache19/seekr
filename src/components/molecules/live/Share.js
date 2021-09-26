import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Typography, Colors, Wizard, Card} from 'react-native-ui-lib';
import Share from 'react-native-share';
import {ButtonWithTextIcon, ButtonWithIcon, Icon} from '_atoms';
import {ItemDetailsDialog} from '_molecules';

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
        this.props.callback();
        break;
    }
  }

  completeAddItem() {
    const {activeIndex} = this.state;
    this.setState({activeIndex: activeIndex + 1});
  }

  renderSection() {
    const {activeIndex, copied} = this.state;
    switch (activeIndex) {
      case 0:
        return <View />;
      case 1:
        return <View />;
      case 2:
        return (
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
              padding: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text style={{...Typography.text50}}>Invite others</Text>
              <ButtonWithTextIcon
                containerStyle={{
                  justifyContent: 'space-between',
                }}
                textStyle={{
                  ...Typography.text80,
                  color: Colors.black,
                }}
                textContainerStyle={{
                  padding: 5,
                }}
                iconType="Feather"
                iconName={copied ? 'check-square' : 'copy'}
                iconSize={26}
                iconColor={Colors.black}
                iconAfterText
                onPress={this.copy}
                text={copied ? 'Copied' : 'www.seekr.io/maria'}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <ButtonWithIcon
                iconType={'FontAwesome'}
                iconName={'facebook'}
                iconColor={'#4267B2'}
                iconSize={30}
              />
              <ButtonWithIcon
                iconType={'FontAwesome'}
                iconName={'whatsapp'}
                iconColor={'#25D366'}
                iconSize={30}
              />
              <ButtonWithIcon
                iconType={'FontAwesome'}
                iconName={'twitter'}
                iconColor={'#1DA1F2'}
                iconSize={30}
              />
              <ButtonWithIcon
                iconType={'FontAwesome'}
                iconName={'instagram'}
                iconColor={'#C13584'}
                iconSize={30}
              />
              <ButtonWithTextIcon
                containerStyle={{
                  justifyContent: 'space-between',
                  borderRadius: 10,
                  backgroundColor: '#282B28',
                  paddingHorizontal: 10,
                }}
                textStyle={{
                  ...Typography.text70M,
                  color: Colors.white,
                }}
                textContainerStyle={{
                  padding: 5,
                }}
                iconType={'FontAwesome'}
                iconName={'share'}
                iconColor={Colors.white}
                iconSize={24}
                iconAfterText
                // onPress={this.handleShare}
                text="more"
              />
            </View>
          </View>
        );
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
        text = 'Get Live';
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

    return (
      <View style={styles.container}>
        {activeIndex !== 2 && (
          <Wizard
            containerStyle={{backgroundColor: '#FFF', borderRadius: 10}}
            activeIndex={activeIndex}>
            <Wizard.Step state={this.getStepState(0)} label={'Check camera'} />
            <Wizard.Step
              state={this.getStepState(1)}
              label={'Add First Item'}
            />
            <Wizard.Step state={this.getStepState(2)} label={'Share event'} />
          </Wizard>
        )}

        {this.renderCurrentStep()}

        <ItemDetailsDialog
          callback={this.completeAddItem}
          ref={r => (this.dialog = r)}
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
