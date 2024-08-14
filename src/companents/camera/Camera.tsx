import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Modal,
} from 'react-native';
import {
  launchCamera,
  CameraOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, deleteFavorite } from '../../store/Favorites';
import axios from 'axios';


const Camera: React.FC = () => {
  const [photo, setPhoto] = useState<null | { uri: string | undefined }>(null);
  const [allPhoto, setAllPhoto] = useState<{ uri: string | undefined }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | {
    uri: string | undefined;
  }>(null);
  const [apiPhotos, setApiPhotos] = useState<{ uri: string | undefined }[]>([]);




  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        granted => {
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Camera permission denied');
          }
        },
      );
    }
  }, []);

  const takePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      saveToPhotos: true,
    };

    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setPhoto(source);
        setAllPhoto([source, ...allPhoto]);

        // Fotoğrafı API'ye gönder
        try {
          const formData = new FormData();
          formData.append('photo', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          });

          const apiResponse = await axios.post('YOUR_API_ENDPOINT', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // API'den gelen yanıtı işleyin
          if (apiResponse.data && apiResponse.data.photos) {
            setApiPhotos(apiResponse.data.photos);
          }
        } catch (error) {
          console.error('API Error: ', error);
        }
      }
    });
  };

  const openModal = (image: { uri: string | undefined }) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: { uri: string | undefined } }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={1} onPress={() => openModal(item)}>
        <Image source={{ uri: item.uri }} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  const renderLeftItem = ({ item }: { item: { uri: string | undefined } }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={1} onPress={() => openModal(item)}>
        <Image source={{ uri: item.uri }} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

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
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.leftContainer}>
          <FlatList
            data={favorites}
            renderItem={renderLeftItem}
            keyExtractor={(item, index) => item?.uri ?? index.toString()}
            numColumns={1}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.rightContainer}>
          <Button title="Take Photo" onPress={takePhoto} />
          <FlatList
            data={allPhoto}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.uri ?? index.toString()}
            numColumns={2}
          />
        </View>
      </View>
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
            <Button title="Close" onPress={() => setModalVisible(false)} />
            {itemExists ? (
              <Button title="Delete" onPress={handleDelete} />
            ) : (
              <Button title="Save" onPress={handleSave} />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  leftContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  divider: {
    width: 1,
    backgroundColor: '#000',
  },
  rightContainer: {
    flex: 2,
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '80%',
    height: '80%',
  },
});

export default Camera;
