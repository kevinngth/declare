import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@material-ui/core";
import requests from "../../helpers/api";

export default function Register({
  inputs,
  handleInputChange,
  errors,
  renderErrors,
  classes
}) {
  const { getCohortList } = requests;
  const [cohorts, setCohorts] = useState(["SEIF 3"]);

  let cohortItems = cohorts.map((name, index) => {
    return <MenuItem key={index} value={name}>{name}</MenuItem>;
  });

  useEffect(() => {
    getCohortList()
      .then(({ data }) => {
        setCohorts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const {
    ga_email: GAEmailErrors,
    mobile: mobileErrors,
    full_name: fullNameErrors,
    cohort: cohortErrors,
    user_type: userTypeErrors
  } = errors;
  return (
    <div>
      <TextField
        variant="outlined"
        margin="normal"
        error={GAEmailErrors.length > 0}
        helperText={GAEmailErrors.length > 0 && renderErrors(GAEmailErrors)}
        required
        fullWidth
        id="ga_email"
        label="GA Email Address"
        name="ga_email"
        // autoComplete="email"
        autoFocus
        value={inputs.ga_email}
        onChange={(e) => handleInputChange(e)}
      />
      {/* <TextField
        variant="outlined"
        errors={passwordErrors.length > 0}
        helperText={passwordErrors.length > 0 && renderErrors(passwordErrors)}
        margin="normal"
        required
        fullWidth
        id="password"
        label="Password"
        name="password"
        autoComplete="password"
        autoFocus
        type="password"
        value={inputs.password}
        onChange={(e) => handleInputChange(e)}
      /> */}
      {/* <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="verify_pass"
              label="Verify Password"
              name="verify_pass"
              autoComplete="password"
              autoFocus
              value={inputs.password}
              onChange={(e)=> handleInputChange(e)}
            /> */}
      <TextField
        variant="outlined"
        margin="normal"
        required
        error={mobileErrors.length > 0}
        helperText={mobileErrors.length > 0 && renderErrors(mobileErrors)}
        fullWidth
        id="mobile"
        label="Contact Number"
        name="mobile"
        autoComplete="mobile"
        value={inputs.mobile}
        onChange={(e) => handleInputChange(e)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        error={fullNameErrors.length > 0}
        helperText={fullNameErrors.length > 0 && renderErrors(fullNameErrors)}
        required
        fullWidth
        id="full_name"
        label="Full Name (as in NRIC)"
        name="full_name"
        autoComplete="full_name"
        value={inputs.full_name}
        onChange={(e) => handleInputChange(e)}
      />
      <FormControl
        className={classes.formControl}
        error={cohortErrors.length > 0}
      >
        <InputLabel shrink id="cohortLabel">
          Cohort Name
        </InputLabel>{" "}
        <Select
          labelId="cohortLabel"
          id="cohort"
          className={classes.selectEmpty}
          displayEmpty
          fullWidth
          name="cohort"
          value={inputs.cohort}
          placeholder="Cohort Name"
          onChange={(e) => handleInputChange(e)}
        >
          {cohortItems}
        </Select>
        {cohortErrors.length > 0 && (
          <FormHelperText>{renderErrors(cohortErrors)}</FormHelperText>
        )}
      </FormControl>
      <FormControl
        className={classes.formControl}
        error={userTypeErrors.length > 0}
      >
        <InputLabel shrink id="user_typeLabel">
          User Type
        </InputLabel>{" "}
        <Select
          // variant="outlined"
          labelId="user_typeLabel"
          id="user_type"
          className={classes.selectEmpty}
          displayEmpty
          fullWidth
          name="user_type"
          // label="cohort name"
          value={inputs.user_type}
          placeholder="User Type"
          onChange={(e) => handleInputChange(e)}
        >
          <MenuItem value="student">Student</MenuItem>;
          <MenuItem value="team">GA Team</MenuItem>;

        </Select>
        {userTypeErrors.length > 0 && (
          <FormHelperText>{renderErrors(userTypeErrors)}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}
