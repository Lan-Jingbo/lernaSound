interface EatingSettings {
    eatingTime: string;
    preferences: string;
}
  
interface EatingAnalysisResult {
    youtubeVideo: string;
    eatingTime: string;
    preferences: string;
}
  
interface User {
    userID: number;
    userName: string;
    eatingSettings: EatingSettings;
    eatingAnalysisResults: EatingAnalysisResult[];
}
  
export default User;