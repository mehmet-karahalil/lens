import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  leftContainer: {
    width: '28%',
    backgroundColor: '#f0f0f0',
    padding: 0,
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  segmentControl: {
   marginBottom: 10,
   height: 40,
   width: '100%',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.8, // for iOS shadow
    shadowRadius: 2, // for iOS shadow
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});

export default styles;