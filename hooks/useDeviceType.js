// hooks/useDeviceType.js
import { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

const useDeviceType = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    const aspectRatio = height / width;

    // Basic heuristic for tablet detection
    const isTabletDevice = Platform.OS === "ios" ? width >= 768 : width >= 600; // Adjust these values as needed

    setIsTablet(isTabletDevice);
  }, []);

  return isTablet;
};

export default useDeviceType;
