export const validate = (schema, source) => (req, res, next) => {
    const {error} = schema.validate(req[source], {abortEarly: false});

    if (error) {
        console.log(error)
        return res.status(400).json({message: "Invalid values."});
    }
    next()
}