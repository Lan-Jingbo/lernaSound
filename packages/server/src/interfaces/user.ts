export interface EatingSettings {
    eatingTime: string;
    preferences: string;
  }
  
  export interface EatingAnalysisResult {
    youtubeVideo: string;
    eatingTime: string;
    preferences: string;
  }
  
  export interface User {
    userID: number;
    userName: string;
    eatingSettings: EatingSettings;
    eatingAnalysisResults: EatingAnalysisResult[];
  }
  