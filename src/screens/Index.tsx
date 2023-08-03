import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'

import setNotification from '../utilities/notificationManager'
import { getData, storeData } from '../utilities/storageManager'
import styles from '../utilities/styles'

export default function Index() {
    StatusBar.setBackgroundColor('#FF0000')

    const [toggle, setToggle] = useState<boolean>(false)
    const [toggleText, setToggleText] = useState<string>('')
    const [number, setNumber] = useState<string>('')
    const [infoText, setInfoText] = useState<string>('')

    useEffect(() => {
        async function getDataAtStart() {
            const toggleValue = await getData('toggle')
            const numberValue = await getData('number')

            toggleValue == 'true'
                ? setInfoText(`Notification set for every ${numberValue} minutes.`)
                : setInfoText('No notification set.')

            setToggleText(toggleValue == 'true' ? 'OFF' : 'ON')

            if (toggleValue !== null && numberValue !== null) {
                setToggle(toggleValue == 'true')
                setNumber(numberValue)
            }

            const launched = await getData('launched')
            if (launched !== 'true') {
                Alert.alert(
                    'Welcome to Activity Reminder!',
                    "Activity Reminder is an app that reminds you to take a break from sitting and do an activity like stretching, jumping jacks, push-ups or any activity of your choosing.\n\nTo get started, input the amount of minutes you want the time between reminders to be and press the red 'ON' button.\n\nRemember to keep the app on in the background to receive notifications.",
                    [
                        {
                            text: 'Get started',
                        },
                    ]
                )
                storeData('launched', 'true')
            }
        }
        getDataAtStart()
    }, [])

    return (
        <SafeAreaView style={styles.window}>
            <Text style={styles.title}>Activity Reminder</Text>
            <View style={styles.inputContainer}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            setNotification(!toggle, number, setToggle, setToggleText, setInfoText)
                        }}
                        activeOpacity={0.5}
                        style={styles.button}>
                        <Text style={styles.inputViewText}>{toggleText}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.inputViewText}>Set notification for every</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value: string) => {
                            setNumber(value)
                            storeData('number', value)
                            //toggles the notification off if the textinput value is changed
                            if (toggle == true) {
                                setNotification(false, number, setToggle, setToggleText, setInfoText)
                            }
                        }}
                        onPressIn={() => {
                            setNumber('')
                        }}
                        value={number}
                        textAlign='center'
                        placeholder='0'
                        placeholderTextColor={'white'}
                        inputMode={'numeric'}
                        multiline={false}
                        maxLength={3}
                    />
                    <Text style={styles.inputViewText}>minutes.</Text>
                </View>
            </View>
            <View style={styles.infoTextContainer}>
                <Image
                    source={require('../../img/backgroundimage.png')}
                    style={styles.backgroundImage}
                />
                <Text style={styles.infotext}>{infoText}</Text>
            </View>
            <Text style={styles.backgroundText}>Good luck :)</Text>
        </SafeAreaView>
    )
}
