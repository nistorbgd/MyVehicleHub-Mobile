import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
    icon: keyof typeof Ionicons.glyphMap;
    showPasswordToggle?: boolean;
    isPasswordVisible?: boolean;
    onTogglePassword?: () => void;
}

export function AuthInput({
    icon,
    showPasswordToggle = false,
    isPasswordVisible = false,
    onTogglePassword,
    ...textInputProps
}: AuthInputProps) {
    return (
        <View style={styles.inputWrapper}>
            <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholderTextColor="#999"
                {...textInputProps}
            />
            {showPasswordToggle && onTogglePassword && (
                <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIcon}>
                    <Ionicons
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={24}
                        color="#666"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 16,
    },
});

