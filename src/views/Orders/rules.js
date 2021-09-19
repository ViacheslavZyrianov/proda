import { name, phone, number } from './validators'

export default {
  fullname: [
    {
      required: true,
      message: 'The field is required',
      trigger: 'change'
    },
    {
      message: 'Name and surname has to have at least 2 characters',
      validator: name,
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
      validator: phone,
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
      message: 'Has to be number',
      validator: number,
      trigger: 'change'
    }
  ],
  invoice: [
    {
      message: 'Has to be number',
      validator: number,
      trigger: 'change'
    }
  ]
}