import { useState } from "react";

export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(values);
      setValues(initialValues);
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Submission failed" });
    }
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearErrors = () => setErrors({});

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    clearErrors,
  };
};
