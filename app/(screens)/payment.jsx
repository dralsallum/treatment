import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Navbar from "../components/navigation/navbar";
import * as RNIap from "react-native-iap";
import { createUserRequest } from "../../requestMethods";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const itemSkus = [
  "com.dralsallum.fluentfox.monthly",
  "com.dralsallum.fluentfox.quarterly",
  "com.dralsallum.fluentfox.yearly",
];

const features = [
  {
    text: "بدون إعلانات",
    description: "تجنب الانقطاعات.",
    image: require("../../assets/images/empty.png"),
  },
  {
    text: "زيادة الالتزام",
    description: "تابع تقدمك وتحسن مهاراتك بطرق منظمة وفعّالة.",
    image: require("../../assets/images/progress.png"),
  },
  {
    text: "دعم سريع بغضون ٢٤ ساعة",
    description: "تواصل مع مدربين مختصين للحصول على مساعدة سريعة.",
    image: require("../../assets/images/live-support.png"),
  },
  {
    text: "تقارير اسبوعية",
    description: "اطلع على تحليلات دقيقة حول تقدمك واستراتيجياتك.",
    image: require("../../assets/images/report.png"),
  },
];

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-top: 20px;
`;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const TopTe = styled.Text`
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: 600;
  text-align: right;
`;

const TopSubTe = styled.Text`
  font-size: 16px;
  color: rgb(75, 87, 102);
  text-align: right;
`;

const OreConAll = styled.View`
  flex-direction: row-reverse;
  justify-content: space-around;
  align-items: center;
`;

const OreCon = styled(TouchableOpacity)`
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin: 5px;
`;

const OreConTop = styled.View`
  align-items: center;
  width: 100px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: ${({ selected }) =>
    selected ? "rgb(84, 56, 220)" : "rgb(218, 225, 234)"};
  padding: 8px;
  background-color: #fff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const OreConMid = styled.View`
  align-items: center;
  width: 100px;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 1px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: rgb(218, 225, 234);
  background-color: #fff;
  padding: 5px;
`;

const OreConBot = styled.View`
  align-items: center;
  width: 100px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-color: black;
  padding: 8px;
`;

const OreConSub = styled.View`
  background-color: rgb(14, 190, 117);
  border-radius: 12px;
  padding: 5px 3px;
`;

const OreConLast = styled.View`
  align-items: center;
  width: 100px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-color: black;
  border-right-color: black;
  border-bottom-color: black;
  background-color: #fff;
  padding: 6px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const MonCon = styled.View`
  width: 100px;
  border-left-width: 2px;
  border-right-width: 2px;
  border-left-color: black;
  border-right-color: black;
  background-color: #fff;
  padding: 4px 8px;
`;

const MonTex = styled.Text`
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: rgb(30, 45, 64);
`;

const TextView = styled.View`
  gap: 4px;
`;

const Tex = styled.Text`
  font-size: ${({ size }) => size || "14px"};
  font-weight: 700;
  color: ${({ color }) => color || "#000"};
  text-align: center;
  margin-top: ${({ marginTop }) => marginTop || "0px"};
  margin-bottom: ${({ marginBottom }) =>
    marginBottom || "0px"}; /* Added marginBottom */
`;

const BotTex = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: rgb(30, 45, 64);
  text-align: center;
`;

const ButtonContainer = styled.View`
  width: 90%;
  padding: 10px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ bgColor }) => bgColor || "rgb(84, 56, 220)"};
  padding: 15px;
  border-radius: 25px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  color: ${({ color }) => color || "#fff"};
  font-size: 14px;
  text-align: center;
  font-weight: 600;
`;

const FeatureContainer = styled.View`
  width: 100%;
  padding: 20px;
  background-color: #fff;
`;

const FeatureItem = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 20px;
`;

const FeatureText = styled.Text`
  font-size: 15px;
  color: #000;
  flex: 1;
  text-align: right;
`;

const FeatureDes = styled.Text`
  font-size: 11px;
  color: #7f7f7f;
  flex: 1;
  text-align: right;
`;

const FeatureImage = styled.Image`
  width: 35px;
  height: 35px;
  margin-left: 10px;
  border-radius: 50%;
`;

const PricingCard = ({
  duration,
  price,
  monthlyPrice,
  title,
  discount,
  selected,
  onSelect,
  titleColor,
}) => (
  <OreCon onPress={onSelect}>
    <OreConTop selected={selected}>
      <Tex size="15px" color={titleColor || "#2068ed"} marginBottom="8px">
        {title}
      </Tex>
      <Tex size="14px">{duration}</Tex>
    </OreConTop>
    <OreConMid>
      <Tex color="rgb(14, 190, 117)">{price}</Tex>
    </OreConMid>

    <OreConBot>
      <OreConSub>
        <Tex color="#fff">{discount}</Tex>
      </OreConSub>
    </OreConBot>
    <OreConLast />
  </OreCon>
);

const Payment = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(1);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.user.currentUser?._id);
  const userIsPaid = useSelector((state) => state.user.currentUser?.isPaid);

  useEffect(() => {
    if (userIsPaid) {
      Alert.alert("You already have a premium membership");
      router.back();
    }
  }, [userIsPaid]);

  useEffect(() => {
    async function initIAP() {
      try {
        const result = await RNIap.initConnection();
        if (result) {
          const fetchedProducts = await RNIap.getSubscriptions({
            skus: itemSkus,
          });

          // Build pricingOptions from fetched products
          const options = fetchedProducts.map((product, index) => ({
            id: index + 1,
            duration: getDurationLabel(product),
            price: product.localizedPrice,
            title: getTitleLabel(product),
            titleColor: getTitleColor(product),
            discount: getDiscountLabel(product),
            productId: product.productId,
          }));
          setPricingOptions(options);
        } else {
          console.warn("Failed to connect to the store.");
        }
      } catch (error) {
        console.warn("IAP Error:", error);
      }
    }
    initIAP();
    return () => {
      RNIap.endConnection();
    };
  }, []);

  const getTitleLabel = (product) => {
    switch (product.productId) {
      case "com.dralsallum.fluentfox.monthly":
        return "البرنزي"; // Monthly Subscription
      case "com.dralsallum.fluentfox.quarterly":
        return "فضي"; // Quarterly Subscription
      case "com.dralsallum.fluentfox.yearly":
        return "ذهبي"; // Yearly Subscription
      default:
        return "اشتراك"; // Subscription
    }
  };

  const getTitleColor = (product) => {
    switch (product.productId) {
      case "com.dralsallum.fluentfox.monthly":
        return "#CD7F32"; // Bronze
      case "com.dralsallum.fluentfox.quarterly":
        return "#C0C0C0"; // Silver
      case "com.dralsallum.fluentfox.yearly":
        return "#FFD700"; // Gold
      default:
        return "#000"; // Default color
    }
  };

  const getDurationLabel = (product) => {
    switch (product.productId) {
      case "com.dralsallum.fluentfox.monthly":
        return "مدة الاشتراك ١ شهر";
      case "com.dralsallum.fluentfox.quarterly":
        return "مدة الاشتراك ٣ اشهر";
      case "com.dralsallum.fluentfox.yearly":
        return "مدة الاشتراك ١٢ شهر";
      default:
        return "";
    }
  };

  const getDiscountLabel = (product) => {
    let discountPercentage = 0;
    switch (product.productId) {
      case "com.dralsallum.fluentfox.monthly":
        discountPercentage = 0;
        break;
      case "com.dralsallum.fluentfox.quarterly":
        discountPercentage = 33;
        break;
      case "com.dralsallum.fluentfox.yearly":
        discountPercentage = 63;
        break;
      default:
        discountPercentage = 0;
    }
    return `خصم ${discountPercentage}%`;
  };

  const handlePurchase = async () => {
    setLoading(true);

    const selectedProduct = pricingOptions.find(
      (option) => option.id === selectedOption
    );

    if (!selectedProduct) {
      Alert.alert("Error", "Product not found. Please try again.");

      return;
    }

    try {
      const purchase = await RNIap.requestSubscription({
        sku: selectedProduct.productId,
      });
      const receiptData = purchase.transactionReceipt;

      if (receiptData) {
        await verifyPurchase(receiptData);
        router.push("home");
      } else {
        Alert.alert(
          "Purchase Error",
          "No receipt data found. Please try again."
        );
      }
    } catch (err) {
      handlePurchaseError(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPurchase = async (receiptData) => {
    try {
      const userRequest = createUserRequest();
      const response = await userRequest.post("/verifyPurchase", {
        userId,
        receiptData,
      });

      const data = response.data;
      if (data.success) {
        Alert.alert("Success", "Purchase verified successfully!");

        // Fetch the updated user data
        const updatedUserResponse = await userRequest.get(
          `/users/find/${userId}`
        );

        // Update the Redux store with the new user data
        dispatch(setUser(updatedUserResponse.data));
      } else {
        Alert.alert("Verification Failed", data.message);
      }
    } catch (error) {
      console.error("Verification Error:", error);
      if (error.response) {
        Alert.alert("Verification Error", error.response.data.message);
      } else if (error.request) {
        console.error("Request error:", error.request);
        Alert.alert(
          "Verification Error",
          "Cannot reach server. Please try again."
        );
      } else {
        console.error("Error message:", error.message);
        Alert.alert("Verification Error", error.message);
      }
    }
  };

  const handlePurchaseError = (err) => {
    if (err.code === "E_USER_CANCELLED") {
      Alert.alert("Purchase Cancelled", "You cancelled the purchase.");
    } else {
      console.error("Purchase Error:", err);
      Alert.alert("Purchase Error", "An error occurred. Please try again.");
    }
  };

  const getButtonText = () => {
    const selected = pricingOptions.find(
      (option) => option.id === selectedOption
    );
    return selected ? `فتح العضوية المميزة لمدة ${selected.duration}` : "";
  };

  return (
    <SafeArea>
      <Navbar />
      <ScrollView>
        <Container>
          <TopTe>ابدأ اليوم بدون مخاطر</TopTe>
          <TopSubTe>طور لغتك بطريقة علمية ومدروسة</TopSubTe>
          {pricingOptions.length > 0 ? (
            <OreConAll>
              {pricingOptions.map((option) => (
                <PricingCard
                  key={option.id}
                  {...option}
                  selected={selectedOption === option.id}
                  onSelect={() => setSelectedOption(option.id)}
                />
              ))}
            </OreConAll>
          ) : (
            <Tex>جاري تحميل المنتجات...</Tex>
          )}
          <ButtonContainer>
            <Button
              bgColor="rgb(14, 190, 117)"
              onPress={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ButtonText>{getButtonText()}</ButtonText>
              )}
            </Button>
            <Button bgColor="rgb(240, 240, 240)" onPress={() => router.back()}>
              <ButtonText color="rgb(30, 45, 64)">
                لا شكراً، أرغب بالتجربة مجاناً
              </ButtonText>
            </Button>
            <Button
              bgColor="rgb(240, 240, 240)"
              onPress={() => router.push("privacy")}
            >
              <ButtonText color="rgb(30, 45, 64)">الشروط والاحكام</ButtonText>
            </Button>
          </ButtonContainer>
          <BotTex>فتح ميزات العضوية المميزة</BotTex>
          <FeatureContainer>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureImage source={feature.image} />
                <TextView>
                  <FeatureText>{feature.text}</FeatureText>
                  <FeatureDes>{feature.description}</FeatureDes>
                </TextView>
              </FeatureItem>
            ))}
          </FeatureContainer>
        </Container>
      </ScrollView>
    </SafeArea>
  );
};

export default Payment;
