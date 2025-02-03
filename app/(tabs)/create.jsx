import React, { useState } from "react";
import { router } from "expo-router";
import styled from "styled-components/native";
import {
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import arrowRight from "../../assets/icons/arrowRight.png";

import data from "../utils/data.json";
import searchIcon from "../../assets/icons/search.png";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6; // for a bit of horizontal space

const Create = () => {
  const [searchText, setSearchText] = useState("");

  // Navigation for WordItem / TicketItem presses
  const handleWordPress = (navigateTo, setValue, text) => {
    if (navigateTo && setValue) {
      router.push({ pathname: navigateTo, params: { set: setValue } });
    } else {
      console.warn(`No valid route/set for word: ${text}`);
    }
  };

  // Navigation for Card presses
  const handleCardPress = (navigateTo) => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  };

  // Filter logic for words based on searchText
  const filteredVocabularyWords = data.vocabularyWords.filter((word) =>
    word.text.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredTicketWords = data.ticketWords.filter((word) =>
    word.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Search Bar at top */}
      <SearchContainer>
        <SearchWrapper>
          <YellowCircle>
            <SearchIcon source={searchIcon} />
          </YellowCircle>
          <StyledTextInput
            placeholder="ابحث هنا..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </SearchWrapper>
      </SearchContainer>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Tickets Section Header */}
        <AllView>
          <ViewMore>اضافة ادوية</ViewMore>
          <SectionHeader style={{ marginVertical: 0 }}>
            قائمة ادويتك
          </SectionHeader>
        </AllView>

        {/* Ticket Items */}
        {filteredTicketWords.map((word, index) => (
          <TicketItem
            key={`ticket-${index}`}
            text={word.text}
            navigateTo={word.navigateTo}
            set={word.set}
            onWordPress={handleWordPress}
          />
        ))}

        {/* Medication Image (fixed height) */}
        <MedImage
          source={require("../../assets/images/medSitting.jpg")}
          resizeMode="contain"
        />

        {/* "View All" row + Horizontal Cards */}
        <AllView>
          <ViewMore>رؤية الكل</ViewMore>
          <SectionView>
            <SectionHeader style={{ marginVertical: 0 }}>
              مراجع لك
            </SectionHeader>
            <SubHeader>بناء على ادويتك</SubHeader>
          </SectionView>
        </AllView>

        <HorizontalCardList
          cards={data.vocabularyCards}
          onCardPress={handleCardPress}
        />

        {/* Vocabulary Words Section */}
        <SectionHeader>قائمة كلمات المفردات </SectionHeader>
        {filteredVocabularyWords.map((word, index) => (
          <WordItem
            key={`words1-${index}`}
            text={word.text}
            imagePath={word.imagePath}
            navigateTo={word.navigateTo}
            set={word.set}
            onWordPress={handleWordPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ----------------------------------
   HORIZONTAL CARD LIST
------------------------------------ */
const HorizontalCardList = ({ cards, onCardPress }) => {
  return (
    <FlatList
      data={cards}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.key}
      style={{ marginVertical: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderItem={({ item }) => (
        <CardTouchable onPress={() => onCardPress(item.navigateTo)}>
          <CardContainer>
            <CardImage source={{ uri: item.imageUri }} resizeMode="cover" />
            <CardLabelContainer>
              <CardLabel>{item.label}</CardLabel>
            </CardLabelContainer>
          </CardContainer>
        </CardTouchable>
      )}
    />
  );
};

/* ----------------------------------
   WORD ITEM
------------------------------------ */
const WordItem = ({ text, imagePath, navigateTo, set, onWordPress }) => (
  <TouchableOpacity onPress={() => onWordPress(navigateTo, set, text)}>
    <WordContainer>
      <WordImage source={{ uri: imagePath }} />
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, textAlign: "right", marginBottom: 2 }}>
          {text}
        </Text>
      </View>
      <Image
        source={require("../../assets/icons/arrowLeft.png")}
        style={{ width: 24, height: 24 }}
      />
    </WordContainer>
  </TouchableOpacity>
);

/* ----------------------------------
   TICKET ITEM
------------------------------------ */
const TicketItem = ({ text, navigateTo, set, onWordPress }) => (
  <TouchableOpacity onPress={() => onWordPress(navigateTo, set, text)}>
    <TicketContainer>
      {/* Top (white) section */}
      <WhiteSection>
        <RowBetween>
          <TitleText>{text}</TitleText>
          <MenuDots>•••</MenuDots>
        </RowBetween>
      </WhiteSection>

      {/* Bottom (yellow) section with arcs */}
      <YellowSection>
        <NotchLeft />
        <NotchRight />
        <PerforationRow>
          {Array.from({ length: 30 }).map((_, i) => (
            <Arc key={`arc-${i}`} />
          ))}
        </PerforationRow>

        <RowEnd>
          <YellowText>تفقد اخر الاسعار</YellowText>
          <ArrowIcon source={arrowRight} />
        </RowEnd>
      </YellowSection>
    </TicketContainer>
  </TouchableOpacity>
);

/* ----------------------------------
   SEARCH BAR STYLES
------------------------------------ */
const SearchContainer = styled.View`
  padding: 10px 15px;
`;

const SearchWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1.5px solid #000;
  border-radius: 20px;
  padding: 5px;
  background-color: #fff;
`;

const YellowCircle = styled.View`
  background-color: yellow;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const SearchIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #000;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
  padding-right: 10px;
`;

/* ----------------------------------
   HEADERS & ROW
------------------------------------ */
const SectionHeader = styled.Text`
  font-size: 20px;
  color: #000;
  margin: 10px 15px 5px 15px;
  text-align: right;
  font-weight: 600;
`;

const AllView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 15px;
  margin-top: 5px;
`;

const ViewMore = styled.Text`
  color: blue;
  font-size: 14px;
  font-weight: 500;
`;

const SectionView = styled.View``;

const SubHeader = styled.Text`
  font-size: 14px;
  color: #828282;
  margin: 0px 15px;
  text-align: right;
  font-weight: 600;
`;

/* ----------------------------------
   CARD STYLES
------------------------------------ */
const CardTouchable = styled.TouchableOpacity`
  margin-right: 10px;
  width: ${CARD_WIDTH}px;
`;

const CardContainer = styled.View`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  height: 180px;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 65%;
`;

const CardLabelContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CardLabel = styled.Text`
  color: #333;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  padding: 5px;
`;

/* ----------------------------------
   MED IMAGE (fixed height)
------------------------------------ */
const MedImage = styled.Image`
  width: 100%;
  height: 120px; /* or any fixed height */
`;

/* ----------------------------------
   WORD / TICKET ITEM
------------------------------------ */
const WordContainer = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  padding: 14px 10px;
  border-bottom-color: #dae1ea;
  border-bottom-width: 1px;
  background-color: #fafafa;
`;

const WordImage = styled.Image`
  border-radius: 8px;
  width: 30px;
  height: 30px;
  margin-left: 12px;
`;

/* -------------------------------------
   TICKET ITEM STYLES
-------------------------------------- */
const TicketContainer = styled.View`
  flex-direction: column;
  border: 1px solid #dae1ea;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
  background-color: #fff;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

const WhiteSection = styled.View`
  padding: 24px 15px;
  background-color: #fff;
`;

const YellowSection = styled.View`
  background-color: #ffe54f;
  padding: 14px 16px;
  border-top-width: 1px;
  border-top-color: #dae1ea;
  position: relative;
`;

const NotchLeft = styled.View`
  position: absolute;
  top: -14px;
  left: -14px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #fff;
  border: 1px solid #dae1ea;
`;

const NotchRight = styled.View`
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #fff;
  border: 1px solid #dae1ea;
`;

const PerforationRow = styled.View`
  position: absolute;
  top: -9px;
  left: 10px;
  right: 10px;
  height: 12px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const Arc = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #fff;
`;

const RowBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

const MenuDots = styled.Text`
  font-size: 20px;
  color: #000;
`;

const RowEnd = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const YellowText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin-right: 6px;
`;

const ArrowIcon = styled.Image`
  width: 10px;
  height: 10px;
  resize-mode: contain;
`;

export default Create;
