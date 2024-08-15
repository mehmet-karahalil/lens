import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Image, StyleSheet, Button } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import RNFS from 'react-native-fs';
import styles from './HomeLeftSide.Style';
import man1 from "../../assets/images/man/00840315406-p.jpg";





const manImages = [
  { uri: man1, path: 'src/assets/images/man/00840315406-p.jpg' },
  { uri: require('./photos/man/00881350330-p.jpg'), path: './photos/man/00881350330-p.jpg' },
  { uri: require('./photos/man/01165310707-p.jpg'), path: './photos/man/01165310707-p.jpg' },
  { uri: require('./photos/man/03090521105-p.jpg'), path: './photos/man/03090521105-p.jpg' },
  { uri: require('./photos/man/03992350250-p.jpg'), path: './photos/man/03992350250-p.jpg' },
  { uri: require('./photos/man/05585345822-p.jpg'), path: './photos/man/05585345822-p.jpg' },
  { uri: require('./photos/man/05682596502-p.jpg'), path: './photos/man/05682596502-p.jpg' },
  { uri: require('./photos/man/06096301700-p.jpg'), path: './photos/man/06096301700-p.jpg' },
  { uri: require('./photos/man/06224327064-p.jpg'), path: './photos/man/06224327064-p.jpg' },
];

const womanImages = [
  { uri: require('./photos/woman/05232692806-a3o.jpg'), path: './photos/woman/05232692806-a3o.jpg' },
  { uri: require('./photos/woman/06070335700-a3f.jpg'), path: './photos/woman/06070335700-a3f.jpg' },
  { uri: require('./photos/woman/06603718800-w.jpg'), path: './photos/woman/06603718800-w.jpg' },
  { uri: require('./photos/woman/06630551712-a3o.jpg'), path: './photos/woman/06630551712-a3o.jpg' },
  { uri: require('./photos/woman/06633407700-p.jpg'), path: './photos/woman/06633407700-p.jpg' },
  { uri: require('./photos/woman/06638109700-w.jpg'), path: './photos/woman/06638109700-w.jpg' },
  { uri: require('./photos/woman/06644644800-p.jpg'), path: './photos/woman/06644644800-p.jpg' },
  { uri: require('./photos/woman/08574718800-w.jpg'), path: './photos/woman/08574718800-w.jpg' },
  { uri: require('./photos/woman/0501535277513-a3f.jpg'), path: './photos/woman/0501535277513-a3f.jpg' },
];

interface HomeLeftSideProps {
  setTargetImage: (image: string | null) => void;
}
const HomeLeftSide = ({ setTargetImage }: HomeLeftSideProps) => {
  const [category, setCategory] = useState<'man' | 'woman'>('man');
  const [photos, setPhotos] = useState(manImages);

  useEffect(() => {
    setPhotos(category === 'man' ? manImages : womanImages);
  }, [category]);

  const handleSegmentChange = (event: any) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    setCategory(selectedIndex === 0 ? 'man' : 'woman');
  };


  const handlePhotoChange = async (item: { uri: number, path: string }) => {
    try {
      const absolutePath = RNFS.DocumentDirectoryPath + '/' + item.path;
      const base64Image = await RNFS.readFile(absolutePath, 'base64');
      setTargetImage(base64Image);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      setTargetImage(null);
    }
  };

  const renderItem = ({ item }: { item: { uri: number, path: string } }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={1} onPress={() => handlePhotoChange(item)}>
        <Image source={item.uri} style={styles.image} />
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


