
import { Injectable } from '@angular/core';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private recording = false;

  constructor() {}

  async requestPermission(): Promise<boolean> {
    const perm = await VoiceRecorder.requestAudioRecordingPermission();
    return perm.value;
  }

  async startRecording(): Promise<void> {
    await VoiceRecorder.startRecording();
    this.recording = true;
  }

  async stopRecording(): Promise<RecordingData> {
    const result = await VoiceRecorder.stopRecording();
    this.recording = false;
    return result;
  }

  isRecording(): boolean {
    return this.recording;
  }
}
