import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import playIcon from "../../../assets/icons/speaker.png";
import shuffleIcon from "../../../assets/icons/shuffle.png";
import americaIcon from "../../../assets/icons/america.png";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import useDeviceType from "../../../hooks/useDeviceType";
import * as Speech from "expo-speech";

const Vocabulary = () => {
  const route = useRoute();
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Set 1 - Introduction");
  const [isHidden, setIsHidden] = useState(true);
  const [cardsData, setCardsData] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState(
    route.params?.set || "medical1"
  );
  const isTablet = useDeviceType();
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const fetchVocabularyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://quizeng-022517ad949b.herokuapp.com/api/vocabulary/${selectedSet}`
        );
        setCardsData(response.data.words);
      } catch (error) {
        console.error("Failed to fetch vocabulary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularyData();
  }, [selectedSet]);

  useEffect(() => {
    const fetchVoices = async () => {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      setVoices(availableVoices);
    };
    fetchVoices();
  }, []);
  const flipCard = () => {
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  const options = [
    { label: "Set 1 - Introduction", value: "medical1" },
    { label: "Set 2 - Basics", value: "set1" },
    { label: "Set 3 - Advanced", value: "medical3" },
  ];

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const selectOption = (option) => {
    setSelectedOption(option.label);
    setSelectedSet(option.value);
    toggleDropdown();
  };

  const renderCard = ({ item }) => (
    <Animated.View
      style={[{ transform: [{ translateX }], opacity }, styles.card]}
    >
      <CardContainer isTablet={isTablet}>
        <FlipCardContainer onPress={flipCard}>
          <Animated.View style={[frontAnimatedStyle, styles.flipCard]}>
            <CardOn>
              <CardOnDiv>
                <CardOnWord>{item.word}</CardOnWord>
                <CardOnSp>
                  <CardOnAm>
                    <CardOnIc>
                      <CardOnAt onPress={handlePronounce}>
                        <Image
                          source={playIcon}
                          style={{ width: 16, height: 16, marginRight: 30 }}
                        />
                      </CardOnAt>
                    </CardOnIc>
                    <CardOnLe>
                      <CardOnWr>
                        <Image
                          source={americaIcon}
                          style={{ width: 16, height: 16, marginRight: 4 }}
                        />
                        <CardOnSpan>English/US</CardOnSpan>
                      </CardOnWr>
                    </CardOnLe>
                  </CardOnAm>
                </CardOnSp>
              </CardOnDiv>
            </CardOn>
          </Animated.View>
          <Animated.View
            style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}
          >
            <CardTwo>
              <CardTwoSub>
                <CardTwoLi>
                  {item.img && (
                    <CardTwoIm
                      source={{ uri: item.img }}
                      resizeMode="contain"
                    />
                  )}
                  <CardTwoTe>
                    <CardTwoSpa>{item.translation}</CardTwoSpa>
                    <CardTwoSp>{item.answer}</CardTwoSp>
                    <CardTwoSp>{item.explain}</CardTwoSp>
                  </CardTwoTe>
                </CardTwoLi>
              </CardTwoSub>
            </CardTwo>
          </Animated.View>
        </FlipCardContainer>
      </CardContainer>
    </Animated.View>
  );

  const goToNextCard = () => {
    if (currentCard < cardsData.length - 1) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentCard((prev) => prev + 1);
        translateX.setValue(300);
        opacity.setValue(0);
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();

        setIsFlipped(false);
        animatedValue.setValue(0);
      });
    }
  };

  const goToPreviousCard = () => {
    if (currentCard > 0) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentCard((prev) => prev - 1);
        translateX.setValue(-300);
        opacity.setValue(0);
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
        setIsFlipped(false);
        animatedValue.setValue(0);
      });
    }
  };

  const handlePronounce = () => {
    if (cardsData.length === 0) {
      return;
    }
    const currentCardData = cardsData[currentCard];
    if (!currentCardData) {
      return;
    }
    const bestVoice =
      voices.find(
        (voice) =>
          voice.quality === "Enhanced" && voice.language.startsWith("en")
      ) ||
      voices.find(
        (voice) =>
          voice.quality === "Default" && voice.language.startsWith("en")
      ) ||
      voices.find((voice) => voice.language.startsWith("en"));
    const options = bestVoice
      ? { voice: bestVoice.identifier }
      : { language: "en-US" };
    const textToSpeak = isFlipped
      ? currentCardData.answer
      : currentCardData.word;
    Speech.speak(textToSpeak, options);
  };
  const pronounceButtonText = isFlipped ? "استمع للجملة" : "استمع للكلمة";
  return (
    <SafeArea>
      <CroBut onPress={() => router.push("create")}>
        <CrossIcon
          source={require("../../../assets/icons/grayCross.png")}
          resizeMode="contain"
        />
      </CroBut>
      <AllWr>
        <VocWra>
          <VocHead>
            تعلم باستخدام البطاقات التعليمية -
            <VocHeadSpan>اضغط على البطاقة لرؤية المعنى والاستخدام</VocHeadSpan>
          </VocHead>
          <VocMain>
            <VocOn>
              <VocOnBut onPress={toggleHidden}>
                <IconImage
                  source={{
                    uri: "https://cdn.vocab.com/images/icons/more-options-dot-74770n.svg",
                  }}
                />
              </VocOnBut>
            </VocOn>
            {!isHidden && (
              <HiddenWr>
                <HidSub>
                  <HidOn>
                    <HidOnSp>Definition first</HidOnSp>
                    <HidOnIm
                      source={{
                        uri: "https://cdn.vocab.com/images/icons/flip-order-7pxoyu.svg",
                      }}
                    />
                  </HidOn>
                </HidSub>
                <HidSub>
                  <HidOn>
                    <HidOnSp>Print Flashcards</HidOnSp>
                    <HidOnIm
                      source={{
                        uri: "https://cdn.vocab.com/images/icons/print-flashcards-rp5m7h.svg",
                      }}
                    />
                  </HidOn>
                </HidSub>
              </HiddenWr>
            )}
            <VocTh>Word Sets</VocTh>
            <SelectContainer>
              <DropdownHeader onPress={toggleDropdown}>
                <DropdownText>{selectedOption}</DropdownText>
                <DropdownIcon>&#9660;</DropdownIcon>
              </DropdownHeader>

              {visible && (
                <OptionsContainer>
                  {options.map((option, index) => (
                    <OptionItem
                      key={index}
                      onPress={() => selectOption(option)}
                    >
                      <OptionText>{option.label}</OptionText>
                    </OptionItem>
                  ))}
                </OptionsContainer>
              )}
            </SelectContainer>
            <VocFo>
              <VocFoTop>
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#0a9be3"
                    style={styles.loader}
                  />
                ) : (
                  cardsData.length > 0 &&
                  renderCard({ item: cardsData[currentCard] })
                )}
              </VocFoTop>
              <VocFoMid>
                <VocMidBut>
                  <Image
                    source={shuffleIcon}
                    style={{ width: 16, height: 16, marginRight: 30 }}
                  />
                </VocMidBut>
              </VocFoMid>
              <VocFoBot>
                <VocFoBut onPress={goToPreviousCard}>
                  <ButtonText>السابق</ButtonText>
                </VocFoBut>
                <VocFoSpan>
                  <VocFoSpan1>{currentCard + 1}</VocFoSpan1>
                  <VocFoSpan1>/</VocFoSpan1>
                  <VocFoSpan1>{cardsData.length}</VocFoSpan1>
                </VocFoSpan>
                <VocFoNe onPress={goToNextCard}>
                  <ButtonText>التالي</ButtonText>
                </VocFoNe>
              </VocFoBot>
              <VocFoPronounceButton onPress={handlePronounce}>
                <ButtonText>{pronounceButtonText}</ButtonText>
              </VocFoPronounceButton>
            </VocFo>
          </VocMain>
        </VocWra>
      </AllWr>
    </SafeArea>
  );
};

// Styled Components
const SafeArea = styled.SafeAreaView``;

export const AllWr = styled.View`
  width: 95%;
  margin-left: auto;
  margin-right: auto;
`;

const VocFoPronounceButton = styled.TouchableOpacity`
  background-color: #0a9be3;
  border-radius: 3px;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;
export const VocWra = styled.View`
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const VocHead = styled.Text`
  text-align: right;
  font-size: 18px;
  line-height: 25px;
  margin: 10px 0;
  color: #545454;
`;
export const VocHeadSpan = styled.Text`
  color: #0a9be3;
`;

export const VocMain = styled.View`
  background-color: #f1faff;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  height: 80%;
  shadow-color: rgba(0, 0, 0, 0.15);
  shadow-offset: 0px 0px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 4;
  z-index: 1;
`;

export const VocOn = styled.View`
  top: 11px;
  right: 20px;
  position: absolute;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
`;

export const VocOnBut = styled.TouchableOpacity`
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
  margin: 0;
  padding: 0;
  transition: all 0.5s ease 0;
`;

const IconImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const HiddenWr = styled.View`
  display: ${(props) => (props.isHidden ? "none" : "flex")};
  z-index: 10;
  top: 35px;
  right: 10px;
  position: absolute;
  height: 75px;
  flex-shrink: 0;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  elevation: 3;
  color: #0275b8;
`;

export const HidSub = styled.View`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

export const HidOn = styled.View`
  flex-direction: row;
  gap: 16px;
`;

export const HidOnSp = styled.Text`
  color: #0275b8;
  font-size: 14px;
`;

export const HidOnIm = styled.Image`
  width: 24px;
  height: 24px;
`;

const PickerWrapper = styled.View`
  width: 50%;
  border-radius: 5px;
  overflow: hidden;
`;

export const VocTh = styled.Text`
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
  gap: 0.5em;
`;

const DropdownHeader = styled.TouchableOpacity`
  width: 100%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  elevation: 5;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DropdownText = styled.Text`
  font-size: 16px;
  color: #545454;
`;

const DropdownIcon = styled.Text`
  font-size: 16px;
`;

const OptionsContainer = styled.View`
  position: absolute;
  top: 55px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  elevation: 5;
  z-index: 999;
  padding: 10px;
`;

const OptionItem = styled.TouchableOpacity`
  padding: 10px;
`;

const OptionText = styled.Text`
  font-size: 16px;
  color: #545454;
`;

const SelectContainer = styled.View`
  width: 80%;
  align-items: center;
  position: relative;
  z-index: 2;
`;

export const VocFo = styled.View`
  margin-top: 2rem;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: center;
  user-select: none;
  position: relative;
`;

export const VocFoTop = styled.View`
  flex: 1;
  width: 100%;
  position: relative;
  margin-bottom: 30px;
`;

export const VocFroSu = styled.View`
  flex: 1;
  position: relative;
  transition: transform 0.5s;
  transform-style: preserve-3d;
`;

const FlipCard = styled.TouchableOpacity`
  perspective: 1000px;
  width: 100%;
  height: 100%;
`;

export const FlipCardInner = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
`;
const CardContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 185px;
  margin-top: ${(props) => (props.isTablet ? "100px" : "40px")};
  margin-left: ${(props) => (props.isTablet ? "300px" : "11px")};
  z-index: 1;
`;

const FlipCardContainer = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
`;

const CardOn = styled.View`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const CardOnDiv = styled.View`
  flex: 1;
  justify-content: center;
  border: 2px solid #6cb4e9;
  border-radius: 8px;
  position: relative;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CardOnWord = styled.Text`
  color: #545454;
  font-family: "Open Sans";
  font-size: 26px;
  font-weight: 700;
  position: absolute;
  bottom: 80px;
`;

const CardOnSp = styled.View`
  flex-direction: column;
`;

const CardOnAm = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 80px;
`;

const CardOnIc = styled.View`
  width: 16px;
  height: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CardOnAt = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const CardOnLe = styled.View`
  flex-direction: row;
`;

const CardOnWr = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CardOnSpan = styled.Text`
  color: #768994;
  font-size: 13px;
  font-weight: 400;
  line-height: 32px;
`;

const CardTwo = styled.View`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
`;

const CardTwoSub = styled.View`
  flex: 1;
  justify-content: center;
  border: 2px solid #6cb4e9;
  border-radius: 8px;
  position: relative;
  text-align: center;
  width: 100%;
`;

const CardTwoLi = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CardTwoIm = styled.Image`
  width: 80px;
  height: 55px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const CardTwoTe = styled.View`
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Card = styled(Animated.View)`
  position: relative;
  width: 300px;
  height: 185px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  elevation: 10;
  top: 50;
  left: 12;
  z-index: 1;
`;

const CardTwoSp = styled.Text`
  text-align: center;
  font-size: 14px;
  margin-bottom: 1px;
`;

const CardTwoSpa = styled.Text`
  color: #000;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
  padding-right: 0.25em;
`;

const ShCon = styled.View``;
const VocFoMid = styled.View`
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const VocMidBut = styled.TouchableOpacity`
  width: 15px;
  height: 11px;
  background-color: transparent;
  background-image: url("https://cdn.vocab.com/js3/18bb1b5712966853dfb7.svg");
  background-repeat: no-repeat;
  background-position: 0 0;
  padding: 0px;
  outline: none;
  border: none;
  border-radius: 3px;
  margin: 0;
`;
const CroBut = styled.TouchableOpacity`
  margin: 15px;
  margin-left: auto;
  margin-bottom: 10px;
`;
const VocFoBot = styled.View`
  flex-direction: row;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
`;

export const VocFoSpan1 = styled.Text`
  font-size: 16px;
  line-height: 16px;
`;

export const VocFoSpan = styled.Text`
  margin: 0 10px;
  min-width: 3.25em;
  text-align: center;
`;

const CrossIcon = styled.Image`
  width: 26px;
  height: 26px;
`;

const VocFoBut = styled.TouchableOpacity`
  background-color: #0a9be3;
  border-radius: 3px;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;
const VocFoNe = styled.TouchableOpacity`
  border-radius: 3px;
  background-color: #0b9be3;
  padding: 9px 10px;
  min-width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  transition: all 0.5s ease 0;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  font-family: "Open Sans";
  text-decoration: none;
`;

const styles = {
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  flipCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  flipCardBack: {
    position: "absolute",
    top: 0,
  },
  card: {
    width: "100%",
    height: "100%",
  },
};

export default Vocabulary;
