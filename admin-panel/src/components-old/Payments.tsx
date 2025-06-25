import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  SelectField,
  Show,
  SimpleShowLayout,
  ReferenceField,
} from 'react-admin';

export const PaymentList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="reservationId" reference="reservations">
        <TextField source="id" />
      </ReferenceField>
      <NumberField source="amount" />
      <TextField source="currency" />
      <SelectField
        source="status"
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'completed', name: 'Completed' },
          { id: 'failed', name: 'Failed' },
          { id: 'refunded', name: 'Refunded' },
        ]}
      />
      <TextField source="paymentMethod" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export const PaymentShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="reservationId" reference="reservations">
        <TextField source="id" />
      </ReferenceField>
      <NumberField source="amount" />
      <TextField source="currency" />
      <SelectField
        source="status"
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'completed', name: 'Completed' },
          { id: 'failed', name: 'Failed' },
          { id: 'refunded', name: 'Refunded' },
        ]}
      />
      <TextField source="paymentMethod" />
      <TextField source="transactionId" />
      <TextField source="description" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
