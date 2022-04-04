import React from 'react';
import { Button, View } from 'react-native';
import TableView from 'react-native-tableview';

const { Section, Item } = TableView;

const ScannerDetail = () => {
  const tableView = React.createRef();

  return (
    <View style={{ flex: 1 }}>
      <TableView
        style={{ flex: 1 }}
        // editing={navigation.getParam('editing')}
      >
        <Section canMove canEdit>
          <Item canEdit={false}>Item 1</Item>
          <Item>Item 2</Item>
          <Item>Item 3</Item>
          <Item>Item 4</Item>
          <Item>Item 5</Item>
          <Item>Item 6</Item>
          <Item>Item 7</Item>
          <Item>Item 8</Item>
        </Section>
      </TableView>
    </View>
  );
};

export default ScannerDetail;