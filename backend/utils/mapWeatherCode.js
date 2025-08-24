export default function mapWeatherCodeToAlert(code) {
    // severe
    if ((code >= 200 && code <= 232) || code === 771 || code === 781) {
      return "Storm Alert"; // thunderstorms, sqall, or tornado
    }
    // precipitation
    if ((code >= 300 && code <= 321) || (code >= 500 && code <= 531)) {
      return "Rain Alert";
    }
    if (code >= 600 && code <= 622) {
      return "Snow Alert";
    }
    // atmospheric conditions
    if (code === 741) return "Fog Alert";
    if (code >= 701 && code <= 780) {
      return "Air Quality / Visibility Alert"; // mist/smoke/haze/dust/sand/ash
    }
    
    // clouds
    if (code === 800) {
      return "Clear Weather";
    } 
    if (code >= 801 && code <= 804) {
      return "Cloudy Weather";
    } 
    // extremes
    if (code >= 900 && code <= 906) {
      return "Extreme Weather Alert";
    }
    
    return "Unknown Weather Condition";
  }
  
  