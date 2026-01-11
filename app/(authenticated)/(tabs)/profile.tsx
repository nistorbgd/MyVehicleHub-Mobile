import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { deleteAllTokens } from '@/services/tokenStorage';
import { authApi } from '@/services/api';
import { CommonActions } from '@react-navigation/native';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
}

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Test refresh token flow
    const [isTestingRefresh, setIsTestingRefresh] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const data = await authApi.getProfile();
                setProfileData(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProfile();
    }, []);

    const resetToWelcome = () => {
        const rootNavigation = navigation.getParent();
        const nav = rootNavigation || navigation;

        nav.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'index' }],
            })
        );
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await authApi.logout();
            await deleteAllTokens();
            await new Promise(resolve => setTimeout(resolve, 500));
            resetToWelcome();
        } catch (error) {
            console.error('Logout error:', error);
            await deleteAllTokens();
            await new Promise(resolve => setTimeout(resolve, 500));
            resetToWelcome();
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleTestRefresh = async () => {
        setIsTestingRefresh(true);
        setTestResult(null);

        try {
            console.log('🧪 Testing token refresh flow...');
            const result = await authApi.testRefresh();
            console.log('✅ Test successful! Response:', result);
            setTestResult(`✅ Success! Token refresh working correctly.`);

            // Clear message after 3 seconds
            setTimeout(() => setTestResult(null), 3000);
        } catch (error) {
            console.error('❌ Test failed:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setTestResult(`❌ Failed: ${errorMsg}`);

            // Clear message after 5 seconds
            setTimeout(() => setTestResult(null), 5000);
        } finally {
            setIsTestingRefresh(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {/* Loading State */}
                {isLoading && (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#4A90E2" />
                        <Text style={styles.loadingMessage}>Loading profile...</Text>
                    </View>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Profile Data */}
                {!isLoading && !error && profileData && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Account Information</Text>

                            <View style={styles.infoRow}>
                                <Ionicons name="person-outline" size={20} color="#666" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Name</Text>
                                    <Text style={styles.infoValue}>{profileData.firstName} {profileData.lastName}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="mail-outline" size={20} color="#666" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{profileData.email}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={20} color="#666" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Age</Text>
                                    <Text style={styles.infoValue}>{profileData.age} years</Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* Test Refresh Button */}
                <TouchableOpacity
                    style={styles.testButton}
                    onPress={handleTestRefresh}
                    disabled={isTestingRefresh}
                >
                    <Ionicons name="refresh-outline" size={24} color="#4A90E2" />
                    <Text style={styles.testButtonText}>
                        {isTestingRefresh ? 'Testing...' : 'Test Token Refresh'}
                    </Text>
                </TouchableOpacity>

                {/* Test Result Message */}
                {testResult && (
                    <View style={[
                        styles.testResult,
                        { backgroundColor: testResult.startsWith('✅') ? '#34C75920' : '#FF3B3020' }
                    ]}>
                        <Text style={[
                            styles.testResultText,
                            { color: testResult.startsWith('✅') ? '#34C759' : '#FF3B30' }
                        ]}>
                            {testResult}
                        </Text>
                    </View>
                )}

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Loading Overlay */}
            {isLoggingOut && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color="#4A90E2" />
                        <Text style={styles.loadingText}>Logging out...</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingMessage: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoContent: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
        marginLeft: 12,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#4A90E2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    testButtonText: {
        fontSize: 16,
        color: '#4A90E2',
        fontWeight: '600',
        marginLeft: 12,
    },
    testResult: {
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    testResultText: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    loadingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
});

