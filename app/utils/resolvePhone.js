function hasPhone(item) {
  return String(item?.phone ?? '').trim() !== ''
}

export function resolvePhone(phone_list, utm_source, connection_phone) {
  if (!Array.isArray(phone_list) || phone_list.length === 0) {
    return connection_phone
  }

  if (utm_source) {
    const matched = phone_list.find(item => item.source === utm_source && hasPhone(item))
    return matched?.phone || connection_phone
  }

  const fallback = phone_list.find(item => !String(item.source ?? '').trim() && hasPhone(item))
  return fallback?.phone || connection_phone
}
