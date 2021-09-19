export const name = ({ message }, value, callback) => {
  if (!value.match(/.{2,}\s.{2,}/)) return callback(new Error(message))
}

export const phone = ({ message }, value, callback) => {
  if (!value.match(/\d{9}/)) return callback(new Error(message))
}

export const number = ({ message }, value, callback) => {
  if (!value.match(/^\d+$/)) return callback(new Error(message))
}