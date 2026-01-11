import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vehicleApi } from '@/services/api';

interface AddVehicleModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddVehicleModal({ visible, onClose, onSuccess }: AddVehicleModalProps) {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [vin, setVin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setMake('');
        setModel('');
        setYear('');
        setPlateNumber('');
        setVin('');
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        // Validation - only make, model, and year are required
        if (!make.trim() || !model.trim() || !year.trim()) {
            setError('Make, Model, and Year are required');
            return;
        }

        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            setError('Please enter a valid year');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const vehicleData: any = {
                make: make.trim(),
                model: model.trim(),
                year: yearNum,
            };

            // Only add plateNumber and vin if they have values
            if (plateNumber.trim()) {
                vehicleData.plateNumber = plateNumber.trim();
            }
            if (vin.trim()) {
                vehicleData.vin = vin.trim();
            }

            await vehicleApi.addVehicle(vehicleData);

            // Success
            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add vehicle';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add New Vehicle</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                        {/* Make */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Make *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Honda, Toyota, Ford"
                                value={make}
                                onChangeText={setMake}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Model */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Model *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Civic, Camry, F-150"
                                value={model}
                                onChangeText={setModel}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Year */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Year *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., 2020"
                                value={year}
                                onChangeText={setYear}
                                keyboardType="number-pad"
                                maxLength={4}
                            />
                        </View>

                        {/* Plate Number */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Plate Number (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., ABC-1234"
                                value={plateNumber}
                                onChangeText={setPlateNumber}
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* VIN */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>VIN (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="17-character Vehicle Identification Number"
                                value={vin}
                                onChangeText={setVin}
                                autoCapitalize="characters"
                                maxLength={17}
                            />
                        </View>

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Add Vehicle</Text>
                            )}
                        </TouchableOpacity>

                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B3020',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});

