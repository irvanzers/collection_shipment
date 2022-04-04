import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Text as Texts  } from 'react-native-paper';
import adjust from './../Adjust';
const Text = props => {
  const {
    h1, h2, h3, h4, h5, h6, p, small, bold, italic, title, style, ...rest
  } = props;
  return (
    <Texts 
      allowFontScaling={false}
      style={[
        h1 && { fontSize: adjust(48) },
        h2 && { fontSize: adjust(32) },
        h3 && { fontSize: adjust(20) },
        h4 && { fontSize: adjust(18) },
        h5 && { fontSize: adjust(16) },
        h6 && { fontSize: adjust(14) },
        p && { fontSize: adjust(12) },
        small && { fontSize: adjust(10) },
        bold && { fontWeight: 'bold' },
        italic && { fontStyle: 'italic'},
        { letterSpacing: .5 },
        style
    ]}{...rest}>{title}</Texts>
  );
}

const styles = StyleSheet.create({
    
});

export default memo(Text);