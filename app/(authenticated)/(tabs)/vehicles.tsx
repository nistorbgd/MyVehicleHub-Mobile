import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { vehicleApi } from '@/services/api';

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    plateNumber?: string;
    vin?: string;
}

export default function VehiclesScreen() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Refresh vehicles when tab comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchVehicles();
        }, [])
    );

    const fetchVehicles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await vehicleApi.getVehicles();
            setVehicles(response.vehicles || []);
        } catch (err) {
            console.error('Failed to fetch vehicles:', err);
            setError('Failed to load vehicles');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Vehicles</Text>
                {vehicles.length > 0 && !isLoading && (
                    <Text style={styles.subtitle}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</Text>
                )}
            </View>

            {/* Loading State */}
            {isLoading && (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.loadingText}>Loading vehicles...</Text>
                </View>
            )}

            {/* Error State */}
            {!isLoading && error && (
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchVehicles}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Vehicles List */}
            {!isLoading && !error && (
                <ScrollView style={styles.content}>
                    {vehicles.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="car-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No vehicles yet</Text>
                            <Text style={styles.emptySubtext}>Add your first vehicle from the Home tab</Text>
                        </View>
                    ) : (
                        vehicles.map((vehicle) => (
                            <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
                                <View style={styles.vehicleIcon}>
                                    <Ionicons name="car" size={32} color="#4A90E2" />
                                </View>
                                <View style={styles.vehicleInfo}>
                                    <Text style={styles.vehicleName}>
                                        {vehicle.make} {vehicle.model}
                                    </Text>
                                    <Text style={styles.vehicleYear}>{vehicle.year}</Text>
                                    {vehicle.plateNumber && (
                                        <View style={styles.vehicleDetail}>
                                            <Ionicons name="card-outline" size={14} color="#666" />
                                            <Text style={styles.vehicleDetailText}>{vehicle.plateNumber}</Text>
                                        </View>
                                    )}
                                    {vehicle.vin && (
                                        <View style={styles.vehicleDetail}>
                                            <Ionicons name="barcode-outline" size={14} color="#666" />
                                            <Text style={styles.vehicleDetailText}>{vehicle.vin}</Text>
                                        </View>
                                    )}
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
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
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#4A90E2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        fontWeight: '500',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
    vehicleIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90E220',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    vehicleYear: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    vehicleDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    vehicleDetailText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
    },
});

