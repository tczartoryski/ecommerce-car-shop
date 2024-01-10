import TextField from "@mui/material/TextField";
import * as React from "react";


const styles = {
    inputLabel: {
        color: 'var(--color-text)',
    },
    input: {
        color: 'var(--color-text)',
    },
    formLabel: {
        color: 'var(--color-text)',
    },
};
const  InputTextField = ({handleChange, id, label, autoComplete, type}) => {

    return (
        <TextField
            margin="normal"
            required
            fullWidth
            onChange={handleChange}
            id={id}
            label={label}
            type={type}
            name={id}
            autoComplete={autoComplete}
            InputLabelProps={{
                style: styles.inputLabel,
            }}
            InputProps={{
                style: styles.input,
            }}
            FormLabelProps={{
                style: styles.formLabel,
            }}
        />
    )
}
export default InputTextField;