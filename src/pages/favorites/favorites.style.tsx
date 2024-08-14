import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
});