import { Dimensions, StyleSheet } from 'react-native'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
    window: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FF0000',
    },

    title: {
        fontSize: 48,
        textAlign: 'center',
        color: 'white',
        textShadowColor: '#000000',
        textShadowRadius: 10,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 18,
        borderColor: '#202020',
        width: screenWidth * 0.96,
        backgroundColor: '#2A2A2A',
    },

    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderRadius: 6,
        width: 40,
        backgroundColor: '#E60000',
    },

    inputView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    inputViewText: {
        fontSize: 18,
        color: 'white',
    },

    textInput: {
        marginHorizontal: 4,
        padding: 4,
        borderRadius: 8,
        backgroundColor: '#3E3E3E',
        fontSize: 18,
        color: 'white',
    },

    infoTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: screenHeight * 0.325,
        width: screenWidth * 0.9,
        height: screenWidth * 0.9,
    },

    infotext: {
        position: 'absolute',
        textShadowRadius: 10,
        width: screenWidth * 0.9,
        fontSize: 32,
        textAlign: 'center',
        color: 'white',
        textShadowColor: '#000000',
    },

    backgroundImage: {
        position: 'absolute',
        opacity: 0.15,
        width: screenWidth,
        height: screenWidth,
    },

    backgroundText: {
        position: 'absolute',
        marginTop: screenHeight * 0.8,
        fontSize: 48,
        color: 'white',
        textShadowRadius: 10,
        textShadowColor: '#000000',
    },
})

export default styles
