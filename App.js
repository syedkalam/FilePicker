import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {   launchImageLibrary } from 'react-native-image-picker';
import { ProgressBar,Button, Paragraph, Dialog, Text } from 'react-native-paper';
 
const Home = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false); 
  const showDialog = () => setVisible(true); 
  const hideDialog = () => setVisible(false);
  const [dialogMessage, setDialogMessage] = React.useState('File is uploaded successfully.'); 
  const [userUploadedFile, setUserUploadedFile] = React.useState(''); 
  const [fileUploadPercentage, setUploadProgress] = React.useState(0.1);  
  const [fileName, setFileName] = React.useState(''); 
  const [filePath, setFilePath] = React.useState(''); 
  const [fileSize, setFileSize] = React.useState('');  

  const [uploadButtonColor, setUploadButtonColor] = React.useState('#70757a'); 
  const [uploadButtonText, setUploadButtonText] = React.useState('Upload File'); 

  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = React.useState(false);
  
  const openGallery = async () => { 
    const options = {
      title: 'Select File', 
      mediaType: "mixed",
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        cameraRoll: false
      },
    };


    const result = await launchImageLibrary(options); 
    console.log(result);
    const  tmp1 = result['assets'];

     
    setFileName(tmp1[0].fileName);
    setFilePath(tmp1[0].uri);
    setFileSize(tmp1[0].fileSize);


    const file = {
      uri : tmp1[0].uri,
      type: tmp1[0].type,
      name: tmp1[0].fileName,
    };
    
    setUserUploadedFile(file);  
          
  } 
 

  const handleProgress = event => {
    setUploadProgress(Math.round((event.loaded * 100) / event.total)); 
  };


  const uploadFile = () => { 

    if (fileSize < 1)
    {
      setDialogMessage("No file seclected!");
      showDialog();
      
    }
    else
    {
      setUploadButtonText("Uploading....");
      setIsUploadButtonDisabled(true);
      setUploadButtonColor("#e8eaed");
      // setUploadButtonOpacity(0.3);
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', userUploadedFile);
      xhr.upload.addEventListener('progress', handleProgress);

      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          setUploadButtonText("Upload File");
          setIsUploadButtonDisabled(false);
          setUploadButtonColor("#70757a");
          setDialogMessage("File uploaded successfully");
          showDialog();
          setUploadProgress(0);
        }

      }
      xhr.open('POST', 'https://ipfs-dev.ternoa.dev/api/v0/add');
      xhr.setRequestHeader("Content-type", 'multipart/form-data');
      xhr.send(formData);

    }

   
  };


  return (
    <View style={[styles.container]}>

        <View style={[styles.inner_container ]}>
          
            <Text>Selected File Name  : {fileName}</Text>
            <Text>Selected File Path  : {filePath}</Text>
            <Text>Selected File Size  : {fileSize}</Text>

            <TouchableOpacity style={[styles.button2]} onPress={() => openGallery()}>
              <Text>Select File</Text>
            </TouchableOpacity> 

              <ProgressBar progress={fileUploadPercentage} color={"#01d167"} style={[styles.bar]} /> 
        <TouchableOpacity disabled={isUploadButtonDisabled} style={{
        height : 50,
          backgroundColor: uploadButtonColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        elevation: 3,
        width: 200}} onPress={() =>  uploadFile() }> 
                  <Text>{uploadButtonText}</Text>
              </TouchableOpacity>
            
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Alert</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>{dialogMessage}</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideDialog}>Ok</Button>
                </Dialog.Actions>
              </Dialog>

              <View style={[styles.bottom_nav]} > 
              </View>


          </View>
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({
  container: { 
    height: '100%', 
    backgroundColor: "white"
  },
  inner_container:
  { 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
     
  button1: {
    
    height: 50,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    elevation: 3,
    width: 200, 
  },
   
  button2: {
    margin: 10,
    height:40,
    width: 100, 
    backgroundColor: "hsl(171.84, 94.5%, 78.63%)", 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    elevation: 3,
    marginBottom: 100,
  },
 
  bar: {
    height: 20,
    width:200,
    marginTop: 5,
    borderRadius: 10
  } 
});
