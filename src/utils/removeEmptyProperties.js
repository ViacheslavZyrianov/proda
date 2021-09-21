export default obj => {
  return Object.keys(obj).reduce((acc, val) => {
    if (obj[val]) acc[val] = obj[val]
    return acc
  }, {})
}
