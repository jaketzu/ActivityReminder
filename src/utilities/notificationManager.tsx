import { Alert } from 'react-native'

import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
    IntervalTrigger,
    TimeUnit,
    TriggerType,
} from '@notifee/react-native'

import { storeData } from './storageManager'

//returns a string for the notification to display on its body
const notificationBodyText = () => {
    const index = Math.floor(Math.random() * 4)
    switch (index) {
        case 0:
            return 'Time to work on yourself!'

        case 1:
            return 'You can do it!'

        case 2:
            return "Do it! Don't let your dreams be dreams!"

        case 3:
            return "C'mon!"

        default:
            return 'ERROR'
    }
}

//this function is called when the user presses the toggle button
//sets or cancels the trigger notification based on the toggle variable
export default async function setNotification(
    toggle: boolean,
    interval: string,
    setToggle: React.Dispatch<React.SetStateAction<boolean>>,
    setToggleText: React.Dispatch<React.SetStateAction<string>>,
    setInfoText: React.Dispatch<React.SetStateAction<string>>
) {
    if (toggle) {
        //checks if battery optimization is enabled for the app and asks the user to disable it if it is enabled
        //checks that interval can be read as a number
        //checks the interval because due to restrictions with the notifee package it must be at least 15
        const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled()
        const intervalContainsOnlyNumbers = /^\d+$/.test(interval)
        const intervalMoreThan15 = Number(interval) >= 15
        await notifee.cancelAllNotifications()
        if (batteryOptimizationEnabled || !intervalContainsOnlyNumbers || !intervalMoreThan15) {
            if (batteryOptimizationEnabled) {
                Alert.alert(
                    'Restrictions Detected',
                    "To ensure notifications are delivered, please disable battery optimization for the app.\n\nTo do this, press 'OK' and go to 'All apps'. From there uncheck the 'Activity Reminder' app to disable battery optimization.",
                    [
                        {
                            text: 'OK',
                            onPress: async () => await notifee.openBatteryOptimizationSettings(),
                        },
                    ],
                    { cancelable: false }
                )
            }
            if (!intervalContainsOnlyNumbers) {
                Alert.alert(
                    'Input must be a number.',
                    'Please input a number.',
                    [
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ],
                    { cancelable: false }
                )
            } else if (!intervalMoreThan15) {
                Alert.alert(
                    'Interval must be set to at least 15 minutes.',
                    'Due to restrictions with the notification package, the interval must be set to at least 15 minutes.',
                    [
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ],
                    { cancelable: false }
                )
            }
            updateStates(false)
        } else {
            const settings = await notifee.getNotificationSettings()
            if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
                await notifee.requestPermission()
            }

            //creates a channel for notifications (required for android)
            const channelId = await notifee.createChannel({
                id: 'important',
                name: 'Important Notifications',
                vibration: true,
                importance: AndroidImportance.HIGH,
                visibility: AndroidVisibility.PUBLIC,
                badge: false,
            })

            //sets a category for notifications so quick actions can be used (required for ios)
            await notifee.setNotificationCategories([
                {
                    id: 'notification',
                    actions: [
                        {
                            id: 'done',
                            title: 'Done!',
                        },
                    ],
                },
            ])

            //creates an IntervalTrigger variable to the interval the user has input
            const trigger: IntervalTrigger = {
                type: TriggerType.INTERVAL,
                timeUnit: TimeUnit.MINUTES,
                interval: Number(interval),
            }

            try {
                //creates a trigger notification with a set of attributes and the trigger variable as a trigger
                await notifee.createTriggerNotification(
                    {
                        title: 'Time for a workout break. 😎',
                        body: notificationBodyText(),
                        android: {
                            channelId,
                            color: '#FF0000',
                            smallIcon: 'ic_small_icon',
                            lightUpScreen: true,
                            showTimestamp: true,
                            onlyAlertOnce: false,
                            pressAction: {
                                id: 'default',
                                launchActivity: 'default',
                            },
                            actions: [
                                {
                                    title: 'Done!',
                                    pressAction: {
                                        id: 'done',
                                    },
                                },
                            ],
                        },
                        ios: {
                            categoryId: 'notification',
                            foregroundPresentationOptions: {
                                badge: false,
                                sound: true,
                                banner: true,
                            },
                        },
                    },
                    trigger
                )
            } catch (e) {
                console.log(e)
            }
            updateStates(true)
        }
    } else {
        await notifee.cancelAllNotifications()
        updateStates(false)
    }

    //when called, updates the toggle, toggleText and infoText values and stores the data of toggle using AsyncStorage for use at launch
    function updateStates(notificationSet: boolean) {
        if (notificationSet) {
            setToggle(true)
            storeData('toggle', 'true')
            setToggleText('OFF')
            setInfoText(`Notification set for every ${interval} minutes.`)
        } else {
            setToggle(false)
            storeData('toggle', 'false')
            setToggleText('ON')
            setInfoText('No notification set.')
        }
    }
}

//the on__Event methods manage what happens when the user interacts with the notification's quick actions
//the only quick action set is the 'Done!' button, which removes the notification from the status bar and notifications panel
notifee.onBackgroundEvent(async ({ detail }) => {
    if (detail.pressAction?.id === 'done') {
        try {
            notifee.cancelDisplayedNotification(detail.notification?.id!)
        } catch (e) {
            console.log(e)
        }
    }
})

notifee.onForegroundEvent(async ({ detail }) => {
    if (detail.pressAction?.id === 'done') {
        try {
            notifee.cancelDisplayedNotification(detail.notification?.id!)
        } catch (e) {
            console.log(e)
        }
    }
})
