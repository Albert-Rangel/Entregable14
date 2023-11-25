export const generateUserErrorInfo = (user) => {

    return `One or more properties were incomplete or not valid.
    List of required properties:
    First_name: needs to be a string, received ${user.first_name}
    Last_Name: needs to be a string, received ${user.last_name}
    Email: needs to be a string, received ${user.email}`
}

export const generategeneralExepction = (error) => {

    return `A general error ocurred:
    ${error}
    `
}