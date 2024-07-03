export class Utility {
  static fillTemplate(string, data) {
    return string.replace(/{{(.*?)}}/g, (match, p1) => data[p1.trim()] || '')
  }

  static findMissingKeys(obj1, obj2) {
    // Initialize an empty array to store missing keys
    let missingKeys = []

    // Loop through each key in obj1
    if (obj1)
      for (let key of obj1) {
        // Check if the key is not present in obj2
        if (!(key in obj2)) {
          // Add the missing key to the array
          missingKeys.push(key)
        }
      }

    // Return the array of missing keys
    return missingKeys
  }
}
