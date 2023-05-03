import axios from "axios";

export const reCaptchaVerify = async (gReCaptchaToken) => {
  const result = axios
    .post(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        // eslint-disable-next-line no-undef
        secret: process.env.RECAPTCHA_SECRET,
        response: gReCaptchaToken,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    )
    .then((reCaptchaRes) => {
      if (reCaptchaRes?.data?.score > 0.5 && reCaptchaRes?.data?.success) {
        return {
          status: "success",
          message: "Trusted",
        };
      } else {
        return {
          status: "failure",
          message: "Not trusted",
        };
      }
    });
  return result;
};
