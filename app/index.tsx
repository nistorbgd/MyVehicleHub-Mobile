import {useRouter} from "expo-router";
import {Alert, StyleSheet, Text, TouchableOpacity, View, ImageBackground} from "react-native";
import { AntDesign, FontAwesome } from '@expo/vector-icons';

export default function AuthHomeScreen() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/auth/login');
    }

    const handleRegister = () => {
        router.push('/auth/register');
    }

    const handleGoogleAuth = () => {
        Alert.alert(
            'Coming Soon',
            'Google authentication will be implemented soon!',
            [{ text: 'OK' }]
        )
    }

    const handleFacebookAuth = () => {
        Alert.alert(
            'Coming Soon',
            'Facebook authentication will be implemented soon!',
            [{ text: 'OK' }]
        )
    }

    const handleAppleAuth = () => {
        Alert.alert(
            'Coming Soon',
            'Google authentication will be implemented soon!',
            [{ text: 'OK' }]
        )
    }

    return (
        <ImageBackground source={require('@/assets/images/auth-background.jpg')}
                         style = {styles.container}
                         resizeMode="cover">
            <View style={styles.overlay}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Welcome to</Text>
                    <Text style={styles.appName}>MyVehicleHub</Text>
                    <Text style={styles.subtitle}>Manage your vehicles in one place</Text>
                </View>

                <View style={styles.buttonsSection}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Create account</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or sign-in with</Text>
                    <View style={styles.dividerLine} />
                </View>

            <View style={styles.socialButtonsRow}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleAuth}>
                    <AntDesign name="google" size={24} color="#4285F4" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={handleFacebookAuth}>
                    <FontAwesome name="facebook" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={handleAppleAuth}>
                    <AntDesign name="apple" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            </View>
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.50)',
        padding: 20,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 24,
        color: '#444',
        marginBottom: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#222',
        textAlign: 'center',
        marginBottom: 25
    },
    buttonsSection: {
        width: '100%',
    },
    loginButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#000000',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#000000',
        fontSize: 14,
    },
    socialButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    appleButton: {
        backgroundColor: '#000',
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
});