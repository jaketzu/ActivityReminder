import AsyncStorage from '@react-native-async-storage/async-storage'

async function storeData(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log(e)
    }
}

async function getData(key: string) {
    return AsyncStorage.getItem(key)
}

export { storeData, getData }
