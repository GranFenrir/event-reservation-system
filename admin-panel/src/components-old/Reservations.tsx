import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  SelectField,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  SelectInput,
  ReferenceField,
  ReferenceInput,
} from 'react-admin';

export const ReservationList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="eventId" reference="events">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="totalAmount" />
      <SelectField
        source="status"
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'confirmed', name: 'Confirmed' },
          { id: 'cancelled', name: 'Cancelled' },
        ]}
      />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export const ReservationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="eventId" reference="events">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="totalAmount" />
      <SelectField
        source="status"
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'confirmed', name: 'Confirmed' },
          { id: 'cancelled', name: 'Cancelled' },
        ]}
      />
      <DateField source="expiresAt" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const ReservationEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="eventId" reference="events">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <SelectInput
        source="status"
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'confirmed', name: 'Confirmed' },
          { id: 'cancelled', name: 'Cancelled' },
        ]}
      />
    </SimpleForm>
  </Edit>
);
