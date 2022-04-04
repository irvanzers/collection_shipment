import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '../Text';
// import { bgSecondary } from '../../redux/constants/constant';

const MenuHome = (props) => {
    const navigation = useNavigation();
    const {
        item,
        ...attributes
    } = props;

    return (
        <View style={{alignItems: 'center',  flexWrap: 'nowrap', minHeight: 150}}>
            <TouchableHighlight
                underlayColor = '#ccc'
                onPress = { () => item.onNavigation() }
                style={{ minHeight: 110}}
            >
                <View style={{paddingVertical: 5, paddingHorizontal: 10, display: 'flex', alignItems: 'center', width: Dimensions.get('window').width/2, minHeight: 70}}>
                    <View style = {{
                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                        width: Dimensions.get('window').width * 0.15,
                        height: Dimensions.get('window').width * 0.15,
                        // backgroundColor: bgSecondary,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 100,
                    }}>
                        <Image source={item.image} style={{
                            width: Dimensions.get('window').width * 0.4,
                            height: Dimensions.get('window').width * 0.4,
                        }} />
                    </View>
                    <Text title={item.text} style={{paddingTop: 90, textAlign: 'center',}} small numberOfLine={2} />
                </View>
            </TouchableHighlight>
        </View>
    )
}


const styles = StyleSheet.create({
    text: {
        textAlign: 'center'
    }
});

export default MenuHome;
