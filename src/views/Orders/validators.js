export const nameValidator = ({ message }, value, callback) => {
  if (!value.match(/.{2,}\s.{2,}/)) return callback(new Error(message))
}

export const phoneValidator = ({ message }, value, callback) => {
  if (!value.match(/\d{9}/)) return callback(new Error(message))
}