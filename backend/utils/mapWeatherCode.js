function mapWeatherCodeToAlert(code) {
    if (code >= 200 && code <= 232) {
      return "Storm Alert";
    } else if (code >= 300 && code <= 321) {
      return "Rain Alert";
    } else if (code >= 500 && code <= 531) {
      return "Rain Alert";
    } else if (code >= 600 && code <= 622) {
      return "Snow Alert";
    } else if (code >= 701 && code <= 781) {
      return "Fog Alert";
    } else if (code === 800) {
      return "Clear Weather";
    } else if (code >= 801 && code <= 804) {
      return "Cloudy Weather";
    } else if (code >= 900 && code <= 906) {
      return "Extreme Weather Alert";
    } else {
      return "Unknown Weather Condition";
    }
  }
  
  module.exports = mapWeatherCodeToAlert;
  