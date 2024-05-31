module.exports = function (value) {
  if (!value) value = 0;
  return value.toFixed(2) + '%';
}