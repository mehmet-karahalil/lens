import React, {useState, useEffect, useRef} from 'react';
import {Button, Image, Text, View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, deleteFavorite } from '../../store/Favorites';

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
  const [acceptCameraPreview, setAcceptCameraPreview] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);
  const [cameraDevice, setCameraDevice] = useState<'front' | 'back'>('back');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | {
    uri: string | undefined;
  }>(null);
  const [shotModalVisible, setShotModalVisible] = useState(false);

  const openModal = (image: { uri: string | undefined }) => {
    setSelectedImage(image);
    setModalVisible(true);
  };




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
      setAcceptCameraPreview(uri);
      setShotModalVisible(true);
      const base64Image = await RNFS.readFile(photo.path, 'base64');
      setSourceImage(base64Image);
    }
  };

  const deniedPhoto = () => {
    setCameraPreview(null);
    setShotModalVisible(false);
  }



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






  const favorites = useSelector((state: any) => state.favorites.favorites);
  const dispatch = useDispatch();

  const itemExists = favorites.some(
    (favorite: {  uri: string | undefined  }) =>
      favorite.uri === selectedImage?.uri,
  );

  const handleSave = () => {
    if (selectedImage && selectedImage.uri) {
      dispatch(
        addFavorite(selectedImage?.uri || ''),
      );
      setModalVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedImage && selectedImage.uri) {
      dispatch(deleteFavorite(selectedImage.uri));
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.allContainer}>
      {acceptCameraPreview ? (
        <View style={styles.rightContainer}>
          <Image source={{uri: acceptCameraPreview}} style={styles.image} />
          {responseImage !== null ? (
          <TouchableOpacity style={styles.responseImageContainer} activeOpacity={1} onPress={() => openModal({uri: responseImage})}>
              <Image source={{uri: responseImage}} style={styles.responseImage} />
          </TouchableOpacity>
          ) : (
            <View>
              {loading ? (
                <Text style={styles.text}>Loading...</Text>
              ) : (
            <Text style={styles.text} >{"<=== plese choose the target"} </Text>
              )}
            </View>
          )}
          <View style={{marginTop:-230, zIndex:55, position:'relative'}}>

            <Button title="Take again" onPress={() => {setAcceptCameraPreview(null)
            setCameraPreview(null)
            }} />
          </View>
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


    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <Image source={{ uri: selectedImage?.uri }} style={styles.fullscreenImage} />
            <View style={styles.buttonContainer}>

            <Button title="Close" onPress={() => setModalVisible(false)} />
            {itemExists ? (
              <Button title="Delete" onPress={handleDelete} />
            ) : (
              <Button title="Save" onPress={handleSave} />
            )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={shotModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShotModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShotModalVisible(false)}
          >
            <Image source={{ uri: cameraPreview?.toString() }} style={styles.fullscreenImage} />
            <View style={styles.buttonContainer}>
              <Button title="Accept" onPress={() => setShotModalVisible(false)} />
              <Button title="Take again" onPress={deniedPhoto} />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  responseImageContainer: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
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
    width: '60%',
    alignSelf: 'flex-end',
    height: "20%",
    marginTop: 10,
    borderRadius: 10,
  },
  responseImage: {
    width: '100%',
    height: "75%", // Replace 'calc(100% - 160)' with a number value.
    marginTop: 10,
    borderRadius: 10,
    marginBottom:0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-around',
    marginTop:0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});

export default HomeRightSide;
