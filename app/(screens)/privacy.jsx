// src/components/Privacy.js

import React, { useRef } from "react";
import styled from "styled-components/native";
import { ScrollView, TouchableOpacity, findNodeHandle } from "react-native";
import Markdown from "react-native-markdown-display";
import privacyPolicy from "../utils/privacy.json";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure to install react-native-vector-icons

// Styled Components

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 10px;
  margin-right: 10px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

const TOCContainer = styled.View`
  margin-bottom: 30px;
  align-items: flex-start;
`;

const TOCTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
  text-align: left;
`;

const TOCItem = styled.TouchableOpacity`
  margin-bottom: 5px;
  align-self: stretch;
`;

const TOCItemText = styled.Text`
  font-size: 16px;
  color: #1e90ff;
  text-align: left;
`;

const SectionContainer = styled.View`
  margin-bottom: 25px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
`;

const LastUpdated = styled.Text`
  font-size: 14px;
  color: #888;
  text-align: left;
  margin-top: 20px;
`;

// Privacy Component

const Privacy = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const sectionRefs = useRef([]);

  const handleTOCPress = (index) => {
    if (sectionRefs.current[index] && scrollViewRef.current) {
      sectionRefs.current[index].measureLayout(
        findNodeHandle(scrollViewRef.current),
        (x, y) => {
          scrollViewRef.current.scrollTo({ y: y - 20, animated: true }); // Adjust offset for better visibility
        },
        (error) => {
          console.log("Measure layout error:", error);
        }
      );
    }
  };

  return (
    <SafeArea>
      {/* Header with Back Button */}
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-forward" size={24} color="#1e90ff" />
        </BackButton>
        <HeaderTitle>{privacyPolicy.title}</HeaderTitle>
      </Header>

      <ScrollView ref={scrollViewRef} contentContainerStyle={{ padding: 20 }}>
        {/* جدول المحتويات (Table of Contents) */}
        <TOCContainer>
          <TOCTitle>جدول المحتويات</TOCTitle>
          {privacyPolicy.sections.map((section, index) => (
            <TOCItem key={index} onPress={() => handleTOCPress(index)}>
              <TOCItemText>
                {index + 1}. {section.title}
              </TOCItemText>
            </TOCItem>
          ))}
        </TOCContainer>

        {/* أقسام سياسة الخصوصية (Privacy Policy Sections) */}
        {privacyPolicy.sections.map((section, index) => (
          <SectionContainer
            key={index}
            ref={(ref) => (sectionRefs.current[index] = ref)}
          >
            <SectionTitle>{section.title}</SectionTitle>
            <Markdown
              style={{
                body: {
                  fontSize: 16,
                  lineHeight: 24,
                  color: "#444",
                  textAlign: "left",
                },
                strong: {
                  fontWeight: "bold",
                  color: "#333",
                },
                bullet_list: {
                  marginLeft: 10,
                },
                bullet_item: {
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 5,
                },
                list_item: {
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 5,
                },
                link: {
                  color: "#1e90ff",
                },
              }}
            >
              {section.content.join("\n\n")}
            </Markdown>
          </SectionContainer>
        ))}

        <LastUpdated>آخر تحديث: {privacyPolicy.lastUpdated}</LastUpdated>
      </ScrollView>
    </SafeArea>
  );
};

export default Privacy;
