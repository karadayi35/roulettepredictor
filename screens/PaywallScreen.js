import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform, Alert } from 'react-native';
import Purchases from "react-native-purchases";
import { useNavigation } from '@react-navigation/native';

// ✅ RevenueCat API Key (Google Play ve iOS için doğru anahtarları gir!)
const REVENUECAT_API_KEY = Platform.select({
  ios: "appl_YOUR_REVENUECAT_IOS_API_KEY", // <-- BURAYA iOS API ANAHTARINI GİR
  android: "goog_owTvFdIGeXmmkXEXUTGkGnPWtWc", // <-- BURAYA ANDROID API ANAHTARINI GİR
});

const PaywallScreen = () => {
    const navigation = useNavigation();
    const [offerings, setOfferings] = useState(null);

    useEffect(() => {
        const setupPurchases = async () => {
            try {
                // ✅ RevenueCat SDK'yı Başlat
                await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

                // ✅ Kullanıcının mevcut abonelik durumunu kontrol et
                const customerInfo = await Purchases.getCustomerInfo();
                if (customerInfo.entitlements.active["premium"]) {
                    navigation.replace("Roulette"); // Eğer kullanıcı zaten abonelik aldıysa, direk yönlendir
                    return;
                }

                // ✅ Mevcut teklifler ve fiyatlandırmalar alınıyor
                const offerings = await Purchases.getOfferings();
                if (offerings.current) {
                    setOfferings(offerings.current);
                }
            } catch (error) {
                console.error("RevenueCat Hatası:", error);
                Alert.alert("Error", "Something went wrong while setting up purchases.");
            }
        };

        setupPurchases();
    }, []);

    const handlePurchase = async () => {
        if (!offerings || !offerings.availablePackages.length) {
            Alert.alert("Subscription Package Not Found", "Please try again later.");
            return;
        }
        try {
            // ✅ Kullanıcı abonelik satın alıyor
            const purchaseMade = await Purchases.purchasePackage(offerings.availablePackages[0]);

            // ✅ Kullanıcı Premium olup olmadığını kontrol et
            if (purchaseMade.customerInfo.entitlements.active["premium"]) {
                Alert.alert("Subscription Successful", "Congratulations! Your Premium access is unlocked.");
                navigation.replace("Roulette"); // Kullanıcıyı asıl uygulama sayfasına yönlendir
            }
        } catch (error) {
            console.error("Purchase error:", error);
            Alert.alert("Purchase Failed", "Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Roulette Private Predictor</Text>
            <View style={styles.card}>
                <Text style={styles.price}>$17.00<Text style={styles.perMonth}> /Month</Text></Text>

                <View style={styles.featureContainer}>
                    <Text style={styles.feature}>✔ Unlimited Predictions</Text>
                    <Text style={styles.featureDescription}>
                        Make as many predictions as you want with no limitations.
                    </Text>
                </View>

                <View style={styles.featureContainer}>
                    <Text style={styles.feature}>✔ 90% Success Rate</Text>
                    <Text style={styles.featureDescription}>
                        Our advanced algorithms boost your chances of winning with up to 90% accuracy.
                    </Text>
                </View>

                <View style={styles.featureContainer}>
                    <Text style={styles.feature}>✔ Constant Updates</Text>
                    <Text style={styles.featureDescription}>
                        Regular updates ensure the app runs at peak performance with the latest features.
                    </Text>
                </View>

                <Text style={styles.termsText}>
                    By subscribing, you agree to our 
                    <Text style={styles.link} onPress={() => Linking.openURL('https://play.google.com/about/play-terms/')}> EULA </Text>
                    and 
                    <Text style={styles.link} onPress={() => Linking.openURL('https://www.freeprivacypolicy.com/live/0f30a182-7554-4482-bd58-af362323c083')}> Privacy Policy</Text>.
                </Text>
            </View>

            <TouchableOpacity style={styles.subscribeButton} onPress={handlePurchase}>
                <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'yellow',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#16202b',
        padding: 20,
        borderRadius: 15,
        width: '90%',
        alignItems: 'flex-start',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'yellow',
        textAlign: 'left',
    },
    perMonth: {
        fontSize: 18,
        color: 'white',
    },
    featureContainer: {
        marginTop: 15,
        width: '100%',
    },
    feature: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'yellow',
    },
    featureDescription: {
        fontSize: 14,
        color: 'white',
        textAlign: 'left',
        marginLeft: 25,
    },
    termsText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        width: '100%',
    },
    link: {
        color: 'yellow',
        fontWeight: 'bold',
    },
    subscribeButton: {
        backgroundColor: '#FFCC00',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 20,
    },
    subscribeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default PaywallScreen;
