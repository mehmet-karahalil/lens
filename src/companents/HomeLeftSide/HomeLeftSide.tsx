import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Image, StyleSheet, Button } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import RNFS from 'react-native-fs';
import styles from './HomeLeftSide.Style';
import axios from 'axios';







interface HomeLeftSideProps {
  setTargetImage: (image: string | null) => void;
}
const HomeLeftSide = ({ setTargetImage }: HomeLeftSideProps) => {
  const [category, setCategory] = useState<'man' | 'woman'>('man');
    const[manImages, setManImages] = useState([]);
    const [womanImages, setWomanImages] = useState([]);
  const [photos, setPhotos] = useState(manImages);


  useEffect(() => {
    axios.get('https://l3mo3jc5j6.execute-api.eu-north-1.amazonaws.com/default/images_list')
      .then(response => {
        setManImages(response.data.man);
        setWomanImages(response.data.woman);
        setPhotos(response.data.man);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setPhotos(category === 'man' ? manImages : womanImages);
  }, [category]);

  const handleSegmentChange = (event: any) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    setCategory(selectedIndex === 0 ? 'man' : 'woman');
  };

  const handlePhotoChange = async (item: string) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/tempImage.jpg`;
    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: item,
        toFile: filePath
      }).promise;

      if (downloadResult.statusCode === 200) {
        const base64String = await RNFS.readFile(filePath, 'base64');
        console.log('Base64 string:', base64String);
        setTargetImage(base64String);
      } else {
        console.log('Download failed with status code:', downloadResult.statusCode);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: { item:any }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={1} onPress={() => handlePhotoChange(item)}>
        <Image source={{uri: item}} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.leftContainer}>
      <SegmentedControl
        values={['Man', 'Woman']}
        selectedIndex={category === 'man' ? 0 : 1}
        onChange={handleSegmentChange}
        style={styles.segmentControl}
      />
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
      />
    </View>
  );
};

export default HomeLeftSide;


