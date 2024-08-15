import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import HomeLeftSide from "../../companents/HomeLeftSide";
import HomeRightSide from "../../companents/HomeRightSide";
import axios from "axios";
import RNFS from 'react-native-fs';

const Home = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [responseImage, setResponseImage] = useState<null | string>(null);
 
  const [loading, setLoading] = useState(false);

  const startAI = async () => {
    setLoading(true);
    const payload = {
      source_image: sourceImage,
      target_image: targetImage,
      source_faces_index: [0],
      face_index: [0],
      upscaler: "None",
      scale: 1,
      upscale_visibility: 1,
      face_restorer: "None",
      restorer_visibility: 1,
      codeformer_weight: 0.5,
      restore_first: 1,
      model: "inswapper_128.onnx",
      gender_source: 0,
      gender_target: 0,
      save_to_file: 0,
      result_file_path: "",
      device: "GPU",
      mask_face: 0,
      select_source: 0,
      face_model: "None",
      source_folder: "",
      random_image: 0,
      upscale_force: 0,
      det_thresh: 0.5,
      det_maxnum: 0
    };
    try {
      const apiResponse = await axios.post('https://ai.github.rocks/reactor/image', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseImageBase64 = apiResponse.data.image;
      setResponseImage(`data:image/png;base64,${responseImageBase64}`);
      setMessage('Request successful.');
    } catch (error) {
      setMessage('Request failed.');
      console.error('API Error: ', error);
      try {
        const responsePath = `${RNFS.DocumentDirectoryPath}/response.txt`;
        const responseData = await RNFS.readFile(responsePath, 'utf8');
        const responseJson = JSON.parse(responseData);
        const responseImageBase64 = responseJson.image;
        setResponseImage(`data:image/png;base64,${responseImageBase64}`);
      } catch (fileError) {
        console.error('File Read Error: ', fileError);
        setMessage('Failed to read response.txt.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sourceImage && targetImage) {
      startAI();
    }
  }, [sourceImage, targetImage]);

  return (
    <View style={styles.mainContainer}>
      <HomeLeftSide
        setTargetImage={setTargetImage}
      />
      <View style={styles.divider} />
      <HomeRightSide 
        setSourceImage={setSourceImage}
        loading={loading}
        responseImage={responseImage}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  divider: {
    width: 1,
    backgroundColor: '#000',
  },
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
  },
});
