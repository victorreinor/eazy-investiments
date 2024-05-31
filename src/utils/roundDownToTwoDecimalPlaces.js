module.exports = function (number) {
  if (typeof number !== 'number' || isNaN(number)) throw new Error('Input must be a valid number.');
  return Math.floor(number * 100).toFixed(2) / 100;
}