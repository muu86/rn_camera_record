/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

class App extends PureComponent {
  render() {
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
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takeVideo.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.stopRecord} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> STOP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takeVideo = async () => {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync();
  
        if (promise) {
          this.setState({ isRecording: true });
          const data = await promise;
          
          console.log(data.uri)
          // data 를 api 로 전송
          const formData = new FormData();
          formData.append('data', {
            name: "video_upload",
            type: 'video/mp4',
            uri: data.uri
          })
          
          try {
            await fetch('http://121.138.83.4:80/uploads', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            })
          } catch (e) {
            console.log(e);
          }
          

          this.setState({ isRecording: false });
          console.warn('takeVideo', data);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  stopRecord = async () => {
    if (this.state.isRecording == true) {
      this.camera.stopRecording();
    }
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default App;
