// Ads.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import { Video } from "expo-av";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { updateAds as updateAdsRedux, selectAds } from "../redux/adsSlice";
import { createUserRequest } from "../../requestMethods"; // Adjust the path based on your project structure

const Ads = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { lessonUrl, set } = useLocalSearchParams();

  // Reference to the Video component
  const videoRef = useRef(null);

  // Access the current user's ID from Redux
  const userId = useSelector((state) => state.user.currentUser?._id);

  // Ads count from Redux
  const ads = useSelector(selectAds);

  // Component state
  const [countdown, setCountdown] = useState(15);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null); // Video URL
  const [adDestination, setAdDestination] = useState(null); // Ad Destination
  const [subscriptionImage, setSubscriptionImage] = useState(null); // Subscription Image URL
  const [subscribeText, setSubscribeText] = useState("اشترك الآن"); // Default text
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Image Loading State
  const [imageLoadError, setImageLoadError] = useState(false); // Image Load Error State

  // Create an instance of userRequest
  const userRequest = createUserRequest();

  useEffect(() => {
    // Fetch the random ad data when the component mounts
    const fetchAdData = async () => {
      try {
        const response = await userRequest.get("/ads/random");
        const { videoUrl, destination, subscriptionImage, subscribeText } =
          response.data;
        setVideoUrl(videoUrl);
        setAdDestination(destination);
        setSubscriptionImage(subscriptionImage);
        setSubscribeText(subscribeText); // Set the dynamic subscribe text

        // Start preloading the subscription image in parallel
        if (subscriptionImage) {
          Image.prefetch(subscriptionImage)
            .then(() => {
              setIsImageLoaded(true);
            })
            .catch((error) => {
              console.error("Error preloading subscription image:", error);
              setImageLoadError(true);
              // Optionally, set a fallback image or handle the error
            });
        }
      } catch (error) {
        console.error("Error fetching ad data:", error);
        Alert.alert("خطأ", "حدث خطأ أثناء جلب الإعلان.");
      }
    };

    fetchAdData();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0 && videoUrl) {
      // Start the countdown immediately after video URL is set
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowSubscription(true);
      // Pause the video when countdown reaches zero
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, videoUrl]);

  // Handlers for Video events
  const handleVideoLoadStart = () => {
    setIsVideoReady(false); // Video is loading
  };

  const handleVideoLoaded = () => {
    setIsVideoReady(true); // Video has loaded and is ready to play
  };

  const handleVideoError = (error) => {
    console.error("Video Error:", error);
    Alert.alert("خطأ", "حدث خطأ أثناء تحميل الفيديو.");
    // Optionally, navigate away or retry
  };

  // Function to decrement ads count
  const decrementAdsCount = async () => {
    try {
      // Make a PUT request to update ads count
      const response = await userRequest.put(`/users/ads/${userId}`, {
        incrementBy: -1,
      });

      // Dispatch Redux action to update ads count in the store
      dispatch(updateAdsRedux({ ads: response.data.ads }));
    } catch (error) {
      console.error("Error updating ads count:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث عدد الإعلانات. حاول مرة أخرى.");
    }
  };

  // Handler for Close Ad Button
  const handleCloseAd = async () => {
    // Decrement ads count
    await decrementAdsCount();

    // Navigate to the lesson
    router.push({ pathname: lessonUrl, params: { set } });
  };

  // Function to handle Subscribe action
  const handleSubscribe = () => {
    if (!adDestination) {
      Alert.alert("خطأ", "وجهة الإعلان غير متوفرة.");
      return;
    }

    if (
      adDestination.startsWith("http://") ||
      adDestination.startsWith("https://")
    ) {
      // External URL - Open using Linking
      Linking.openURL(adDestination).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    } else {
      // Internal route - Navigate using router.push
      router.push(adDestination);
    }
  };

  return (
    <Container>
      {/* Video Player */}
      {!showSubscription && videoUrl ? (
        <StyledVideo
          ref={videoRef}
          source={{
            uri: videoUrl,
          }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          onLoadStart={handleVideoLoadStart}
          onLoad={handleVideoLoaded}
          onError={handleVideoError}
        />
      ) : null}

      {/* Loading Indicator */}
      {!isVideoReady && videoUrl && !showSubscription && (
        <LoadingOverlay>
          <ActivityIndicator size="large" color="#ffffff" />
        </LoadingOverlay>
      )}

      {/* Countdown Timer or Subscription View */}
      {!showSubscription ? (
        <CountdownContainer>
          <CountdownText>{countdown}</CountdownText>
        </CountdownContainer>
      ) : (
        <>
          {subscriptionImage && isImageLoaded && !imageLoadError ? (
            <SubscriptionImageBackground
              source={{ uri: subscriptionImage }} // Use the URL directly
              resizeMode="cover"
            >
              {/* Subscribe Button */}
              <SubscribeButton
                onPress={handleSubscribe}
                accessibilityLabel="Subscribe Now"
              >
                <SubscribeButtonText>{subscribeText}</SubscribeButtonText>
              </SubscribeButton>

              {/* Close Button in the Same Position as Countdown */}
              <CloseButton
                onPress={handleCloseAd}
                accessibilityLabel="Close Ad"
              >
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </SubscriptionImageBackground>
          ) : imageLoadError ? (
            // Fallback if subscriptionImage failed to load
            <FallbackSubscription>
              {/* Subscribe Button using Link for Internal Routes */}
              {!adDestination ||
              adDestination.startsWith("http://") ||
              adDestination.startsWith("https://") ? (
                <SubscribeButton
                  onPress={handleSubscribe}
                  accessibilityLabel="Subscribe Now"
                >
                  <SubscribeButtonText>{subscribeText}</SubscribeButtonText>
                </SubscribeButton>
              ) : (
                <Link href={adDestination} passHref>
                  <StyledLink>
                    <SubscribeButtonText>{subscribeText}</SubscribeButtonText>
                  </StyledLink>
                </Link>
              )}

              {/* Close Button */}
              <CloseButton
                onPress={handleCloseAd}
                accessibilityLabel="Close Ad"
              >
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
            </FallbackSubscription>
          ) : (
            // Show loading indicator if image is not yet loaded
            <LoadingOverlay>
              <ActivityIndicator size="large" color="#ffffff" />
            </LoadingOverlay>
          )}
        </>
      )}
    </Container>
  );
};

export default Ads;

// Styled Components

const Container = styled.View`
  flex: 1;
  background-color: #000;
`;

const StyledVideo = styled(Video)`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1; /* Ensure it's above the video */
`;

const CountdownContainer = styled.View`
  position: absolute;
  top: 40px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 20px;
`;

const CountdownText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const SubscriptionImageBackground = styled.ImageBackground`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  justify-content: center;
  align-items: center;
`;

const FallbackSubscription = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

const SubscribeButton = styled.TouchableOpacity`
  background-color: #ff6347;
  padding: 15px 35px;
  border-radius: 25px;
  /* Positioning the button at the center */
  position: absolute;
  bottom: 100px; /* Adjust as needed */
`;

const SubscribeButtonText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 20px;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
`;

const StyledLink = styled.TouchableOpacity`
  background-color: #ff6347;
  padding: 15px 30px;
  border-radius: 25px;
  /* Positioning the button at the center */
  position: absolute;
  bottom: 100px;
  justify-content: center;
  align-items: center;
`;
