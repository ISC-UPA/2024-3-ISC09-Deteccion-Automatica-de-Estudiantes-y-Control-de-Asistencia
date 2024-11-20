import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    ClassDetails: {
        subject: string;
        schedule: string;
        classroom: string;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ClassDetails'>;

interface Class {
    subject: string;
    schedule: string;
    classroom: string;
}

const ClassCard: React.FC<Class> = ({ subject, schedule, classroom }) => {
    const navigation = useNavigation<NavigationProp>();

    const handlePress = () => {
        navigation.navigate('ClassDetails', { subject, schedule, classroom });
    };

    return (
        <TouchableOpacity style={styles.classCard} onPress={handlePress}>
            <View style={styles.classInfo}>
                <Text style={styles.classSubject}>{subject}</Text>
                <Text style={styles.classDetails}>{schedule}</Text>
                <Text style={styles.classDetails}>{classroom}</Text>
            </View>
            <FontAwesome name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>
    );
};

const ClassesScreen: React.FC = () => {
    const [sortOption, setSortOption] = useState<'alphabetical' | 'date'>('alphabetical');
    const [data, setData] = useState<Class[]>([
        { subject: 'Calculus', schedule: '8:00 - 9:50 AM', classroom: 'Room 301' },
        { subject: 'Embedded Systems', schedule: '9:00 - 10:50 AM', classroom: 'Room 501' },
        { subject: 'Physics', schedule: '10:00 - 11:50 AM', classroom: 'Room 401' },
    ]);

    const sortData = () => {
        if (sortOption === 'alphabetical') {
            return [...data].sort((a, b) => a.subject.localeCompare(b.subject));
        } else if (sortOption === 'date') {
            return [...data].sort((a, b) => a.schedule.localeCompare(b.schedule));
        }
        return data;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Classes</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSortOption(value)}
                    items={[
                        { label: 'Alphabetical', value: 'alphabetical' },
                        { label: 'Date', value: 'date' },
                    ]}
                    style={{
                        ...pickerSelectStyles,
                        placeholder: pickerSelectStyles.placeholder,
                    }}
                    value={sortOption}
                    placeholder={{ label: 'Select filter', value: null }}
                    useNativeAndroidPickerStyle={false}
                />
            </View>
            <FlatList
                contentContainerStyle={styles.listContainer} 
                data={sortData()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <ClassCard
                        subject={item.subject}
                        schedule={item.schedule}
                        classroom={item.classroom}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#000',
    },
    classCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 10,
      marginHorizontal: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    classInfo: {
      flex: 1,
    },
    classSubject: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
      marginBottom: 4,
    },
    classDetails: {
      fontSize: 14,
      color: '#666',
    },
    listContainer: {
      marginTop: 16, 
    },
  });
  
  
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        color: '#000',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginRight: 16, 
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        color: '#000',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginRight: 16,
    },
    placeholder: {
        color: '#aaa', 
    },
});

export default ClassesScreen;
