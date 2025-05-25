export interface Message {
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file'| 'audio';
  timestamp?: any;
  fileName?: string;
  mimeType?: string;
}
