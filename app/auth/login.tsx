import {useState, useEffect} from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Stack, useRouter} from "expo-router";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {AuthInput} from "@/components/AuthInput";
import {authApi} from "@/services/api";
import {saveTokens} from "@/services/tokenStorage";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000); // 3 seconds

            // Cleanup timer if component unmounts or error changes
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogin = async () => {
        setError(null);

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }

        setLoading(true);

        try {
            // Call the real API
            const response = await authApi.login({ email, password });

            // Validate response
            if (!response || !response.jwtToken || !response.refreshToken) {
                throw new Error('Invalid login response - missing tokens');
            }

            // Save both JWT and refresh tokens to secure storage
            await saveTokens(response.jwtToken, response.refreshToken);

            await new Promise(resolve => setTimeout(resolve, 500));

            // Navigate to authenticated section
            router.replace('/(authenticated)/(tabs)');

        } catch (error) {
            // API returned an error
            const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
            setError(errorMessage);
            console.error('Login error:', error);

        } finally {
            // Always stop loading, whether success or error
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = () => {
        Alert.alert('Coming Soon', 'Password recovery will be available soon!');
    };

    const handleRegister = () => {
        router.replace('/auth/register');
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={"#000"} />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.title}>Login</Text>

                    {/* Error Message - only show if error exists */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <AuthInput
                            icon="person-outline"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            editable={!loading}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <AuthInput
                            icon="lock-closed-outline"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password"
                            editable={!loading}
                            showPasswordToggle={true}
                            isPasswordVisible={showPassword}
                            onTogglePassword={toggleShowPassword}
                        />
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={styles.forgotPasswordButton}
                    >
                        <Text style={styles.forgotPasswordText}>
                            Forgot password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            loading && styles.loginButtonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Register Link */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        style={styles.registerButton}
                    >
                        <Text style={styles.registerText}>
                            Don&apos;t have an account? <Text style={styles.registerTextBold}>Sign up</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom Branding */}
                    <View style={styles.bottomBranding}>
                        <View style={styles.brandIcons}>
                            <Ionicons name="car-sport" size={32} color="#3498DB" />
                            <MaterialCommunityIcons name="motorbike" size={32} color="#1ABC9C" style={styles.motorcycleIcon} />
                        </View>
                        <Text style={styles.brandName}>MyVehicleHub</Text>
                        <Text style={styles.brandTagline}>Your vehicles, simplified</Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 30,
        marginTop: 24,
        textAlign: "center",
    },
    errorContainer: {
        backgroundColor: '#FFE5E5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 12,
    },
    forgotPasswordText: {
        color: '#3498DB',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    loginButtonDisabled: {
        backgroundColor: '#B0B0B0',
        opacity: 0.7,
    },
    registerButton: {
        alignSelf: 'center',
        marginTop: 24,
    },
    registerText: {
        color: '#666',
        fontSize: 15,
    },
    registerTextBold: {
        color: '#3498DB',
        fontWeight: '600',
    },
    bottomBranding: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 60,
        paddingBottom: 30,
    },
    brandIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    motorcycleIcon: {
        marginLeft: 16,
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 12,
    },
    brandTagline: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});