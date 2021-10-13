import React, { Component } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView } from 'react-native'
import { Typography, Wizard, Card } from 'react-native-ui-lib'

import { Icon } from '_atoms'
import { ItemDetailsDialog, ShareDialog } from '_molecules'

class PreviewActionsSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeIndex: 0,
      complete: false
    }

    this.goToNextStep = this.goToNextStep.bind(this)
    this.completeAddItem = this.completeAddItem.bind(this)
    this.renderCurrentStep = this.renderCurrentStep.bind(this)
    this.getStepState = this.getStepState.bind(this)
  }

  getStepState (index) {
    const { activeIndex, complete } = this.state
    let state = Wizard.States.ENABLED

    if (activeIndex > index - 1 || complete) {
      state = Wizard.States.COMPLETED
    }

    return state
  }

  goToNextStep () {
    const { userInfo } = this.props
    const { activeIndex } = this.state

    switch (activeIndex) {
      // case 0:
      //   this.setState({ activeIndex: activeIndex + 1 })
      //   break
      case 0:
        this.dialog.showDialog()
        break
      case 1:
        this.shareDialog.showDialog()
        break
      case 2:
        this.props.callback()
        break
    }
  }

  completeAddItem () {
    const { activeIndex } = this.state
    if (activeIndex == 2) {
      this.setState({ complete: true, activeIndex: 3 })
    } else {
      this.setState({ activeIndex: activeIndex + 1 })
    }
  }

  renderCurrentStep () {
    const { activeIndex, complete } = this.state

    let text = 'Next'
    let iconName = 'arrow-right'

    if (complete) {
      text = 'Go live'
      iconName = 'video'
    } else {
      switch (activeIndex) {
        // case 0:
        //   text = 'All Good'
        //   iconName = 'arrow-right'
        //   break
        case 0:
          text = 'Add Product'
          iconName = 'plus'
          break
        case 1:
          text = 'Share event'
          iconName = 'send'
          break
      }
    }

    return (
      <Card onPress={this.goToNextStep} style={styles.cardContainer}>
        <Text style={styles.buttonText}>{text}</Text>
        <Icon
          iconType='Feather'
          iconName={iconName}
          iconColor='#000'
          iconSize={28}
        />
      </Card>
    )
  }

  render () {
    const { copied, activeIndex } = this.state
    const { eventInfo } = this.props

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <ItemDetailsDialog
            eventInfo={eventInfo}
            callback={this.completeAddItem}
            ref={r => (this.dialog = r)}
          />

          <ShareDialog
            eventInfo={eventInfo}
            callback={this.completeAddItem}
            ref={r => (this.shareDialog = r)}
          />
        </KeyboardAvoidingView>

        <Wizard
          containerStyle={{
            backgroundColor: '#FFF',
            borderRadius: 10,
            flex: 1
          }}
          activeConfig={{
            color: '#000',
            circleColor: '#000'
          }}
          activeIndex={activeIndex}
        >
          {/* <Wizard.Step
            circleColor='#FFF'
            color='#FFF'
            circleSize={30}
            circleBackgroundColor='#000'
            indexLabelStyle={{ ...Typography.text60, color: '#FFF' }}
            labelStyle={Typography.text60}
            state={this.getStepState(0)}
            label='Check camera'
          /> */}
          <Wizard.Step
            circleColor='#FFF'
            color='#FFF'
            circleSize={30}
            circleBackgroundColor='#000'
            indexLabelStyle={{ ...Typography.text60, color: '#FFF' }}
            labelStyle={Typography.text70}
            state={this.getStepState(1)}
            label='What will you sell?'
          />
          <Wizard.Step
            circleColor='#FFF'
            color='#FFF'
            circleSize={30}
            circleBackgroundColor='#000'
            indexLabelStyle={{ ...Typography.text60, color: '#FFF' }}
            labelStyle={Typography.text70}
            state={this.getStepState(2)}
            label='Invite audience'
          />
        </Wizard>

        {this.renderCurrentStep()}
      </View>
    )
  }
}

export default PreviewActionsSection

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    justifyContent: 'space-between'
    // alignItems: 'center',
  },
  buttonText: {
    ...Typography.text50,
    color: '#000'
  },
  cardContainer: {
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  button: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  }
})
