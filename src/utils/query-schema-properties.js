export const getQuerySchemaProperties = (schema, prefix = '') => {
  const properties = {}
  for (const [key, value] of Object.entries(schema.properties)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value.type === 'object') {
      fullKey.includes('.') && (properties[fullKey] = { type: 'string' })
      const nestedProperties = getQuerySchemaProperties(value, fullKey)
      Object.assign(properties, nestedProperties)
    } else {
      fullKey.includes('.') && (properties[fullKey] = { type: 'string' })
    }
  }
  return properties
}
