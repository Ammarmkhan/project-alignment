export const validate = (data) => {
    const errors = {};

    if (!data.name) {
        errors.name = 'Username is required';
    } else {
        delete errors.name;
    }

    if (!data.password) {
        errors.password = 'Password is required';
    } else {
        delete errors.password;
    }

    return errors;
}