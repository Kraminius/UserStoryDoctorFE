import { useState } from "react";
import { notification } from "antd";
import emailjs from 'emailjs-com';


interface IValues {
  name: string;
  email: string;
  message: string;
}

const initialValues: IValues = {
  name: "",
  email: "",
  message: "",
};

export const useForm = (validate: { (values: IValues): IValues }) => {
  const [formState, setFormState] = useState<{
    values: IValues;
    errors: IValues;
  }>({
    values: { ...initialValues },
    errors: { ...initialValues },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formState.values;
    const errors = validate(values);
    setFormState((prevState) => ({ ...prevState, errors }));

    try {
      if (Object.values(errors).every((error) => error === '')) {
        const result = await emailjs.send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID!,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
            {
              from_name: values.name,
              from_email: values.email,
              message: values.message,
            },
            process.env.REACT_APP_EMAILJS_USER_ID!
        );

        if (result.status === 200 || result.status === 204) {

          setFormState(() => ({
            values: { ...initialValues },
            errors: { ...initialValues },
          }));

          notification['success']({
            message: 'Success',
            description: 'Your message has been sent!',
          });
        } else {
          notification['error']({
            message: 'Error',
            description: 'There was an error sending your message, please try again later.',
          });
        }
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      notification['error']({
        message: 'Error',
        description: 'Failed to submit form. Please try again later.',
      });
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist();
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values: formState.values,
    errors: formState.errors,
  };
};
