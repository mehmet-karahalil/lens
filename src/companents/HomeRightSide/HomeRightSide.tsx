import React, {useState, useEffect, useRef} from 'react';
import {Button, Image, Text, View, StyleSheet, Platform} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

interface HomeRightSideProps {
  responseImage: string | null;
  loading: boolean;
  setSourceImage: (image: string | null) => void;
}

const HomeRightSide = ({
  responseImage,
  loading,
  setSourceImage,
}: HomeRightSideProps) => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [cameraPreview, setCameraPreview] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);
  const [cameraDevice, setCameraDevice] = useState<'front' | 'back'>('back');

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermission);
    };
    requestPermissions();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();
      const uri =
      Platform.OS === 'android' ? `file://${photo.path}` : photo.path;
      setCameraPreview(uri);
      const base64Image = await RNFS.readFile(photo.path, 'base64');
      setSourceImage(base64Image);
    }
  };

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === cameraDevice);

  if (device == null) return <Text>Loading...</Text>;
  const SwichCamera = () => {
    if (cameraDevice == 'front') {
      setCameraDevice('back');
    } else {
      setCameraDevice('front');
    }
  };

  return (
    <View style={styles.allContainer}>
      {cameraPreview ? (
        <View style={styles.rightContainer}>
          <Image source={{uri: cameraPreview}} style={styles.image} />
          {responseImage !== null ? (
            <Image source={{uri: responseImage}} style={styles.image} />
          ) : (
            <View>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== plese choose the target"} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            <Text>{"<=== "} </Text>
            </View>
          )}
          <Button title="Take again" onPress={() => setCameraPreview(null)} />
        </View>
      ) : (
        <View style={styles.rightContainer}>
          <View style={styles.cameraContainer}>
            {cameraPermission !== null &&
            cameraPermission === ('granted' as CameraPermissionStatus) ? (
              <Camera
                ref={cameraRef}
                style={styles.preview}
                device={device}
                isActive={true}
                photo={true}
              />
            ) : (
              <Text>No access to camera</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Take Photo" onPress={takePhoto} />
            <Button title="Swich Camera" onPress={SwichCamera} />
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  allContainer: {
    width: '72%',
    padding: 10,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cameraContainer: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default HomeRightSide;
