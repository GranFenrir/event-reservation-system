import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  Show,
  SimpleShowLayout,
  Edit,
  SimpleForm,
  Create,
  TextInput,
  DateTimeInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  required,
} from 'react-admin';

export const EventList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="category" />
      <DateField source="startDate" />
      <DateField source="endDate" />
      <TextField source="venue.name" label="Venue" />
      <NumberField source="totalSeats" />
      <NumberField source="soldSeats" />
      <BooleanField source="isActive" />
    </Datagrid>
  </List>
);

export const EventShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="category" />
      <DateField source="startDate" />
      <DateField source="endDate" />
      <TextField source="venue.name" label="Venue" />
      <TextField source="venue.address" label="Venue Address" />
      <NumberField source="venue.capacity" label="Venue Capacity" />
      <NumberField source="totalSeats" />
      <NumberField source="soldSeats" />
      <BooleanField source="isActive" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export const EventEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={4} />
      <SelectInput
        source="category"
        choices={[
          { id: 'music', name: 'Music' },
          { id: 'sports', name: 'Sports' },
          { id: 'theater', name: 'Theater' },
          { id: 'conference', name: 'Conference' },
          { id: 'comedy', name: 'Comedy' },
          { id: 'other', name: 'Other' },
        ]}
      />
      <DateTimeInput source="startDate" validate={[required()]} />
      <DateTimeInput source="endDate" validate={[required()]} />
      <NumberInput source="totalSeats" validate={[required()]} />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);

export const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={4} />
      <SelectInput
        source="category"
        choices={[
          { id: 'music', name: 'Music' },
          { id: 'sports', name: 'Sports' },
          { id: 'theater', name: 'Theater' },
          { id: 'conference', name: 'Conference' },
          { id: 'comedy', name: 'Comedy' },
          { id: 'other', name: 'Other' },
        ]}
        validate={[required()]}
      />
      <DateTimeInput source="startDate" validate={[required()]} />
      <DateTimeInput source="endDate" validate={[required()]} />
      <NumberInput source="totalSeats" validate={[required()]} />
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
);
