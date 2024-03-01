import React, { useState, useEffect, FC } from 'react';
import { Button, View, Text } from 'react-native';
import { Audio } from 'expo-av';

type AudioRecorderProps = {
  onRecordingComplete: (uri: string | null) => void;
};

const AudioRecorder: FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permission, setPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (!permission) {
      console.log('Permission to access microphone is required!');
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    setRecording(newRecording);
  };

  const stopRecording = async () => {
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    onRecordingComplete(uri);
  };

  return (
    <View>
      <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
      {recording && <Text>Recording...</Text>}
    </View>
  );
};

export default AudioRecorder;
