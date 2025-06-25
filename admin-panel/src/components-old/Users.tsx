import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  SelectField,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  required,
  email,
} from 'react-admin';

export const UserList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <SelectField
        source="role"
        choices={[
          { id: 'user', name: 'User' },
          { id: 'admin', name: 'Admin' },
        ]}
      />
      <BooleanField source="isActive" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <SelectField
        source="role"
        choices={[
          { id: 'user', name: 'User' },
          { id: 'admin', name: 'Admin' },
        ]}
      />
      <BooleanField source="isActive" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required(), email()]} />
      <SelectInput
        source="role"
        choices={[
          { id: 'user', name: 'User' },
          { id: 'admin', name: 'Admin' },
        ]}
        validate={[required()]}
      />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);
