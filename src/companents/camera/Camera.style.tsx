import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    paddingLeft: 5,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 150,

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
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  leftContainer: {
    width: '20%',
    backgroundColor: '#f0f0f0',
  },
  divider: {
    width: 2,
    backgroundColor: '#000',
  },
  rightContainer: {
    width: '80%',
    padding: 10,
  },
});