import { nameValidator, phoneValidator } from './validators'

export default {
  fullname: [
    {
      required: true,
      message: 'The field is required',
      trigger: 'change'
    },
    {
      message: 'Name and surname has to have at least 2 characters',
      validator: nameValidator,
      trigger: 'change'
    }
  ],
  phone: [
    {
      required: true,
      message: 'The field is required',
      trigger: 'change'
    },
    {
      message: 'Format has to be 380 XXXXXXXXX',
      validator: phoneValidator,
      trigger: 'change'
    }
  ],
  city: [
    {
      required: true,
      message: 'The field is required',
      trigger: 'change'
    }
  ],
  post: [
    {
      required: true,
      message: 'The field is required',
      trigger: 'change'
    },
    {
      message: 'Post has to contain only numbers',
      type: 'number',
      trigger: 'change'
    }
  ],
  invoice: [
    {
      message: 'Has to be number',
      type: 'number',
      trigger: 'change'
    }
  ]
}