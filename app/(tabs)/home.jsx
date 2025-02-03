// Home.jsx
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Linking } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

// A simple check icon for the "Gold benefits" comparison table
const CheckIcon = styled(MaterialIcons).attrs(() => ({
  name: "check",
  size: 20,
  color: "#00ab59",
}))``;

// A small arrow icon that rotates when an FAQ is expanded
const ArrowIcon = styled(MaterialIcons).attrs(() => ({
  name: "keyboard-arrow-down",
  size: 24,
}))`
  transform: ${(props) => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};
`;

/** Sample FAQ data array. Each item: { question, answer, extraLinkText? } */
const FAQ_ITEMS = [
  {
    question: "How much is GoodRx Gold?",
    answer:
      "Gold membership starts at just $9.99 a month, but your first 30 days are free as a new member! ",
    extraLinkText: "Compare Gold plans",
  },
  {
    question: "How much can Gold save me?",
    answer:
      "Gold can save you up to 90% on prescription medications at thousands of pharmacies nationwide.",
  },
  {
    question: "Where is Gold accepted?",
    answer:
      "Gold is accepted at thousands of pharmacies across the U.S., including major chains and local stores.",
  },
  {
    question: "Who doesn’t accept Gold?",
    answer:
      "Most major chains accept Gold, but be sure to check the list of participating pharmacies for your area.",
  },
  {
    question: "Can Gold help me with video visits?",
    answer:
      "Yes, telehealth visits can be as low as $19 with Gold—significantly less than typical urgent care or doctor visits.",
  },
  {
    question: "What kind of care can I get online?",
    answer:
      "Online visits can address many minor illnesses or conditions, with prescription options when appropriate.",
  },
];

// -------------------- STYLED COMPONENTS --------------------
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  position: relative; /* needed for the sticky CTA button */
`;

// Top "arc" area
const HeaderArc = styled.View`
  background-color: #ffe148;
  height: 50px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20px;
`;

// Black circle with star badge
const BlackCircleBadge = styled.View`
  position: absolute;
  top: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #000;
  align-items: center;
  justify-content: center;
`;

const BadgeIconText = styled.Text`
  color: #ffe148;
  font-size: 22px;
`;

// Title and Subtitle
const MainTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 4px;
  text-align: center;
  padding-horizontal: 20px;
  color: #000;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: #444;
  text-align: center;
  margin-bottom: 16px;
`;

// Tabs
const TabsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TabButton = styled.TouchableOpacity`
  margin-horizontal: 20px;
  padding-vertical: 12px;
`;

const TabButtonLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#000" : "#666")};
`;

const ActiveTabIndicator = styled.View`
  height: 3px;
  background-color: #0055ff;
  margin-top: 6px;
`;

// --------- GOLD BENEFITS UI ---------
const ComparisonCard = styled.View`
  background-color: #fff;
  margin: 10px 16px;
  border-radius: 12px;

  /* Make the card bigger & let the shadow show */
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 5px;
  elevation: 5;

  /* NOTE: Removed "overflow: hidden;" so the bottom and shadow are not clipped */
`;

const TableHeaderRow = styled.View`
  flex-direction: row;
  background-color: #f3f2f2;
  padding-vertical: 10px;
`;

const TableHeaderCell = styled.View`
  flex: 1;
  align-items: center;
`;

const HeaderCellText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #777;
`;

const TableRow = styled.View`
  flex-direction: row;
  padding-vertical: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #e6e6e6;
`;

const RowTitleCell = styled.View`
  flex: 3;
  padding-left: 12px;
  justify-content: center;
`;

const RowTitleText = styled.Text`
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
`;

const RowSubtitleText = styled.Text`
  font-size: 12px;
  color: #555;
`;

const RowCheckCell = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.bg ? props.bg : "transparent")};
`;

// --------- FAQ UI ---------
const FaqCard = styled.View`
  background-color: #fff;
  margin: 16px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const FaqItemContainer = styled.View`
  border-top-width: ${(props) => (props.first ? "0px" : "1px")};
  border-top-color: #e6e6e6;
`;

const QuestionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 14px;
  padding-horizontal: 12px;
`;

const QuestionText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  flex: 1;
  padding-right: 8px;
`;

const FaqArrowIcon = styled(MaterialIcons).attrs(() => ({
  name: "keyboard-arrow-down",
  size: 24,
}))`
  transform: ${(props) => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};
`;

const AnswerContainer = styled.View`
  background-color: #fff;
  padding-bottom: 14px;
  padding-horizontal: 12px;
`;

const AnswerText = styled.Text`
  font-size: 14px;
  color: #444;
  line-height: 20px;
`;

// Link within FAQ answer
const LinkText = styled.Text`
  color: #0055ff;
  font-size: 14px;
  text-decoration: underline;
`;

// Sticky CTA at bottom
const StickyCtaWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 12px 16px;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const CtaButton = styled.TouchableOpacity`
  background-color: #0055ff;
  border-radius: 8px;
  padding-vertical: 14px;
  align-items: center;
`;

const CtaButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

// -------------------- MAIN COMPONENT --------------------
const Home = () => {
  // Track which tab is active ("gold" or "faq")
  const [activeTab, setActiveTab] = useState("gold");

  // For FAQ accordion
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggleFaq = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Gold comparison card
  const renderGoldBenefits = () => (
    <ComparisonCard>
      {/* Table headers */}
      <TableHeaderRow>
        <TableHeaderCell style={{ flex: 2 }}>
          {/* blank for left side */}
        </TableHeaderCell>
        <TableHeaderCell>
          <HeaderCellText>Free</HeaderCellText>
        </TableHeaderCell>
        <TableHeaderCell style={{ backgroundColor: "#fff4cc" }}>
          <HeaderCellText>Gold</HeaderCellText>
        </TableHeaderCell>
      </TableHeaderRow>

      {/* 1) Manage your prescription savings */}
      <TableRow>
        <RowTitleCell>
          <RowTitleText>Manage your prescription savings</RowTitleText>
        </RowTitleCell>
        <RowCheckCell>
          <CheckIcon />
        </RowCheckCell>
        <RowCheckCell bg="#fffbea">
          <CheckIcon />
        </RowCheckCell>
      </TableRow>

      {/* 2) Up to 90% off retail prescription prices */}
      <TableRow>
        <RowTitleCell>
          <RowTitleText>Up to 90% off retail prescription prices*</RowTitleText>
        </RowTitleCell>
        <RowCheckCell />
        <RowCheckCell bg="#fffbea">
          <CheckIcon />
        </RowCheckCell>
      </TableRow>

      {/* 3) Virtual care visits for $19 (Normally $39-$59) */}
      <TableRow>
        <RowTitleCell>
          <RowTitleText>Virtual care visits for $19</RowTitleText>
          <RowSubtitleText>(Normally $39-$59)</RowSubtitleText>
        </RowTitleCell>
        <RowCheckCell />
        <RowCheckCell bg="#fffbea">
          <CheckIcon />
        </RowCheckCell>
      </TableRow>

      {/* 4) Free home delivery on eligible medications */}
      <TableRow>
        <RowTitleCell>
          <RowTitleText>
            Free home delivery on eligible medications
          </RowTitleText>
        </RowTitleCell>
        <RowCheckCell />
        <RowCheckCell bg="#fffbea">
          <CheckIcon />
        </RowCheckCell>
      </TableRow>

      {/* 5) Flexible plan options for you and your family */}
      <TableRow>
        <RowTitleCell>
          <RowTitleText>
            Flexible plan options for you and your family
          </RowTitleText>
        </RowTitleCell>
        <RowCheckCell />
        <RowCheckCell bg="#fffbea">
          <CheckIcon />
        </RowCheckCell>
      </TableRow>

      {/* 6) Dedicated Gold support team */}
      <TableRow style={{ borderBottomWidth: 0 }}>
        <RowTitleCell>
          <RowTitleText>Dedicated Gold support team</RowTitleText>
        </RowTitleCell>
        <RowCheckCell />
        <RowCheckCell bg="#fffbea">
          <CheckIcon />
        </RowCheckCell>
      </TableRow>
    </ComparisonCard>
  );

  // FAQ content
  const renderFaqs = () => (
    <FaqCard>
      {FAQ_ITEMS.map((item, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <FaqItemContainer key={index} first={index === 0}>
            <QuestionRow onPress={() => handleToggleFaq(index)}>
              <QuestionText>{item.question}</QuestionText>
              <ArrowIcon expanded={isExpanded} />
            </QuestionRow>
            {isExpanded && (
              <AnswerContainer>
                <AnswerText>
                  {item.answer}
                  {item.extraLinkText && (
                    <LinkText
                      onPress={() => Linking.openURL("https://www.goodrx.com")}
                    >
                      {item.extraLinkText}
                    </LinkText>
                  )}
                </AnswerText>
              </AnswerContainer>
            )}
          </FaqItemContainer>
        );
      })}
    </FaqCard>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Container>
        {/* Scrollable area for both tabs */}
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* MAIN TITLE & SUBTITLE */}
          <MainTitle>Unlock bigger savings and benefits with Gold</MainTitle>
          <SubTitle>Over 1,000 medications for less than $10</SubTitle>

          {/* TABS */}
          <TabsRow>
            <TabButton onPress={() => setActiveTab("gold")}>
              <TabButtonLabel active={activeTab === "gold"}>
                Gold benefits
              </TabButtonLabel>
              {activeTab === "gold" && <ActiveTabIndicator />}
            </TabButton>

            <TabButton onPress={() => setActiveTab("faq")}>
              <TabButtonLabel active={activeTab === "faq"}>FAQs</TabButtonLabel>
              {activeTab === "faq" && <ActiveTabIndicator />}
            </TabButton>
          </TabsRow>

          {/* Conditional rendering of Gold or FAQ sections */}
          {activeTab === "gold" ? renderGoldBenefits() : renderFaqs()}
        </ScrollView>

        {/* Sticky CTA at bottom */}
        <StickyCtaWrapper>
          <CtaButton>
            <CtaButtonText>Try Gold for free today</CtaButtonText>
          </CtaButton>
        </StickyCtaWrapper>
      </Container>
    </SafeAreaView>
  );
};

export default Home;
