export const RECEIVE_STAFF = 'RECEIVE_STAFF'
export const RECEIVE_SERVICES = 'RECEIVE_SERVICES'

export function receiveServices(services){
    return {
        type: RECEIVE_SERVICES,
        services,
    }
}

export function receiveStaff(staff){
  return {
      type: RECEIVE_STAFF,
      staff,
  }
}
