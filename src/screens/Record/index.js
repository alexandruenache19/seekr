import React, {PureComponent} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ProgressCircle from 'react-native-progress-circle';
import S3 from 'aws-sdk/clients/s3';
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';

import {Icon} from '_atoms';

class CameraScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      time: 0,
      maxLength: 30,
      recorded: false,
      recordedData: null,
      cameraType: RNCamera.Constants.Type.back,
    };

    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.uploadVideoS3 = this.uploadVideoS3.bind(this);
  }

  async startRecording() {
    this.camera
      .recordAsync({maxDuration: 15})
      .then(data => {
        this.setState({
          recorded: true,
          recordedData: data,
        });
        this.uploadVideoS3(data);
      })
      .catch(err => console.error(err));
    setTimeout(() => {
      this.startTimer();
      this.setState({
        isRecording: true,
        recorded: false,
        recordedData: null,
        time: 0,
      });
    });
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      const time = this.state.time + 1;
      this.setState({time});
      if (this.state.maxLength > 0 && time >= this.state.maxLength) {
        this.stopRecording();
      }
    }, 1000);
  };

  stopTimer = () => {
    if (this.timer) clearInterval(this.timer);
  };

  switchCamera = () => {
    let type =
      this.state.cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back;
    if (!this.state.isRecording) {
      this.setState({cameraType: type});
    }
  };

  async stopRecording() {
    if (this.camera) {
      this.stopTimer();
      this.camera.stopRecording();
      this.setState({
        isRecording: false,
        time: 0,
      });
    }
  }

  async uploadVideoS3(file) {
    this.setState({uploading: true});
    const s3bucket = new S3({
      accessKeyId: 'AKIAZRH5PIV3F7DAMRZ2',
      secretAccessKey: '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',
      Bucket: 'event-preview',
      signatureVersion: 'v4',
    });

    let contentType = 'video/mp4';
    let contentDeposition = 'inline;filename="' + 'videoFIleName' + '"';
    const base64 = await fs.readFile(file.uri, 'base64');
    const arrayBuffer = decode(base64);
    const params = {
      Bucket: 'event-preview',
      Key: 'file.name',
      Body: arrayBuffer,
      ContentDisposition: contentDeposition,
      ContentType: contentType,
    };

    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log('error in callback', err);
      }
      console.log('success');
      this.setState({uploading: false});
      console.log('Respomse URL : ' + data.Location);
      this.props.callback(data.Location);
    });
  }

  render() {
    const {isRecording, time, uploading} = this.state;
    console.log(time);
    // if (uploading) {
    // }
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 40,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={isRecording ? this.stopRecording : this.startRecording}
            style={styles.capture}>
            <ProgressCircle
              percent={(time / 15) * 100}
              radius={40}
              borderWidth={6}
              color="red"
              shadowColor="#FFF"
              bgColor={isRecording ? '#FFF' : 'red'}>
              {isRecording && (
                <Icon
                  iconType={'FontAwesome'}
                  iconName={'square'}
                  iconColor={'red'}
                  iconSize={40}
                />
              )}
            </ProgressCircle>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
  },
  capture: {
    borderRadius: 5,
  },
});

export default CameraScreen;
