import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from './favorites.style';
import {addFavorite, deleteFavorite} from '../../store/Favorites';

const Favorites = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | {
    uri: string | undefined;
  }>(null);

  const openModal = (image: {uri: string | undefined}) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderItem = ({item}: {item: {uri: string | undefined}}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={1} onPress={() => openModal(item)}>
        <Image source={{uri: item.uri}} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
  const favorites = useSelector((state: any) => state.favorites.favorites);
  const dispatch = useDispatch();

  const itemExists = favorites.some(
    (favorite: {uri: string | undefined}) =>
      favorite.uri === selectedImage?.uri,
  );

  const handleSave = () => {
    if (selectedImage && selectedImage.uri) {
      dispatch(addFavorite(selectedImage?.uri || ''));
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
    <View>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.uri ?? index.toString()}
        numColumns={2}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}>
            <Image
              source={{uri: selectedImage?.uri}}
              style={styles.fullscreenImage}
            />
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

export default Favorites;
