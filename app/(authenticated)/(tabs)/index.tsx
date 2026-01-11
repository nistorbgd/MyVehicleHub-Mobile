import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { authApi } from '@/services/api';
import AddVehicleModal from '@/components/AddVehicleModal';

interface UpcomingEvent {
    id: string;
    title: string;
    daysRemaining: number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export default function HomeScreen() {
    const [userName, setUserName] = useState<string>('');
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

    // Fetch user name for greeting
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authApi.getProfile();
                setUserName(data.firstName);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };
        void fetchProfile();
    }, []);

    const handleAddVehicle = () => {
        setShowAddVehicleModal(true);
    };

    const handleVehicleAdded = () => {
        Alert.alert(
            'Success! 🎉',
            'Vehicle added successfully! Switch to the Vehicles tab to see it.',
            [{ text: 'OK' }]
        );
    };

    // Mock data - will be replaced with real API data later
    const upcomingEvents: UpcomingEvent[] = [
        {
            id: '1',
            title: 'Maintenance',
            daysRemaining: 5,
            icon: 'build-outline',
            color: '#FF9500',
        },
        {
            id: '2',
            title: 'Insurance Renewal',
            daysRemaining: 22,
            icon: 'shield-checkmark-outline',
            color: '#4A90E2',
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Home</Text>
                {userName && (
                    <Text style={styles.greeting}>Welcome back, {userName}! 👋</Text>
                )}
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {/* Upcoming Events Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>

                    {upcomingEvents.map((event) => (
                        <View key={event.id} style={styles.eventCard}>
                            <View style={styles.eventLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: `${event.color}20` }]}>
                                    <Ionicons name={event.icon} size={24} color={event.color} />
                                </View>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                            </View>

                            <View style={styles.eventRight}>
                                <Text style={styles.daysNumber}>{event.daysRemaining}</Text>
                                <Text style={styles.daysLabel}>days</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Empty State if no events */}
                {upcomingEvents.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No upcoming events</Text>
                    </View>
                )}

                {/* Quick Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <TouchableOpacity style={styles.actionButton} onPress={handleAddVehicle}>
                        <View style={styles.actionLeft}>
                            <View style={[styles.actionIconContainer, { backgroundColor: '#4A90E220' }]}>
                                <Ionicons name="car" size={24} color="#4A90E2" />
                            </View>
                            <Text style={styles.actionText}>New Vehicle</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionLeft}>
                            <View style={[styles.actionIconContainer, { backgroundColor: '#34C75920' }]}>
                                <Ionicons name="add-circle" size={24} color="#34C759" />
                            </View>
                            <Text style={styles.actionText}>New Task</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Add Vehicle Modal */}
            <AddVehicleModal
                visible={showAddVehicleModal}
                onClose={() => setShowAddVehicleModal(false)}
                onSuccess={handleVehicleAdded}
            />
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
    greeting: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    eventLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        flex: 1,
    },
    eventRight: {
        alignItems: 'center',
        minWidth: 60,
    },
    daysNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    daysLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});

