import React, { Component } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView } from 'react-native'
import { Typography, Wizard, Card } from 'react-native-ui-lib'
import LinearGradient from 'react-native-linear-gradient'

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
        this.setState({
          complete: false
        }, () => {
          this.props.callback && this.props.callback()
        })
        break
    }
  }

  completeAddItem () {
    const { activeIndex } = this.state
    if (activeIndex === 1) {
      this.setState({ complete: true, activeIndex: 2 })
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
      <Card
        onPress={this.goToNextStep}
        style={{
          ...styles.cardContainer,
          padding: complete ? 0 : 20
        }}
      >
        {complete ? (
          <LinearGradient
            colors={['#6A4087', '#C94573']}
            // start={{ x: 0, y: 0 }}
            // end={{ x: 0, y: 1 }}
            useAngle
            angle={270}
            angleCenter={{ x: 0.7, y: 0.5 }}
            style={{
              ...styles.cardContainer,
              width: '100%'
            }}
          >
            <Text style={{ ...styles.buttonText, color: '#FFF' }}>{text}</Text>
            <Icon
              iconType='Feather'
              iconName={iconName}
              iconColor='#FFF'
              iconSize={28}
            />
          </LinearGradient>
        ) : (
          <>
            <Text style={styles.buttonText}>{text}</Text>
            <Icon
              iconType='Feather'
              iconName={iconName}
              iconColor='#000'
              iconSize={28}
            />
          </>
        )}
      </Card>
    )
  }

  render () {
    const { complete, activeIndex } = this.state
    const { eventInfo } = this.props

    return (
      <View style={{
        ...styles.container,
        padding: complete ? 0 : 20,
        paddingBottom: 20,
        backgroundColor: complete ? 'transparent' : '#282B28',
        marginTop: complete ? 20 : 15
      }}
      >
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

        {!complete ? (
          <Wizard
            containerStyle={{
              backgroundColor: 'transparent',
              borderRadius: 15,
              // flex: 1,
              height: 60,
              padding: 0,
              marginBottom: 20
            }}
            activeConfig={{
              color: '#000',
              circleColor: '#FFFFFF'
            }}
            activeIndex={activeIndex}
          >
            <Wizard.Step
              circleColor='#FFF'
              color='#000'
              circleSize={30}
              circleBackgroundColor='#FFFFFF'
              indexLabelStyle={{ ...Typography.text60, color: '#000' }}
              labelStyle={{ ...Typography.text70, color: '#FFF' }}
              state={this.getStepState(1)}
              label='What will you sell?'
            />
            <Wizard.Step
              circleColor='#FFF'
              color='#000'
              circleSize={30}
              circleBackgroundColor='#FFFFFF'
              indexLabelStyle={{ ...Typography.text60, color: '#000' }}
              labelStyle={{ ...Typography.text70, color: '#FFF' }}
              state={this.getStepState(2)}
              label='Invite others'
            />
          </Wizard>
        ) : null}

        {this.renderCurrentStep()}
      </View>
    )
  }
}

export default PreviewActionsSection

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#282B28',
    width: '100%',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    justifyContent: 'space-between'
    // alignItems: 'center',
  },
  buttonText: {
    ...Typography.text50
  },
  cardContainer: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
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
