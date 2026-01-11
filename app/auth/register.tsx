import {useState, useEffect} from "react";
import {Stack, useRouter} from "expo-router";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {AuthInput} from "@/components/AuthInput";
import {authApi} from "@/services/api";


export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const router = useRouter();

    // Auto-dismiss message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000); // 3 seconds

            // Cleanup timer if component unmounts or message changes
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleRegister = async () => {
        setMessage(null);

        if (!firstName || !lastName || !age) {
            setMessage('Please fill in all the fields');
            return;
        }

        if (!email) {
            setMessage('Email is required')
            return;
        }

        if (!email.includes('@')) {
            setMessage('Please enter a valid email')
            return;
        }

        if (!password) {
            setMessage('Password is required');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authApi.register({ firstName, lastName, email, password, age });


            // Show success message and redirect to login
            setMessage('Account created successfully!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                handleLogin();
            }, 2000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Register failed. Please try again.';
            setMessage(errorMessage);
            console.error('Register error: ', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = () => {
        router.replace('/auth/login');
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
                    <Text style={styles.title}>Register</Text>

                    {/* Message - error or success */}
                    {message && (
                        <View style={[
                            styles.messageContainer,
                            message.startsWith('Account created') && styles.successContainer
                        ]}>
                            <Text style={[
                                styles.messageText,
                                message.startsWith('Account created') && styles.successText
                            ]}>{message}</Text>
                        </View>
                    )}

                    {/* FirstName input */}
                    <View style={styles.inputContainer}>
                        <AuthInput
                            icon="person-outline"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                            autoComplete="name-given"
                            editable={!loading}
                        />
                    </View>

                    {/* LastName input */}
                    <View style={styles.inputContainer}>
                        <AuthInput
                            icon="person-outline"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                            autoComplete="family-name"
                            editable={!loading}
                        />
                    </View>

                    {/* Email Input*/}
                    <View style={styles.inputContainer}>
                        <AuthInput
                            icon="mail-outline"
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

                    {/* Age input */}
                    <View style={styles.inputContainer}>
                        <AuthInput
                            icon="calendar-outline"
                            placeholder="Enter your age"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            loading && styles.registerButtonDisabled
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={styles.loginLinkButton}
                    >
                        <Text style={styles.loginLinkText}>
                            Already have an account? <Text style={styles.loginLinkTextBold}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>

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
    )
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
        minHeight: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 30,
        marginTop: 24,
        textAlign: "center",
    },
    messageContainer: {
        backgroundColor: '#FFE5E5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    messageText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
    },
    successContainer: {
        backgroundColor: '#E5F8ED',
        borderColor: '#34C759',
    },
    successText: {
        color: '#34C759',
    },
    inputContainer: {
        marginBottom: 20,
    },
    registerButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    registerButtonDisabled: {
        backgroundColor: '#B0B0B0',
        opacity: 0.7,
    },
    loginLinkButton: {
        alignSelf: 'center',
        marginTop: 24,
    },
    loginLinkText: {
        color: '#666',
        fontSize: 14,
    },
    loginLinkTextBold: {
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
    }



})