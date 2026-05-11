import { Rule } from "antd/es/form";

type ValidatorRules =
  | "required"
  | "password"
  | "passwordMatch"
  | "email"
  | "numericOnly"
  | "phoneNumber";

const useValidator = () => {
  const validator: { [key in ValidatorRules]: Rule } = {
    required: {
      required: true,
      message: "This field is required",
    },
    email: {
      pattern: /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi,
      message: "Invalid email address",
    },
    numericOnly: {
      pattern: /^\d+$/,
      message: "Only numbers are allowed",
    },
    password: {
      min: 8,
      message: "Password must be at least 8 characters long",
    },
    phoneNumber: {
      pattern:
        /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm,
      message: "Invalid phone number",
    },
    passwordMatch: ({
      getFieldValue,
    }: {
      getFieldValue: (name: string) => string | undefined;
    }) => ({
      validator(_: Rule, value: string) {
        if (!value || getFieldValue("new_password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error("The two passwords that you entered do not match.")
        );
      },
    }),
  };

  return validator;
};

export default useValidator;
