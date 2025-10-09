export const validate = (schema, source) => (req, res, next) => {
    const {error} = schema.validate(req[source], {abortEarly: false});

    if (error) {
        console.log(error)
        return res.status(500).json({message: "Invalid values."});
    }
    next()
}