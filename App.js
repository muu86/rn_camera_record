/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Video from 'react-native-video';

class App extends PureComponent {
  state = {
    isRecording: false,
    isUploaded: false,
  };

  render() {
    return this.state.isUploaded ? (
      <>
        {/* 레코드된 비디오를 보여주는 코드 */}
        {/* <Video
          source={{uri: 'http://121.138.83.4:80/static/output.mp4'}}
          ref={(ref) => {
            this.player = ref;
          }}
          controls={true}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          style={styles.backgroundVideo}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({isUploaded: false});
          }}
          style={styles.capture}>
          <Text>다시하기</Text>
        </TouchableOpacity>
        */}

        {/* 포즈 이미지를 보여주는 코드 */}
        <View style={{flex: 1}}>
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/0.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/1.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/2.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/3.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/4.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/5.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/6.png',
            }}
          />
          <Image
            source={{
              uri: 'http://121.138.83.4:80/static/output_images/7.png',
            }}
          />

          <TouchableOpacity
            onPress={() => {
              this.setState({isUploaded: false});
            }}
            style={styles.capture}>
            <Text>다시하기</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
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
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.takeVideo.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 14}}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.stopRecord} style={styles.capture}>
            <Text style={{fontSize: 14}}> STOP </Text>
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
          this.setState({isRecording: true});
          const data = await promise;

          console.log(data.uri);
          // data 를 api 로 전송
          const formData = new FormData();
          formData.append('data', {
            name: 'video_upload',
            type: 'video/mp4',
            uri: data.uri,
          });

          const result = await fetch('http://121.138.83.4:80/uploads', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          }).catch((error) => console.log(error));

          this.setState({isRecording: false});
          this.setState({isUploaded: true});
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
  };
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default App;
